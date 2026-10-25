///|
fn identity_contract(source : String) -> Json {
  @json.parse(report_identity_json(source)) catch {
    _ => Json::null()
  }
}

///|
test "v2 identity canonicalizes UTF16 object keys at every level but preserves array order" {
  let source = "{\"identityVersion\":\"vl-report-sha256-v2\",\"z\":{\"long\":1,\"a\":2},\"aa\":[{\"z\":3,\"aa\":4},5]}"
  let expected = "{\"aa\":[{\"aa\":4,\"z\":3},5],\"identityVersion\":\"vl-report-sha256-v2\",\"z\":{\"a\":2,\"long\":1}}"
  let result = identity_contract(source)
  assert_eq(field(result, "ok"), Json(true))
  assert_eq(field(result, "payload"), Json(expected))
  assert_eq(field(result, "digest"), Json(sha256(@utf8.encode(expected))))
  let reversed = "{\"identityVersion\":\"vl-report-sha256-v2\",\"z\":{\"long\":1,\"a\":2},\"aa\":[5,{\"z\":3,\"aa\":4}]}"
  assert_false(
    field(identity_contract(reversed), "digest") == field(result, "digest"),
  )
}

///|
test "identity excludes transient top-level fields but binds nested names and extension fields" {
  let a = "{\"identityVersion\":\"vl-report-sha256-v2\",\"images\":[],\"auditId\":\"old\",\"createdAt\":\"yesterday\",\"timing\":{\"elapsedMs\":1},\"review\":{\"x\":1}}"
  let b = "{\"images\":[],\"identityVersion\":\"vl-report-sha256-v2\",\"auditId\":\"new\",\"createdAt\":\"today\",\"review\":{\"x\":2},\"timing\":{\"elapsedMs\":999}}"
  assert_eq(
    field(identity_contract(a), "digest"),
    field(identity_contract(b), "digest"),
  )
  let nested = "{\"images\":[{\"review\":\"nested evidence\"}],\"identityVersion\":\"vl-report-sha256-v2\"}"
  assert_false(
    field(identity_contract(a), "digest") ==
    field(identity_contract(nested), "digest"),
  )
  let extension = "{\"images\":[],\"identityVersion\":\"vl-report-sha256-v2\",\"extension\":true}"
  assert_false(
    field(identity_contract(a), "digest") ==
    field(identity_contract(extension), "digest"),
  )
}

///|
test "ECMAScript numeric property enumeration precedes lexically sorted string fields" {
  let input = "{\"identityVersion\":\"vl-report-sha256-v2\",\"10\":10,\"2\":2,\"01\":1,\"4294967295\":5,\"4294967294\":4,\"z\":0,\"aa\":1}"
  let expected = "{\"2\":2,\"10\":10,\"4294967294\":4,\"01\":1,\"4294967295\":5,\"aa\":1,\"identityVersion\":\"vl-report-sha256-v2\",\"z\":0}"
  assert_eq(field(identity_contract(input), "payload"), Json(expected))
  assert_eq(property_index("4294967294"), Some(4294967294UL))
  for key in ["4294967295", "-1", "01", "+1", "1e2", "", "99999999999", "图"] {
    assert_eq(property_index(key), None)
  }
}

///|
test "legacy identity retains original object insertion order including nested records" {
  let a = "{\"z\":1,\"aa\":{\"z\":2,\"aa\":3},\"createdAt\":\"ignored\",\"auditId\":\"ignored\"}"
  let expected = "{\"z\":1,\"aa\":{\"z\":2,\"aa\":3}}"
  assert_eq(field(identity_contract(a), "payload"), Json(expected))
  assert_false(
    field(identity_contract(a), "digest") ==
    field(identity_contract("{\"aa\":{\"z\":2,\"aa\":3},\"z\":1}"), "digest"),
  )
  assert_eq(
    field(identity_contract("{\"z\":1,\"identityVersion\":null}"), "payload"),
    Json("{\"z\":1,\"identityVersion\":null}"),
  )
}

///|
test "identity numeric spellings and JSON escapes survive the host serialization boundary" {
  // Hosts JSON.stringify before calling this ABI; no backend float formatter
  // is allowed to re-spell JSON numbers when canonicalizing the report.
  let source = "{\"identityVersion\":\"vl-report-sha256-v2\",\"values\":[0,1.5,1e-7,1e+21,9007199254740991],\"text\":\"图像\\n\\t\\\"\\\\\"}"
  let result = identity_contract(source)
  assert_eq(field(result, "ok"), Json(true))
  let expected = "{\"identityVersion\":\"vl-report-sha256-v2\",\"text\":\"图像\\n\\t\\\"\\\\\",\"values\":[0,1.5,1e-7,1e+21,9007199254740991]}"
  assert_eq(field(result, "payload"), Json(expected))
}

///|
test "identity rejects unsupported versions malformed nonobject and deep reports" {
  for
    source in [
      "{", "null", "[]", "1", "true", "{\"identityVersion\":\"unknown\"}", "{\"identityVersion\":1}",
    ] {
    assert_eq(field(identity_contract(source), "ok"), Json(false))
  }
  let nested = StringBuilder()
  for _ in 0..<129 {
    nested.write_string("[")
  }
  for _ in 0..<129 {
    nested.write_string("]")
  }
  assert_eq(field(identity_contract(nested.to_string()), "ok"), Json(false))
}
