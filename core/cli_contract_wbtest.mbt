///|
fn cli_test_parse(args : Array[String]) -> Json {
  let request : Json = { "operation": "parse", "argv": Json(args) }
  @json.parse(cli_options_json(request.stringify())) catch {
    _ => Json::null()
  }
}

///|
test "CLI defaults and partial API supplieds have one core-owned budget contract" {
  let defaults = cli_defaults()
  assert_eq(field(defaults, "threshold"), Json(6))
  assert_eq(field(defaults, "maxImages"), Json(1000))
  assert_eq(field(defaults, "maxPixels"), Json(4194304))
  assert_eq(field(defaults, "maxTotalPixels"), Json(100000000))
  assert_eq(field(defaults, "maxFileBytes"), Json(33554432))
  assert_eq(field(defaults, "maxComparisons"), Json(1000000))
  assert_eq(field(defaults, "maxPairs"), Json(10000))
  assert_eq(field(defaults, "includeMirrors"), Json(false))
  assert_eq(field(defaults, "includeRotations"), Json(false))
  let merged = cli_validate_options({ "threshold": 0 })
  assert_eq(field(merged, "ok"), Json(true))
  assert_eq(field(field(merged, "options"), "threshold"), Json(0))
  assert_eq(field(field(merged, "options"), "maxImages"), Json(1000))
}

///|
test "CLI every numeric budget accepts both inclusive boundaries and rejects adjacent values" {
  for row in cli_limits() {
    for limit in [row.2, row.3] {
      let parsed = cli_test_parse([
        "audit",
        "--root",
        "dataset",
        "--out",
        "output",
        row.0,
        limit.to_string(),
      ])
      assert_eq(field(parsed, "ok"), Json(true))
      assert_eq(
        field(field(field(parsed, "args"), "options"), row.1),
        Json(limit),
      )
      let supplied : Json = Json::object(Map([(row.1, Json(limit))]))
      assert_eq(field(cli_validate_options(supplied), "ok"), Json(true))
    }
    for invalid in [row.2 - 1, row.3 + 1] {
      let parsed = cli_test_parse([
        "audit",
        "--root",
        "dataset",
        "--out",
        "output",
        row.0,
        invalid.to_string(),
      ])
      assert_eq(field(parsed, "ok"), Json(false))
      let supplied : Json = Json::object(Map([(row.1, Json(invalid))]))
      assert_eq(field(cli_validate_options(supplied), "ok"), Json(false))
    }
  }
}

///|
test "CLI rejects coercion fractional exponential signed empty and overflow numeric strings" {
  for row in cli_limits() {
    for
      invalid in [
        "", "NaN", "Infinity", "1.5", "+1", "-0", "1e2", "0x10", " 1", "1 ", "１２",
        "١", "9999999999999999999999999999999999",
      ] {
      let parsed = cli_test_parse([
        "audit",
        "--root",
        "dataset",
        "--out",
        "output",
        row.0,
        invalid,
      ])
      assert_eq(field(parsed, "ok"), Json(false))
    }
    for
      invalid in [
        Json::null(),
        Json(true),
        Json("1"),
        Json(0.5),
        Json::array([]),
        Json::empty_object(),
      ] {
      let supplied : Json = Json::object(Map([(row.1, invalid)]))
      assert_eq(field(cli_validate_options(supplied), "ok"), Json(false))
    }
  }
}

///|
test "CLI parse handles optional flags and both supported help entry points" {
  for
    args in [[], ["help"], ["--help"], ["audit", "--help"], ["other", "--help"]] {
    assert_eq(field(field(cli_test_parse(args), "args"), "help"), Json(true))
  }
  let value = cli_test_parse([
    "audit", "--root", "图像 数据", "--out", "复核 输出", "--force", "--include-mirrors",
    "--include-rotations",
  ])
  assert_eq(field(value, "ok"), Json(true))
  let parsed = field(value, "args")
  assert_eq(field(parsed, "root"), Json("图像 数据"))
  assert_eq(field(parsed, "out"), Json("复核 输出"))
  assert_eq(field(parsed, "force"), Json(true))
  assert_eq(field(field(parsed, "options"), "includeMirrors"), Json(true))
  assert_eq(field(field(parsed, "options"), "includeRotations"), Json(true))
}

///|
test "CLI rejects missing root output option values duplicate flags and unknown commands" {
  for
    args in [
      ["other"],
      ["audit"],
      ["audit", "--root", "dataset"],
      ["audit", "--out", "output"],
      ["audit", "--root"],
      ["audit", "--out"],
      ["audit", "--root", "--out", "output"],
      ["audit", "--root", "dataset", "--out", "output", "--unknown"],
      ["audit", "--root", "dataset", "--root", "other", "--out", "output"],
      ["audit", "--root", "dataset", "--out", "output", "--force", "--force"],
      [
        "audit", "--root", "dataset", "--out", "output", "--include-mirrors", "--include-mirrors",
      ],
      ["audit", "--root", "dataset", "--out", "output", "--threshold"],
    ] {
    let result = cli_test_parse(args)
    assert_eq(field(result, "ok"), Json(false))
    assert_eq(field(field(result, "error"), "code"), Json("ARGUMENT_ERROR"))
  }
}

///|
test "CLI API rejects unknown and incorrectly typed options without host coercion" {
  for
    input in [
      Json::null(),
      Json(true),
      Json::array([]),
      Json("options"),
      { "unknown": 1 },
      { "includeMirrors": "yes" },
      { "includeRotations": 1 },
      { "includeMirrors": Json::null() },
      { "includeRotations": Json::empty_object() },
    ] {
    assert_eq(field(cli_validate_options(input), "ok"), Json(false))
  }
  assert_eq(
    field(
      cli_validate_options({ "includeMirrors": true, "includeRotations": true }),
      "ok",
    ),
    Json(true),
  )
}

///|
test "CLI decimal parsing cannot overflow even at the file-byte hard limit" {
  for
    (raw, maximum, expected) in [
      ("1073741824", 1073741824, 1073741824),
      ("1073741825", 1073741824, -1),
      ("2147483648", 1073741824, -1),
      ("000000000000000000000000000006", 64, 6),
      ("0", 0, 0),
      ("1", 0, -1),
      ("64", 64, 64),
      ("65", 64, -1),
    ] {
    assert_eq(cli_unsigned(raw, maximum), expected)
  }
}

///|
test "all split aliases normalize to canonical scope and preserve physical directory names" {
  for train in ["train", "training"] {
    for validation in ["validation", "val", "valid", "dev"] {
      for test_name in ["test", "testing"] {
        let result = resolve_split_scope([
          Json(train),
          Json(validation),
          Json(test_name),
        ])
        assert_eq(field(result, "ok"), Json(true))
        assert_eq(field(field(result, "mapping"), train), Json("train"))
        assert_eq(
          field(field(result, "mapping"), validation),
          Json("validation"),
        )
        assert_eq(field(field(result, "mapping"), test_name), Json("test"))
        assert_eq(field(result, "missingSplits"), Json::array([]))
        guard field(result, "directories") is Array(directories) else {
          fail("missing directories")
        }
        assert_eq(directories.length(), 3)
        assert_eq(field(directories[0], "directory"), Json(train))
        assert_eq(field(directories[1], "directory"), Json(validation))
        assert_eq(field(directories[2], "directory"), Json(test_name))
      }
    }
  }
}

///|
test "each simultaneous alias pair is a conflict and never a silently merged split" {
  for (split, aliases) in split_alias_groups() {
    for i = 0; i < aliases.length(); i = i + 1 {
      for j = i + 1; j < aliases.length(); j = j + 1 {
        let result = resolve_split_scope([Json(aliases[i]), Json(aliases[j])])
        assert_eq(field(result, "ok"), Json(false))
        assert_eq(
          field(field(result, "error"), "code"),
          Json("SPLIT_ALIAS_CONFLICT"),
        )
        assert_eq(field(field(result, "error"), "split"), Json(split))
        assert_eq(
          field(field(result, "error"), "directories"),
          Json([aliases[i], aliases[j]]),
        )
      }
    }
  }
}

///|
test "missing split reporting ignores unrelated root directories and is deterministic" {
  let empty = resolve_split_scope([])
  assert_eq(
    field(empty, "missingSplits"),
    Json(["train", "validation", "test"]),
  )
  assert_eq(field(empty, "directories"), Json::array([]))
  let partial = resolve_split_scope([Json("dev"), Json("other"), Json("TRAIN")])
  assert_eq(field(partial, "ok"), Json(true))
  assert_eq(field(partial, "missingSplits"), Json(["train", "test"]))
  assert_eq(field(partial, "mapping"), { "dev": "validation" })
  // The same directory name observed twice is still one physical alias.
  assert_eq(
    field(resolve_split_scope([Json("train"), Json("train")]), "ok"),
    Json(true),
  )
  assert_eq(field(resolve_split_scope([Json(1)]), "ok"), Json(false))
}
