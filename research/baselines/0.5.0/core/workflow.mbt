///|
fn workflow_rows(value : Json, key : String) -> Array[Json] {
  match field(value, key) {
    Array(rows) => rows
    _ => []
  }
}

///|
fn workflow_key(pair : Json) -> String {
  review_pair_key(text(field(pair, "left")), text(field(pair, "right")))
}

///|
fn workflow_gate(report : Json, level : String) -> Json {
  if !["", "exact", "pixel", "candidate"].contains(level) {
    return error_json(
      "ARGUMENT_ERROR", "fail-on must be exact, pixel, or candidate",
    )
  }
  let mut bytes = 0
  let mut pixels = 0
  let mut candidates = 0
  let mut locals = 0
  for pair in workflow_rows(report, "pairs") {
    match text(field(pair, "evidence")) {
      "byte-identical" => bytes = bytes + 1
      "pixel-identical" => pixels = pixels + 1
      "perceptual-candidate" => candidates = candidates + 1
      "local-candidate" => locals = locals + 1
      _ => ()
    }
  }
  let matched = match level {
    "exact" => bytes
    "pixel" => bytes + pixels
    "candidate" => bytes + pixels + candidates + locals
    _ => 0
  }
  let complete = field(report, "complete") == Json(true)
  let result : Json = {
    "ok": true,
    "exitCode": Json(if matched > 0 { 3 } else if complete { 0 } else { 2 }),
    "failOn": Json(level),
    "matched": Json(matched),
    "complete": Json(complete),
    "counts": {
      "exact": Json(bytes),
      "pixel": Json(pixels),
      "candidate": Json(candidates),
    },
  }
  if field(field(report, "options"), "includeCrops") == Json(true) {
    if field(result, "counts") is Object(fields) {
      fields["localCandidate"] = Json(locals)
    }
  }
  result
}

///|
fn workflow_verify(report : Json, observations : Array[Json]) -> Json {
  let images : Map[String, Json] = Map([])
  let actual : Map[String, Json] = Map([])
  for image in workflow_rows(report, "images") {
    images[text(field(image, "id"))] = image
  }
  for image in observations {
    actual[text(field(image, "id"))] = image
  }
  let results : Array[Json] = []
  let mut valid = 0
  let mut invalid = 0
  let mut missing = 0
  let mut skipped = 0
  for pair in workflow_rows(report, "pairs") {
    let evidence = text(field(pair, "evidence"))
    if !exact_evidence(evidence) {
      skipped = skipped + 1
      continue
    }
    let left = text(field(pair, "left"))
    let right = text(field(pair, "right"))
    let a = actual.get(left).unwrap_or(Json::null())
    let b = actual.get(right).unwrap_or(Json::null())
    let digest = if evidence == "byte-identical" {
      "byteDigest"
    } else {
      "pixelDigest"
    }
    let expected_a = field(images.get(left).unwrap_or(Json::null()), digest)
    let expected_b = field(images.get(right).unwrap_or(Json::null()), digest)
    let status = if field(a, "status") == Json("missing") ||
      field(b, "status") == Json("missing") {
      "missing"
    } else if field(a, "status") == Json("ok") &&
      field(b, "status") == Json("ok") &&
      hex64(text(expected_a)) &&
      expected_a == expected_b &&
      field(a, digest) == expected_a &&
      field(b, digest) == expected_b {
      "valid"
    } else {
      "invalid"
    }
    match status {
      "valid" => valid = valid + 1
      "missing" => missing = missing + 1
      _ => invalid = invalid + 1
    }
    results.push({
      "pairKey": Json(workflow_key(pair)),
      "left": Json(left),
      "right": Json(right),
      "evidence": Json(evidence),
      "status": Json(status),
      "leftObservation": a,
      "rightObservation": b,
    })
  }
  {
    "ok": true,
    "auditId": field(report, "auditId"),
    "pairs": Json(results),
    "counts": {
      "valid": Json(valid),
      "invalid": Json(invalid),
      "missing": Json(missing),
      "skippedCandidates": Json(skipped),
    },
    "exitCode": Json(if invalid + missing > 0 { 4 } else { 0 }),
  }
}

///|
fn workflow_verification_inputs(report : Json) -> Json {
  let seen : Map[String, Bool] = Map([])
  let ids : Array[String] = []
  for pair in workflow_rows(report, "pairs") {
    if !exact_evidence(text(field(pair, "evidence"))) {
      continue
    }
    for name in ["left", "right"] {
      let id = text(field(pair, name))
      if !seen.contains(id) {
        seen[id] = true
        ids.push(id)
      }
    }
  }
  { "ok": true, "ids": Json(ids) }
}

///|
fn workflow_component_key(prefix : String, members : Array[String]) -> String {
  prefix + "-" + sha256(@utf8.encode(Json(members).stringify()))
}

///|
fn workflow_components(
  report : Json,
  confirmed : Map[String, Bool]?,
) -> Array[Json] {
  let images = workflow_rows(report, "images")
  let index : Map[String, Int32] = Map([])
  for i, image in images {
    index[text(field(image, "id"))] = i
  }
  let parents = Array::makei(images.length(), i => i)
  let touched : Map[Int32, Bool] = Map([])
  for pair in workflow_rows(report, "pairs") {
    if !candidate_evidence(text(field(pair, "evidence"))) {
      continue
    }
    if confirmed is Some(keys) && !keys.contains(workflow_key(pair)) {
      continue
    }
    let a = index.get(text(field(pair, "left")))
    let b = index.get(text(field(pair, "right")))
    if a is Some(left) && b is Some(right) {
      let ra = root(parents, left)
      let rb = root(parents, right)
      parents[rb] = ra
      touched[left] = true
      touched[right] = true
    }
  }
  let buckets : Map[Int32, Array[String]] = Map([])
  for i, image in images {
    if !touched.contains(i) {
      continue
    }
    let r = root(parents, i)
    match buckets.get(r) {
      Some(members) => members.push(text(field(image, "id")))
      None => buckets[r] = [text(field(image, "id"))]
    }
  }
  let groups : Array[Json] = []
  for _, members in buckets {
    members.sort_by((a, b) => a.lexical_compare(b))
    let prefix = if confirmed is Some(_) {
      "reviewed-candidate"
    } else {
      "candidate"
    }
    groups.push({
      "id": Json(workflow_component_key(prefix, members)),
      "members": Json(members),
      "evidence": Json(
        if field(field(report, "options"), "includeCrops") == Json(true) {
          "candidate-component"
        } else {
          "perceptual-component"
        },
      ),
    })
  }
  groups.sort_by((a, b) => {
    text(field(a, "id")).lexical_compare(text(field(b, "id")))
  })
  groups
}

///|
fn workflow_view(report : Json, show_low : Bool, group_id : String) -> Json {
  let groups = workflow_components(report, None)
  let members : Map[String, Bool] = Map([])
  for group in groups {
    if field(group, "id") == Json(group_id) {
      for image_id in workflow_rows(group, "members") {
        members[text(image_id)] = true
      }
    }
  }
  let keys : Array[String] = []
  let mut low = 0
  for pair in workflow_rows(report, "pairs") {
    let is_low = field(pair, "lowContrast") == Json(true)
    if is_low {
      low = low + 1
    }
    if !show_low && is_low {
      continue
    }
    if group_id != "" &&
      (
        !candidate_evidence(text(field(pair, "evidence"))) ||
        !members.contains(text(field(pair, "left"))) ||
        !members.contains(text(field(pair, "right")))
      ) {
      continue
    }
    keys.push(workflow_key(pair))
  }
  {
    "ok": true,
    "keys": Json(keys),
    "lowContrastPairs": Json(low),
    "candidateGroups": Json(groups),
  }
}

///|
fn workflow_rank(image : Json) -> Int32 {
  match text(field(image, "split")) {
    "train" => 0
    "validation" => 1
    "test" => 2
    _ => 3
  }
}

///|
fn workflow_csv_cell(value : String) -> String {
  let output = StringBuilder()
  output.write_char('"')
  // Preserve paths exactly in this machine-readable CSV; do not invent a
  // different dataset path by rewriting formula-like names.
  for c in value.iter() {
    if c == '"' {
      output.write_char('"')
    }
    output.write_char(c)
  }
  output.write_char('"')
  output.to_string()
}

///|
fn workflow_fixes(report : Json, reviews : Array[Json]) -> Json {
  let images : Map[String, Json] = Map([])
  for image in workflow_rows(report, "images") {
    images[text(field(image, "id"))] = image
  }
  let decisions : Map[String, String] = Map([])
  let confirmed : Map[String, Bool] = Map([])
  for review in reviews {
    let key = text(field(review, "pairKey"))
    decisions[key] = text(field(review, "decision"))
    if field(review, "decision") == Json("confirmed") {
      confirmed[key] = true
    }
  }
  let components : Array[Json] = []
  for group in workflow_rows(report, "groups") {
    components.push({ "members": field(group, "members"), "kind": "exact" })
  }
  for group in workflow_components(report, Some(confirmed)) {
    let ids = workflow_rows(group, "members").map(v => text(v))
    let mut has_local = false
    for pair in workflow_rows(report, "pairs") {
      if field(pair, "evidence") == Json("local-candidate") &&
        confirmed.contains(workflow_key(pair)) &&
        ids.contains(text(field(pair, "left"))) &&
        ids.contains(text(field(pair, "right"))) {
        has_local = true
      }
    }
    components.push({
      "members": field(group, "members"),
      "kind": "reviewed-candidate",
      "local": Json(has_local),
    })
  }
  let rows : Array[Json] = []
  let csv = StringBuilder()
  csv.write_string(
    "group_id,evidence_level,split,path,review_status,suggestion\r\n",
  )
  for group in components {
    let ids = workflow_rows(group, "members").map(v => text(v))
    if ids.length() < 2 {
      continue
    }
    ids.sort_by((a, b) => {
      let aa = images.get(a).unwrap_or(Json::null())
      let bb = images.get(b).unwrap_or(Json::null())
      let priority = workflow_rank(aa) - workflow_rank(bb)
      if priority != 0 {
        priority
      } else {
        text(field(aa, "path")).lexical_compare(text(field(bb, "path")))
      }
    })
    let stable = ids.copy()
    stable.sort_by((a, b) => a.lexical_compare(b))
    let kind = text(field(group, "kind"))
    let id = workflow_component_key(kind, stable)
    let keeper = images.get(ids[0]).unwrap_or(Json::null())
    for i, image_id in ids {
      let image = images.get(image_id).unwrap_or(Json::null())
      let evidence = if kind == "reviewed-candidate" {
        if field(group, "local") == Json(true) {
          "local-candidate"
        } else {
          "perceptual-candidate"
        }
      } else if field(image, "byteDigest") == field(keeper, "byteDigest") &&
        hex64(text(field(image, "byteDigest"))) {
        "byte-identical"
      } else {
        "pixel-identical"
      }
      let decision = if kind == "reviewed-candidate" {
        "confirmed"
      } else {
        decisions.get(review_pair_key(ids[0], image_id)).unwrap_or("pending")
      }
      let split = text(field(image, "split"))
      let suggestion = if i == 0 { "keep" } else { "remove-from-" + split }
      let path = text(field(image, "path"))
      let values = [id, evidence, split, path, decision, suggestion]
      for col, value in values {
        if col > 0 {
          csv.write_char(',')
        }
        csv.write_string(workflow_csv_cell(value))
      }
      csv.write_string("\r\n")
      rows.push({
        "group_id": Json(id),
        "evidence_level": Json(evidence),
        "split": Json(split),
        "path": Json(path),
        "review_status": Json(decision),
        "suggestion": Json(suggestion),
      })
    }
  }
  { "ok": true, "csv": Json(csv.to_string()), "rows": Json(rows) }
}

///|
fn workflow_split(path : String, directories : Json) -> String {
  let parts = path.split("/").map(p => p.to_owned()).collect()
  if parts.is_empty() {
    "unknown"
  } else {
    let split = text(field(directories, parts[0]))
    if split == "" {
      "unknown"
    } else {
      split
    }
  }
}

///|
fn workflow_coverage(request : Json) -> Json {
  let report = field(request, "report")
  let directories = field(field(report, "scope"), "splitDirectories")
  let audited : Map[String, Bool] = Map([])
  for image in workflow_rows(report, "images") {
    audited[text(field(image, "path"))] = true
  }
  let rejected : Map[String, Bool] = Map([])
  let budgets : Array[Json] = []
  let errors = workflow_rows(report, "errors")
  for error in errors {
    let path = text(field(error, "path"))
    if path != "" {
      rejected[path] = true
    }
    let code = text(field(error, "code"))
    if code.has_suffix("_BUDGET") {
      budgets.push(error)
    }
  }
  let reason = text(field(field(report, "stats"), "reason"))
  let images = workflow_rows(report, "images")
  let processed_value = integer(
    field(field(report, "stats"), "processedImages"),
  )
  let processed = if processed_value < 0 {
    images.length()
  } else {
    processed_value
  }
  if reason != "" && reason != "no-decodable-images" {
    budgets.push({
      "code": Json(reason),
      "stage": "core-comparison",
      "processedImages": field(field(report, "stats"), "processedImages"),
      "emittedPairs": field(field(report, "stats"), "emittedPairs"),
      "atImage": if processed < images.length() {
        field(images[processed], "path")
      } else {
        Json::null()
      },
    })
  }
  let summary = StringBuilder()
  summary.write_string("已审计 ")
  let splits : Map[String, Json] = Map([])
  let mut rejected_total = 0
  let mut ignored_total = 0
  let mut unprocessed_total = 0
  for n, split in ["train", "validation", "test", "unknown"] {
    let mut count = 0
    let mut fingerprinted = 0
    let mut ignored = 0
    let mut unprocessed = 0
    let reasons : Map[String, Json] = Map([])
    for i, image in images {
      if field(image, "split") == Json(split) {
        fingerprinted = fingerprinted + 1
        if i < processed {
          count = count + 1
        } else {
          unprocessed = unprocessed + 1
        }
      }
    }
    for error in errors {
      let path = text(field(error, "path"))
      if workflow_split(path, directories) == split {
        let code = text(field(error, "code"))
        let before = integer(reasons.get(code).unwrap_or(Json(0)))
        reasons[code] = Json(before + 1)
        rejected_total = rejected_total + 1
      }
    }
    for image in workflow_rows(request, "ignored") {
      if field(image, "split") == Json(split) {
        ignored = ignored + 1
      }
    }
    for image in workflow_rows(request, "discovered") {
      let path = text(field(image, "path"))
      if field(image, "split") == Json(split) &&
        !audited.contains(path) &&
        !rejected.contains(path) {
        unprocessed = unprocessed + 1
      }
    }
    ignored_total = ignored_total + ignored
    unprocessed_total = unprocessed_total + unprocessed
    splits[split] = {
      "audited": Json(count),
      "fingerprinted": Json(fingerprinted),
      "rejectedByCode": Json::object(reasons),
      "ignored": Json(ignored),
      "unprocessed": Json(unprocessed),
    }
    if n < 3 {
      if n > 0 {
        summary.write_string(" / ")
      }
      summary.write_string(split + " " + count.to_string())
    }
  }
  summary.write_string(
    "；拒收/错误 " +
    rejected_total.to_string() +
    "；忽略 " +
    ignored_total.to_string() +
    "；已发现但未审计 " +
    unprocessed_total.to_string(),
  )
  summary.write_string("；结论只覆盖已审计输入与已完成比较。")
  {
    "ok": true,
    "coverage": {
      "splits": Json::object(splits),
      "budgetExhaustion": Json(budgets),
      "enumerationComplete": Json(
        !errors.any(e => {
          ["ENTRY_BUDGET", "IMAGE_BUDGET", "READ_ERROR", "PATH_DEPTH_BUDGET"].contains(
            text(field(e, "code")),
          )
        }),
      ),
      "rejectedOrErrorCount": Json(rejected_total),
      "ignoredFiles": Json(ignored_total),
      "unprocessedKnownFiles": Json(unprocessed_total),
      "summary": Json(summary.to_string()),
    },
  }
}

///|
#export_name("workflow_json")
pub fn workflow_json(source : String) -> String {
  if source.length() > 67108864 || !bounded_depth(source, 32) {
    return error_json(
      "WorkflowBudget", "Workflow input exceeds its bounded budget",
    ).stringify()
  }
  let request = @json.parse(source) catch {
    _ => return error_json("InvalidJson", "Invalid workflow JSON").stringify()
  }
  let report = field(request, "report")
  if workflow_rows(report, "images").length() > 10000 ||
    workflow_rows(report, "pairs").length() > 100000 ||
    workflow_rows(request, "rows").length() > 100000 ||
    workflow_rows(request, "ignored").length() > 100000 {
    return error_json(
      "WorkflowBudget", "Workflow collection exceeds its bounded budget",
    ).stringify()
  }
  let operation = text(field(request, "operation"))
  let result = match operation {
    "gate" => workflow_gate(report, text(field(request, "failOn")))
    "coverage" => workflow_coverage(request)
    "verify" => workflow_verify(report, workflow_rows(request, "observations"))
    "verificationInputs" => workflow_verification_inputs(report)
    "view" =>
      workflow_view(
        report,
        field(request, "includeLowContrast") == Json(true),
        text(field(request, "groupId")),
      )
    "groups" =>
      { "ok": true, "candidateGroups": Json(workflow_components(report, None)) }
    "fixes" => workflow_fixes(report, workflow_rows(request, "reviews"))
    "offline" => workflow_offline(request)
    "offlineMetadata" =>
      workflow_offline_metadata(report, integer(field(request, "maxBytes")))
    _ => error_json("ARGUMENT_ERROR", "Unknown workflow operation")
  }
  result.stringify()
}
