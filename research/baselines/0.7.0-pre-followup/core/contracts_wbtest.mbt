///|
fn contract_report() -> Json {
  {
    "schemaVersion": "visionleak-report-v1",
    "auditId": "test-audit",
    "complete": true,
    "status": "complete",
    "images": [
      { "id": "train/a.jpg", "path": "train/a.jpg", "split": "train" },
      { "id": "test/b.jpg", "path": "test/b.jpg", "split": "test" },
      {
        "id": "validation/c.jpg",
        "path": "validation/c.jpg",
        "split": "validation",
      },
    ],
    "pairs": [
      {
        "left": "train/a.jpg",
        "right": "test/b.jpg",
        "evidence": "byte-identical",
        "distance": 0,
      },
      {
        "left": "train/a.jpg",
        "right": "validation/c.jpg",
        "evidence": "perceptual-candidate",
        "distance": 3,
      },
    ],
  }
}

///|
fn contract_review() -> Json {
  {
    "schemaVersion": "visionleak-review-v1",
    "auditId": "test-audit",
    "reviews": [
      {
        "pairKey": Json(review_pair_key("train/a.jpg", "test/b.jpg")),
        "left": "train/a.jpg",
        "right": "test/b.jpg",
        "decision": "unsure",
        "note": "需要查证来源",
        "updatedAt": "2026-10-22T12:00:00.000Z",
      },
    ],
  }
}

///|
fn contract_set(value : Json, key : String, replacement : Json) -> Json {
  let copied = @json.parse(value.stringify()) catch { _ => Json::null() }
  if copied is Object(fields) {
    fields[key] = replacement
  }
  copied
}

///|
fn contract_first(value : Json, key : String) -> Json {
  match field(value, key) {
    Array(values) => values[0]
    _ => Json::null()
  }
}

///|
test "pair keys use UTF16 lexical order rather than MoonBit length ordering" {
  assert_eq(review_pair_key("z", "aa"), "[\"aa\",\"z\"]")
  assert_eq(review_pair_key("aa", "z"), review_pair_key("z", "aa"))
  assert_eq(
    review_pair_key("validation/c.jpg", "train/a.jpg"),
    "[\"train/a.jpg\",\"validation/c.jpg\"]",
  )
  assert_false(review_pair_key("a|b", "c") == review_pair_key("a", "b|c"))
  assert_false(review_pair_key("a\nb", "c") == review_pair_key("a", "b\nc"))
  assert_eq(
    review_pair_key("图像 A", "图像 B"),
    "[\"图像 A\",\"图像 B\"]",
  )
}

///|
test "report validation normalizes image aliases pair keys and exact distance defaults" {
  let source : Json = {
    "schemaVersion": "visionleak-report-v1",
    "auditId": "a",
    "complete": true,
    "images": [
      { "path": "z", "split": "train" },
      { "id": "aa", "split": "test" },
    ],
    "pairs": [{ "left": "z", "right": "aa", "evidence": "pixel-identical" }],
  }
  let parsed = validate_report_value(source)
  assert_eq(field(parsed, "ok"), Json(true))
  assert_eq(field(contract_first(parsed, "images"), "id"), Json("z"))
  assert_eq(
    field(contract_first(parsed, "pairs"), "key"),
    Json("[\"aa\",\"z\"]"),
  )
  assert_eq(field(contract_first(parsed, "pairs"), "distance"), Json(0))
}

///|
test "report trust boundary rejects nonobjects schema omissions and invalid arrays" {
  for
    value in [
      Json::null(),
      Json(1),
      Json(true),
      Json::array([]),
      Json("report"),
    ] {
    assert_eq(field(validate_report_value(value), "ok"), Json(false))
  }
  let report = contract_report()
  for
    (key, value) in [
      ("schemaVersion", Json("old")),
      ("auditId", Json("")),
      ("auditId", Json(" \n\t")),
      ("auditId", Json(1)),
      ("images", Json::null()),
      ("pairs", Json::null()),
      ("errors", Json(true)),
    ] {
    assert_eq(
      field(validate_report_value(contract_set(report, key, value)), "ok"),
      Json(false),
    )
  }
}

///|
test "report trust boundary rejects missing image identifiers and duplicate aliases" {
  let report = contract_report()
  let image = contract_first(report, "images")
  for
    (key, value) in [
      ("id", Json("")),
      ("path", Json("")),
      ("split", Json("")),
      ("id", Json(false)),
      ("path", Json::array([])),
      ("split", Json(4)),
    ] {
    let invalid = contract_set(
      report,
      "images",
      Json([contract_set(image, key, value)]),
    )
    assert_eq(field(validate_report_value(invalid), "ok"), Json(false))
  }
  assert_eq(
    field(
      validate_report_value(
        contract_set(report, "images", Json([image, image])),
      ),
      "ok",
    ),
    Json(false),
  )
  assert_eq(
    field(
      validate_report_value(
        contract_set(report, "images", Json([Json("image")])),
      ),
      "ok",
    ),
    Json(false),
  )
}

///|
test "report trust boundary rejects foreign self same-split duplicate and unknown evidence pairs" {
  let report = contract_report()
  let pair = contract_first(report, "pairs")
  for
    (key, value) in [
      ("left", Json("missing")),
      ("right", Json("train/a.jpg")),
      ("left", Json("")),
      ("right", Json(1)),
      ("evidence", Json("__proto__")),
      ("evidence", Json("local-candidate")),
    ] {
    let invalid = contract_set(
      report,
      "pairs",
      Json([contract_set(pair, key, value)]),
    )
    assert_eq(field(validate_report_value(invalid), "ok"), Json(false))
  }
  let duplicate = contract_set(
    report,
    "pairs",
    Json([
      pair,
      contract_set(
        contract_set(pair, "left", field(pair, "right")),
        "right",
        field(pair, "left"),
      ),
    ]),
  )
  assert_eq(field(validate_report_value(duplicate), "ok"), Json(false))
  let same_split = contract_set(
    report,
    "images",
    Json([
      { "id": "train/a.jpg", "split": "train" },
      { "id": "test/b.jpg", "split": "train" },
      { "id": "validation/c.jpg", "split": "validation" },
    ]),
  )
  assert_eq(field(validate_report_value(same_split), "ok"), Json(false))
}

///|
test "report completeness is conservative across flags failure status and input errors" {
  let report = contract_report()
  assert_eq(field(validate_report_value(report), "complete"), Json(true))
  for value in [Json(false), Json::null(), Json("true"), Json(1)] {
    assert_eq(
      field(
        validate_report_value(contract_set(report, "complete", value)),
        "complete",
      ),
      Json(false),
    )
  }
  for status in ["incomplete", "error", "failed"] {
    assert_eq(
      field(
        validate_report_value(contract_set(report, "status", Json(status))),
        "complete",
      ),
      Json(false),
    )
  }
  let with_errors = contract_set(
    report,
    "errors",
    Json([{ "code": "DECODE_ERROR" }]),
  )
  assert_eq(field(validate_report_value(with_errors), "complete"), Json(false))
  assert_eq(
    field(
      validate_report_value(contract_set(report, "errors", Json::array([]))),
      "complete",
    ),
    Json(true),
  )
}

///|
test "report distances cover exact fallback and full sixty-four bit candidate range" {
  let report = contract_report()
  let candidate : Json = {
    "left": "train/a.jpg",
    "right": "test/b.jpg",
    "evidence": "perceptual-candidate",
    "distance": 0,
  }
  for distance in [0, 1, 6, 63, 64] {
    let value = contract_set(
      report,
      "pairs",
      Json([contract_set(candidate, "distance", Json(distance))]),
    )
    assert_eq(field(validate_report_value(value), "ok"), Json(true))
  }
  for
    distance in [
      Json(-1),
      Json(65),
      Json(0.5),
      Json("3"),
      Json(true),
      Json::null(),
    ] {
    let value = contract_set(
      report,
      "pairs",
      Json([contract_set(candidate, "distance", distance)]),
    )
    assert_eq(field(validate_report_value(value), "ok"), Json(false))
  }
}

///|
test "mirror explanation requires known transform candidate evidence and enabled mode" {
  let report = contract_set(contract_report(), "options", {
    "includeMirrors": true,
  })
  let candidate : Json = {
    "left": "train/a.jpg",
    "right": "test/b.jpg",
    "evidence": "perceptual-candidate",
    "distance": 0,
  }
  for transform in ["original", "mirror-left", "mirror-right", "mirror-both"] {
    let value = contract_set(
      report,
      "pairs",
      Json([contract_set(candidate, "matchTransform", Json(transform))]),
    )
    assert_eq(field(validate_report_value(value), "ok"), Json(true))
    assert_eq(
      field(
        validate_report_value(
          contract_set(value, "options", { "includeMirrors": false }),
        ),
        "ok",
      ),
      Json(false),
    )
    let wrong_tier = contract_set(
      contract_set(candidate, "matchTransform", Json(transform)),
      "evidence",
      Json("pixel-identical"),
    )
    assert_eq(
      field(
        validate_report_value(contract_set(report, "pairs", Json([wrong_tier]))),
        "ok",
      ),
      Json(false),
    )
  }
  for transform in [Json("rotation"), Json(1), Json::array([])] {
    assert_eq(
      field(
        validate_report_value(
          contract_set(
            report,
            "pairs",
            Json([contract_set(candidate, "matchTransform", transform)]),
          ),
        ),
        "ok",
      ),
      Json(false),
    )
  }
}

///|
test "orientation explanation rejects mixed formats disabled mirrors and unknown views" {
  let report = contract_set(contract_report(), "options", {
    "includeRotations": true,
    "includeMirrors": true,
  })
  let candidate : Json = {
    "left": "train/a.jpg",
    "right": "test/b.jpg",
    "evidence": "perceptual-candidate",
    "distance": 0,
  }
  let names = [
    "original", "mirror", "rotate90", "rotate180", "rotate270", "rotate90-mirror",
    "rotate180-mirror", "rotate270-mirror",
  ]
  for left in names {
    for right in names {
      let pair = contract_set(
        candidate,
        "matchOrientation",
        Json(left + "/" + right),
      )
      let value = contract_set(report, "pairs", Json([pair]))
      assert_eq(field(validate_report_value(value), "ok"), Json(true))
      assert_eq(
        field(
          validate_report_value(
            contract_set(value, "options", {
              "includeRotations": false,
              "includeMirrors": true,
            }),
          ),
          "ok",
        ),
        Json(false),
      )
      if left.has_suffix("mirror") || right.has_suffix("mirror") {
        assert_eq(
          field(
            validate_report_value(
              contract_set(value, "options", {
                "includeRotations": true,
                "includeMirrors": false,
              }),
            ),
            "ok",
          ),
          Json(false),
        )
      }
      let mixed = contract_set(pair, "matchTransform", Json("mirror-left"))
      assert_eq(
        field(
          validate_report_value(contract_set(report, "pairs", Json([mixed]))),
          "ok",
        ),
        Json(false),
      )
    }
  }
  for
    orientation in [
      Json("rotate45/original"),
      Json("rotate90"),
      Json("original/original/extra"),
      Json("__proto__/original"),
      Json(1),
    ] {
    let value = contract_set(
      report,
      "pairs",
      Json([contract_set(candidate, "matchOrientation", orientation)]),
    )
    assert_eq(field(validate_report_value(value), "ok"), Json(false))
  }
}

///|
test "review import preserves identity note and timestamp while rejecting foreign audit" {
  let report = validate_report_value(contract_report())
  let value = contract_review()
  let dates : Json = [1792670400000.0]
  let valid = validate_review_value(value, report, dates)
  assert_eq(field(valid, "ok"), Json(true))
  assert_eq(
    field(contract_first(valid, "reviews"), "note"),
    Json("需要查证来源"),
  )
  assert_eq(
    field(contract_first(valid, "reviews"), "updatedAt"),
    Json("2026-10-22T12:00:00.000Z"),
  )
  assert_eq(
    field(
      validate_review_value(
        contract_set(value, "auditId", Json("other")),
        report,
        dates,
      ),
      "ok",
    ),
    Json(false),
  )
  assert_eq(
    field(
      validate_review_value(
        contract_set(value, "schemaVersion", Json("old")),
        report,
        dates,
      ),
      "ok",
    ),
    Json(false),
  )
  assert_eq(
    field(
      validate_review_value(
        contract_set(value, "reviews", Json(true)),
        report,
        dates,
      ),
      "ok",
    ),
    Json(false),
  )
  assert_eq(
    field(validate_review_value(Json::null(), report, dates), "ok"),
    Json(false),
  )
}

///|
test "review import rejects changed pair keys reversed duplicates and out-of-audit pairs atomically" {
  let report = validate_report_value(contract_report())
  let value = contract_review()
  let review = contract_first(value, "reviews")
  for
    invalid in [
      contract_set(review, "pairKey", Json("modified")),
      contract_set(
        contract_set(review, "left", Json("foreign")),
        "pairKey",
        Json(review_pair_key("foreign", "test/b.jpg")),
      ),
      contract_set(review, "left", Json("")),
    ] {
    let with_invalid = contract_set(value, "reviews", Json([review, invalid]))
    assert_eq(
      field(validate_review_value(with_invalid, report, [1, 1]), "ok"),
      Json(false),
    )
  }
  let reversed = contract_set(
    contract_set(review, "left", field(review, "right")),
    "right",
    field(review, "left"),
  )
  assert_eq(
    field(
      validate_review_value(
        contract_set(value, "reviews", Json([review, reversed])),
        report,
        [1, 1],
      ),
      "ok",
    ),
    Json(false),
  )
  // All-or-nothing validation: no partially accepted reviews are returned.
  assert_eq(
    field(
      validate_review_value(
        contract_set(value, "reviews", Json([review, review])),
        report,
        [1, 1],
      ),
      "reviews",
    ),
    Json::null(),
  )
}

///|
test "review decision note and timestamp boundaries are enforced in the core" {
  let report = validate_report_value(contract_report())
  let value = contract_review()
  let review = contract_first(value, "reviews")
  for decision in ["confirmed", "rejected", "unsure"] {
    let changed = contract_set(
      value,
      "reviews",
      Json([contract_set(review, "decision", Json(decision))]),
    )
    assert_eq(
      field(validate_review_value(changed, report, [1]), "ok"),
      Json(true),
    )
  }
  for
    (key, replacement) in [
      ("decision", Json("deleted")),
      ("decision", Json("__proto__")),
      ("note", Json(4)),
      ("note", Json(String::make(20001, 'x'))),
      ("updatedAt", Json(1)),
    ] {
    let changed = contract_set(
      value,
      "reviews",
      Json([contract_set(review, key, replacement)]),
    )
    assert_eq(
      field(validate_review_value(changed, report, [1]), "ok"),
      Json(false),
    )
  }
  let maximum_note = contract_set(
    value,
    "reviews",
    Json([contract_set(review, "note", Json(String::make(20000, 'x')))]),
  )
  assert_eq(
    field(validate_review_value(maximum_note, report, [1]), "ok"),
    Json(true),
  )
  for
    dates in [
      Json::null(),
      Json::array([]),
      Json([Json::null()]),
      Json(["yesterday"]),
    ] {
    assert_eq(
      field(validate_review_value(value, report, dates), "ok"),
      Json(false),
    )
  }
}

///|
test "bounded public review JSON adapter routes operations and rejects oversized structure" {
  for source in ["{", "null", "[]", "{\"operation\":\"unknown\"}"] {
    assert_eq(
      field(@json.parse(review_validation_json(source)), "ok"),
      Json(false),
    )
  }
  let request : Json = { "operation": "pairKey", "left": "z", "right": "aa" }
  assert_eq(
    field(@json.parse(review_validation_json(request.stringify())), "key"),
    Json("[\"aa\",\"z\"]"),
  )
  let report_request : Json = {
    "operation": "report",
    "report": contract_report(),
  }
  assert_eq(
    field(@json.parse(review_validation_json(report_request.stringify())), "ok"),
    Json(true),
  )
  let review_request : Json = {
    "operation": "review",
    "report": contract_report(),
    "value": contract_review(),
    "dates": [1],
  }
  assert_eq(
    field(@json.parse(review_validation_json(review_request.stringify())), "ok"),
    Json(true),
  )
}
