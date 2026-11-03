///|
fn workflow_fixture() -> Json {
  let bytes = sha256(b"same bytes")
  let pixels = sha256(b"same pixels")
  let other = sha256(b"other")
  {
    "schemaVersion": "visionleak-report-v1",
    "auditId": "workflow-audit",
    "complete": true,
    "images": [
      {
        "id": "train/a",
        "path": "train/a",
        "split": "train",
        "byteDigest": Json(bytes),
        "pixelDigest": Json(pixels),
      },
      {
        "id": "validation/b",
        "path": "validation/b",
        "split": "validation",
        "byteDigest": Json(bytes),
        "pixelDigest": Json(pixels),
      },
      {
        "id": "test/c",
        "path": "test/c",
        "split": "test",
        "byteDigest": Json(other),
        "pixelDigest": Json(pixels),
      },
      {
        "id": "validation/d",
        "path": "validation/d",
        "split": "validation",
        "byteDigest": Json(other),
        "pixelDigest": Json(other),
      },
    ],
    "pairs": [
      {
        "left": "train/a",
        "right": "validation/b",
        "evidence": "byte-identical",
        "distance": 0,
      },
      {
        "left": "train/a",
        "right": "test/c",
        "evidence": "pixel-identical",
        "distance": 0,
      },
      {
        "left": "train/a",
        "right": "validation/d",
        "evidence": "perceptual-candidate",
        "distance": 2,
      },
      {
        "left": "test/c",
        "right": "validation/d",
        "evidence": "perceptual-candidate",
        "distance": 3,
        "lowContrast": true,
      },
    ],
    "groups": [
      {
        "members": ["train/a", "validation/b", "test/c"],
        "evidence": "exact-component",
      },
    ],
    "scope": {
      "splitDirectories": {
        "train": "train",
        "validation": "validation",
        "test": "test",
      },
    },
    "errors": [],
    "stats": { "reason": "" },
  }
}

///|
test "fail-on levels are cumulative and hits outrank incomplete reports" {
  let report = workflow_fixture()
  for (level, count) in [("exact", 1), ("pixel", 2), ("candidate", 4)] {
    let result = workflow_gate(report, level)
    assert_eq(field(result, "exitCode"), Json(3))
    assert_eq(field(result, "matched"), Json(count))
    assert_eq(
      field(
        workflow_gate(contract_set(report, "complete", Json(false)), level),
        "exitCode",
      ),
      Json(3),
    )
  }
  assert_eq(field(workflow_gate(report, ""), "exitCode"), Json(0))
  assert_eq(
    field(
      workflow_gate(contract_set(report, "complete", Json(false)), ""),
      "exitCode",
    ),
    Json(2),
  )
  let empty = contract_set(report, "pairs", Json::array([]))
  assert_eq(field(workflow_gate(empty, "candidate"), "exitCode"), Json(0))
  assert_eq(
    field(
      workflow_gate(contract_set(empty, "complete", Json(false)), "candidate"),
      "exitCode",
    ),
    Json(2),
  )
  assert_eq(field(workflow_gate(report, "typo"), "ok"), Json(false))
}

///|
fn workflow_observations() -> Array[Json] {
  workflow_rows(workflow_fixture(), "images").map(image => {
    "id": field(image, "id"),
    "status": "ok",
    "byteDigest": field(image, "byteDigest"),
    "pixelDigest": field(image, "pixelDigest"),
  })
}

///|
test "verification checks current digests against both recorded endpoints and evidence tier" {
  let report = workflow_fixture()
  assert_eq(
    field(workflow_verification_inputs(report), "ids"),
    Json(["train/a", "validation/b", "test/c"]),
  )
  let observations = workflow_observations()
  let valid = workflow_verify(report, observations)
  assert_eq(field(valid, "exitCode"), Json(0))
  assert_eq(field(field(valid, "counts"), "valid"), Json(2))
  assert_eq(field(field(valid, "counts"), "skippedCandidates"), Json(2))
  observations[2] = contract_set(
    observations[2],
    "pixelDigest",
    Json(sha256(b"tampered")),
  )
  let tampered = workflow_verify(report, observations)
  assert_eq(field(tampered, "exitCode"), Json(4))
  assert_eq(field(field(tampered, "counts"), "invalid"), Json(1))
  observations[1] = { "id": "validation/b", "status": "missing" }
  let missing = workflow_verify(report, observations)
  assert_eq(field(field(missing, "counts"), "missing"), Json(1))
  assert_eq(field(field(missing, "counts"), "invalid"), Json(1))
  assert_eq(field(workflow_verify(report, []), "exitCode"), Json(4))
}

///|
test "verification refuses a false original exact relation even when current files match their own records" {
  let report = workflow_fixture()
  let images = workflow_rows(report, "images")
  images[1] = contract_set(images[1], "byteDigest", Json(sha256(b"different")))
  let bad = contract_set(report, "images", Json(images))
  let observations = workflow_observations()
  observations[1] = contract_set(
    observations[1],
    "byteDigest",
    Json(sha256(b"different")),
  )
  assert_eq(
    field(field(workflow_verify(bad, observations), "counts"), "invalid"),
    Json(1),
  )
}

///|
test "candidate components contain only candidate edges and do not alter deterministic groups" {
  let report = workflow_fixture()
  let before = field(report, "groups").stringify()
  let groups = workflow_components(report, None)
  assert_eq(groups.length(), 1)
  assert_eq(
    field(groups[0], "members"),
    Json(["test/c", "train/a", "validation/d"]),
  )
  assert_eq(field(report, "groups").stringify(), before)
  let reversed = contract_set(
    report,
    "images",
    Json(workflow_rows(report, "images").rev()),
  )
  let reversed = contract_set(
    reversed,
    "pairs",
    Json(workflow_rows(report, "pairs").rev()),
  )
  assert_eq(Json(workflow_components(reversed, None)), Json(groups))
}

///|
test "low contrast is collapsed independently of grouping and can be expanded" {
  let report = workflow_fixture()
  let collapsed = workflow_view(report, false, "")
  assert_eq(workflow_rows(collapsed, "keys").length(), 3)
  assert_eq(field(collapsed, "lowContrastPairs"), Json(1))
  assert_eq(workflow_rows(workflow_view(report, true, ""), "keys").length(), 4)
  let group = text(field(workflow_components(report, None)[0], "id"))
  assert_eq(
    workflow_rows(workflow_view(report, false, group), "keys").length(),
    1,
  )
  assert_eq(
    workflow_rows(workflow_view(report, true, group), "keys").length(),
    2,
  )
  assert_eq(
    workflow_rows(workflow_view(report, true, "missing"), "keys").length(),
    0,
  )
}

///|
test "fixes retain train before validation before test and leave unconfirmed candidates without suggestions" {
  let report = workflow_fixture()
  let result = workflow_fixes(report, [])
  let rows = workflow_rows(result, "rows")
  assert_eq(rows.length(), 3)
  assert_eq(field(rows[0], "path"), Json("train/a"))
  assert_eq(field(rows[0], "suggestion"), Json("keep"))
  assert_eq(field(rows[1], "path"), Json("validation/b"))
  assert_eq(field(rows[1], "suggestion"), Json("remove-from-validation"))
  assert_eq(field(rows[2], "suggestion"), Json("remove-from-test"))
  assert_eq(field(rows[0], "group_id"), field(rows[2], "group_id"))
  for decision in ["unsure", "rejected"] {
    let review : Json = {
      "pairKey": Json(review_pair_key("train/a", "validation/d")),
      "decision": Json(decision),
    }
    assert_eq(
      workflow_rows(workflow_fixes(report, [review]), "rows").length(),
      3,
    )
  }
  let review : Json = {
    "pairKey": Json(review_pair_key("train/a", "validation/d")),
    "decision": "confirmed",
  }
  let confirmed = workflow_rows(workflow_fixes(report, [review]), "rows")
  assert_eq(confirmed.length(), 5)
  assert_eq(field(confirmed[4], "path"), Json("validation/d"))
  assert_eq(field(confirmed[4], "review_status"), Json("confirmed"))
  assert_eq(field(confirmed[4], "suggestion"), Json("remove-from-validation"))
}

///|
test "CSV preserves quoted paths commas newlines and complete stable group identifiers" {
  assert_eq(
    workflow_csv_cell("train/a,\"b\"\n.png"),
    "\"train/a,\"\"b\"\"\n.png\"",
  )
  let report = workflow_fixture()
  let first = field(workflow_fixes(report, []), "csv")
  let reordered = contract_set(
    report,
    "images",
    Json(workflow_rows(report, "images").rev()),
  )
  assert_eq(field(workflow_fixes(reordered, []), "csv"), first)
}

///|
test "coverage partitions accepted rejected ignored unprocessed and records exhaustion points" {
  let report = workflow_fixture()
  let errors : Array[Json] = [
    { "code": "DECODE_ERROR", "path": "test/bad" },
    { "code": "IMAGE_BUDGET", "path": "validation/next", "limit": 4 },
  ]
  let report = contract_set(report, "errors", Json(errors))
  let report = contract_set(report, "stats", {
    "reason": "ComparisonBudget",
    "processedImages": 2,
    "emittedPairs": 1,
  })
  let request : Json = {
    "report": report,
    "ignored": [{ "path": "train/notes.txt", "split": "train" }],
    "discovered": [
      { "path": "test/bad", "split": "test" },
      { "path": "train/a", "split": "train" },
      { "path": "test/unprocessed", "split": "test" },
    ],
  }
  let coverage = field(workflow_coverage(request), "coverage")
  let splits = field(coverage, "splits")
  assert_eq(field(field(splits, "train"), "audited"), Json(1))
  assert_eq(field(field(splits, "train"), "ignored"), Json(1))
  assert_eq(
    field(field(field(splits, "test"), "rejectedByCode"), "DECODE_ERROR"),
    Json(1),
  )
  assert_eq(field(field(splits, "test"), "unprocessed"), Json(2))
  assert_eq(field(field(splits, "test"), "audited"), Json(0))
  assert_eq(field(field(splits, "test"), "fingerprinted"), Json(1))
  assert_eq(field(coverage, "enumerationComplete"), Json(false))
  assert_eq(workflow_rows(coverage, "budgetExhaustion").length(), 2)
}

///|
test "offline budget includes shell bytes permits exact boundaries and marks omitted rows" {
  let request : Json = {
    "maxBytes": 4096,
    "headerBytes": 3000,
    "rows": [{ "bytes": 1000 }, { "bytes": 100 }, { "bytes": 96 }],
  }
  let result = workflow_offline(request)
  assert_eq(field(result, "selected"), Json([0, 2]))
  assert_eq(field(result, "estimatedBytes"), Json(4096))
  assert_eq(field(result, "truncated"), Json(true))
  assert_eq(field(result, "omittedPairs"), Json(1))
  assert_eq(
    field(
      workflow_offline(contract_set(request, "headerBytes", Json(5000))),
      "ok",
    ),
    Json(false),
  )
  assert_eq(
    field(
      workflow_offline(contract_set(request, "rows", Json::array([]))),
      "truncated",
    ),
    Json(false),
  )
}

///|
test "report commands reject missing duplicate unknown flags and invalid export limits" {
  for command in ["verify", "export-html", "export-fixes"] {
    let flag = if command == "verify" { "--root" } else { "--out" }
    let result = cli_test_parse([
      command, "--report", "report.json", flag, "target",
    ])
    assert_eq(field(result, "ok"), Json(true))
    assert_eq(field(field(result, "args"), "command"), Json(command))
    assert_eq(
      field(
        cli_test_parse([
          command, "--report", "a", flag, "target", "--report", "b",
        ]),
        "ok",
      ),
      Json(false),
    )
    assert_eq(
      field(cli_test_parse([command, "--report", "a"]), "ok"),
      Json(false),
    )
    assert_eq(
      field(cli_test_parse([command, "--unknown", "x"]), "ok"),
      Json(false),
    )
  }
  for value in ["0", "4095", "67108865", "1e4", "-1"] {
    assert_eq(
      field(
        cli_test_parse([
          "export-html", "--report", "a", "--out", "b", "--max-bytes", value,
        ]),
        "ok",
      ),
      Json(false),
    )
  }
  for value in ["exact", "pixel", "candidate"] {
    let result = cli_test_parse([
      "audit", "--root", "a", "--out", "b", "--fail-on", value,
    ])
    assert_eq(field(field(result, "args"), "failOn"), Json(value))
  }
  assert_eq(
    field(
      cli_test_parse([
        "audit", "--root", "a", "--out", "b", "--fail-on", "unknown",
      ]),
      "ok",
    ),
    Json(false),
  )
}

///|
test "offline report metadata embeds the intact report when affordable and labels a partial snapshot otherwise" {
  let report = workflow_fixture()
  let full = field(workflow_offline_metadata(report, 20971520), "metadata")
  assert_eq(field(full, "reportTruncated"), Json(false))
  assert_eq(field(full, "report"), report)
  let large = contract_set(
    report,
    "extra",
    Json(Array::make(6000, "x").join("")),
  )
  let compact = field(workflow_offline_metadata(large, 4096), "metadata")
  assert_eq(field(compact, "reportTruncated"), Json(true))
  assert_eq(
    field(field(compact, "report"), "schemaVersion"),
    Json("visionleak-report-snapshot-v1"),
  )
  assert_eq(field(field(compact, "report"), "auditId"), Json::null())
  assert_eq(
    field(field(compact, "report"), "sourceAuditId"),
    field(report, "auditId"),
  )
  assert_eq(field(field(compact, "report"), "complete"), Json(false))
}

///|
test "workflow dispatcher rejects malformed JSON unknown operations and excessive nesting" {
  for source in ["{", "[]", "null", "{\"operation\":\"unknown\"}"] {
    let value = @json.parse(workflow_json(source)) catch { _ => Json::null() }
    assert_eq(field(value, "ok"), Json(false))
  }
  let source = Array::make(33, "[").join("") +
    "0" +
    Array::make(33, "]").join("")
  let value = @json.parse(workflow_json(source)) catch { _ => Json::null() }
  assert_eq(field(field(value, "error"), "code"), Json("WorkflowBudget"))
}
