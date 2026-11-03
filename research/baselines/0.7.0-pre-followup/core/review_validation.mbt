///|
fn nonempty(value : Json) -> Bool {
  match value {
    String(s) => s.trim().length() > 0
    _ => false
  }
}

///|
fn null_default(value : Json, fallback : Json) -> Json {
  if value is Null {
    fallback
  } else {
    value
  }
}

///|
fn evidence_known(value : String) -> Bool {
  [
    "byte-identical", "pixel-identical", "perceptual-candidate", "local-candidate",
  ].contains(value)
}

///|
fn decision_known(value : String) -> Bool {
  ["confirmed", "rejected", "unsure"].contains(value)
}

///|
fn orientation_known(value : String, mirrors : Bool) -> Bool {
  let normal = ["original", "rotate90", "rotate180", "rotate270"]
  let reflected = [
    "mirror", "rotate90-mirror", "rotate180-mirror", "rotate270-mirror",
  ]
  normal.contains(value) || (mirrors && reflected.contains(value))
}

///|
fn review_pair_key(left : String, right : String) -> String {
  let keys = [left, right]
  keys.sort_by((a, b) => a.lexical_compare(b))
  Json(keys).stringify()
}

///|
fn validate_report_value(value : Json) -> Json {
  guard value is Object(_) else {
    return error_json("InvalidReport", "报告 必须是对象。")
  }
  if field(value, "schemaVersion") != Json("visionleak-report-v1") {
    return error_json(
      "InvalidReport", "不支持的报告格式，需要 visionleak-report-v1。",
    )
  }
  if !nonempty(field(value, "auditId")) {
    return error_json("InvalidReport", "auditId 必须是非空字符串。")
  }
  guard field(value, "images") is Array(raw_images) else {
    return error_json(
      "InvalidReport", "报告必须包含 images 和 pairs 数组。",
    )
  }
  guard field(value, "pairs") is Array(raw_pairs) else {
    return error_json(
      "InvalidReport", "报告必须包含 images 和 pairs 数组。",
    )
  }
  let images : Array[Json] = []
  let splits : Map[String, String] = Map([])
  for raw in raw_images {
    guard raw is Object(fields) else {
      return error_json("InvalidReport", "图像记录 必须是对象。")
    }
    let id = null_default(field(raw, "id"), field(raw, "path"))
    let path = null_default(field(raw, "path"), field(raw, "id"))
    let split = field(raw, "split")
    if !nonempty(id) || !nonempty(path) || !nonempty(split) {
      return error_json(
        "InvalidReport", "图像 id、路径、split 必须是非空字符串。",
      )
    }
    if splits.contains(text(id)) {
      return error_json("InvalidReport", "图像 id 重复：" + text(id))
    }
    splits[text(id)] = text(split)
    fields["id"] = id
    fields["path"] = path
    images.push(raw)
  }
  let pairs : Array[Json] = []
  let keys : Map[String, Bool] = Map([])
  let options = field(value, "options")
  let mirrors = field(options, "includeMirrors") == Json(true)
  let rotations = field(options, "includeRotations") == Json(true)
  for raw in raw_pairs {
    guard raw is Object(fields) else {
      return error_json("InvalidReport", "证据对 必须是对象。")
    }
    let left = field(raw, "left")
    let right = field(raw, "right")
    if !nonempty(left) || !nonempty(right) {
      return error_json(
        "InvalidReport", "left、right 必须是非空字符串。",
      )
    }
    let a = text(left)
    let b = text(right)
    if !splits.contains(a) || !splits.contains(b) {
      return error_json(
        "InvalidReport", "证据对引用了报告中不存在的图像。",
      )
    }
    if a == b || splits[a] == splits[b] {
      return error_json(
        "InvalidReport", "证据对必须是来自不同 split 的两张图像。",
      )
    }
    let evidence = text(field(raw, "evidence"))
    if !evidence_known(evidence) {
      return error_json("InvalidReport", "未知证据等级：" + evidence)
    }
    if evidence == "local-candidate" {
      let witness = field(raw, "matchLocal")
      let a = integer(field(witness, "leftWindow"))
      let b = integer(field(witness, "rightWindow"))
      if field(options, "includeCrops") != Json(true) ||
        field(witness, "profile") != Json("vl-local-dhash-v1") ||
        a < 0 ||
        a >= 20 ||
        b < 0 ||
        b >= 20 {
        return error_json(
          "InvalidReport", "局部候选必须记录有效的裁切窗口与审计配置。",
        )
      }
    }
    let transform = field(raw, "matchTransform")
    if !(transform is Null) {
      if !mirrors ||
        evidence != "perceptual-candidate" ||
        !["original", "mirror-left", "mirror-right", "mirror-both"].contains(
          text(transform),
        ) {
        return error_json(
          "InvalidReport", "镜像匹配依据与证据或审计配置不一致。",
        )
      }
    }
    let orientation = field(raw, "matchOrientation")
    if !(orientation is Null) {
      let views = text(orientation).split("/").map(v => v.to_owned()).collect()
      if !(transform is Null) ||
        evidence != "perceptual-candidate" ||
        !rotations ||
        views.length() != 2 ||
        !orientation_known(views[0], mirrors) ||
        !orientation_known(views[1], mirrors) {
        return error_json(
          "InvalidReport", "旋转匹配依据与证据或审计配置不一致。",
        )
      }
    }
    let distance = null_default(
      field(raw, "distance"),
      if candidate_evidence(evidence) {
        Json::null()
      } else {
        Json(0)
      },
    )
    if integer(distance) < 0 || integer(distance) > 64 {
      return error_json(
        "InvalidReport", "证据距离必须是 0 到 64 的非负整数。",
      )
    }
    let key = review_pair_key(a, b)
    if keys.contains(key) {
      return error_json("InvalidReport", "报告包含重复的证据对。")
    }
    keys[key] = true
    fields["key"] = Json(key)
    fields["distance"] = distance
    pairs.push(raw)
  }
  let errors = field(value, "errors")
  let mut has_errors = false
  match errors {
    Null => ()
    Array(values) => has_errors = values.length() > 0
    _ => return error_json("InvalidReport", "报告 errors 必须是数组。")
  }
  let complete = field(value, "complete") == Json(true) &&
    !["incomplete", "error", "failed"].contains(text(field(value, "status"))) &&
    !has_errors
  {
    "ok": true,
    "auditId": field(value, "auditId"),
    "images": Json(images),
    "pairs": Json(pairs),
    "complete": Json(complete),
  }
}

///|
fn validate_review_value(value : Json, report : Json, dates : Json) -> Json {
  guard value is Object(_) else {
    return error_json("InvalidReview", "复核记录 必须是对象。")
  }
  if field(value, "schemaVersion") != Json("visionleak-review-v1") {
    return error_json(
      "InvalidReview", "不支持的复核格式，需要 visionleak-review-v1。",
    )
  }
  if field(value, "auditId") != field(report, "auditId") {
    return error_json(
      "InvalidReview", "auditId 不匹配：复核记录属于另一份审计，未导入任何标记。",
    )
  }
  guard field(value, "reviews") is Array(raw_reviews) else {
    return error_json(
      "InvalidReview", "复核记录必须包含 reviews 数组。",
    )
  }
  guard dates is Array(timestamps) &&
    timestamps.length() == raw_reviews.length() else {
    return error_json(
      "InvalidReview", "人工标记的 updatedAt 时间格式无效。",
    )
  }
  let allowed : Map[String, Bool] = Map([])
  if field(report, "pairs") is Array(pairs) {
    for pair in pairs {
      allowed[text(field(pair, "key"))] = true
    }
  }
  let seen : Map[String, Bool] = Map([])
  let reviews : Array[Json] = []
  for i = 0; i < raw_reviews.length(); i = i + 1 {
    let raw = raw_reviews[i]
    guard raw is Object(_) else {
      return error_json("InvalidReview", "人工标记 必须是对象。")
    }
    let left = field(raw, "left")
    let right = field(raw, "right")
    if !nonempty(left) || !nonempty(right) {
      return error_json(
        "InvalidReview", "left、right 必须是非空字符串。",
      )
    }
    let key = review_pair_key(text(left), text(right))
    if field(raw, "pairKey") != Json(key) || !allowed.contains(key) {
      return error_json(
        "InvalidReview", "证据对不匹配：复核记录包含当前报告之外或被修改的 pair key，未导入任何标记。",
      )
    }
    if seen.contains(key) {
      return error_json(
        "InvalidReview", "复核记录包含重复的证据对，未导入任何标记。",
      )
    }
    if !decision_known(text(field(raw, "decision"))) {
      return error_json(
        "InvalidReview", "人工标记只能是 confirmed、rejected 或 unsure。",
      )
    }
    guard field(raw, "note") is String(note) && note.length() <= 20000 else {
      return error_json(
        "InvalidReview", "注释必须是 20,000 字符以内的文本。",
      )
    }
    if !(field(raw, "updatedAt") is String(_)) || !(timestamps[i] is Number(_)) {
      return error_json(
        "InvalidReview", "人工标记的 updatedAt 时间格式无效。",
      )
    }
    seen[key] = true
    reviews.push({
      "pairKey": Json(key),
      "left": left,
      "right": right,
      "decision": field(raw, "decision"),
      "note": Json(note),
      "updatedAt": field(raw, "updatedAt"),
    })
  }
  { "ok": true, "reviews": Json(reviews) }
}

///|
#export_name("review_validation_json")
pub fn review_validation_json(source : String) -> String {
  if source.length() > 67108864 || !bounded_depth(source, 128) {
    return error_json(
      "ReviewBudget", "报告或复核记录超出大小或结构深度上限。",
    ).stringify()
  }
  let request = @json.parse(source) catch {
    _ =>
      return error_json("InvalidJson", "无效的报告或复核 JSON。").stringify()
  }
  let operation = text(field(request, "operation"))
  if operation == "pairKey" {
    let left = field(request, "left")
    let right = field(request, "right")
    if !nonempty(left) || !nonempty(right) {
      return error_json(
        "InvalidPair", "left、right 必须是非空字符串。",
      ).stringify()
    }
    let result : Json = {
      "ok": true,
      "key": Json(review_pair_key(text(left), text(right))),
    }
    return result.stringify()
  }
  let report = validate_report_value(field(request, "report"))
  if field(report, "ok") != Json(true) || operation == "report" {
    return report.stringify()
  }
  if operation == "review" {
    return validate_review_value(
      field(request, "value"),
      report,
      field(request, "dates"),
    ).stringify()
  }
  error_json("InvalidOperation", "未知复核操作。").stringify()
}

///|
fn candidate_evidence(value : String) -> Bool {
  value == "perceptual-candidate" || value == "local-candidate"
}
