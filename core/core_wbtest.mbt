///|
test "SHA256 published known-answer vectors and padding boundary" {
  assert_eq(
    sha256(b""),
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  )
  assert_eq(
    sha256(b"abc"),
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  )
  assert_eq(
    sha256(b"abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"),
    "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
  )
}

///|
test "canonical pixels include dimensions and composite transparent colors" {
  let a = fingerprint(1, 1, b"\x00\x00\x00\x00")
  let b = fingerprint(1, 1, b"\xff\x80\x00\x00")
  let c = fingerprint(1, 1, b"\xff\xff\xff\xff")
  assert_eq(field(a, "pixelDigest"), field(b, "pixelDigest"))
  assert_eq(field(a, "pixelDigest"), field(c, "pixelDigest"))
  let p = b"\xff\x00\x00\xff\xff\x00\x00\xff"
  assert_true(
    field(fingerprint(1, 2, p), "pixelDigest") !=
    field(fingerprint(2, 1, p), "pixelDigest"),
  )
}

///|
test "fingerprint rejects dimensions lengths and invalid JSON bytes" {
  assert_eq(field(fingerprint(0, 1, b""), "ok"), Json(false))
  assert_eq(field(fingerprint(65535, 65535, b""), "ok"), Json(false))
  assert_eq(field(fingerprint(1, 1, b"abc"), "ok"), Json(false))
  let j = @json.parse(
    fingerprint_json("{\"width\":1,\"height\":1,\"rgba\":[0,0,0,256]}"),
  )
  assert_eq(field(j, "ok"), Json(false))
}

///|
test "hamming validates length and binary alphabet" {
  let zeros = String::make(64, '0')
  assert_eq(hamming(zeros, zeros), 0)
  assert_eq(hamming(zeros, String::make(64, '1')), 64)
  assert_eq(hamming("0", "1"), -1)
  assert_eq(hamming(zeros, String::make(64, 'x')), -1)
}

///|
fn fixture_item(
  id : String,
  split : String,
  bytes : String,
  pixels : String,
  hash : String,
) -> Item {
  { id, split, bytes, pixels, hash, contrast: 200, }
}

///|
test "cross split evidence prioritizes bytes then pixels and does not transitively merge candidates" {
  let a = String::make(64, 'a')
  let b = String::make(64, 'b')
  let c = String::make(64, 'c')
  let z = String::make(64, '0')
  let images = [
    fixture_item("a", "train", a, a, z),
    fixture_item("same-split", "train", a, a, z),
    fixture_item("b", "test", a, a, z),
    fixture_item("c", "validation", b, a, z),
    fixture_item("candidate", "test", c, c, z),
  ]
  let result = run_audit(images, 0, 10000, 100, 100)
  assert_eq(field(result, "complete"), Json(true))
  guard field(result, "pairs") is Array(pairs) else { fail("missing pairs") }
  assert_eq(pairs.length(), 8)
  assert_eq(field(pairs[0], "evidence"), Json("byte-identical"))
  guard field(result, "groups") is Array(groups) else { fail("missing groups") }
  assert_eq(groups.length(), 1)
  guard field(groups[0], "members") is Array(members) else {
    fail("missing members")
  }
  assert_eq(members.length(), 4)
}

///|
test "exact buckets remain complete even with inconsistent supplied perceptual hashes" {
  let a = String::make(64, 'a')
  let items = [
    fixture_item("a", "train", a, a, String::make(64, '0')),
    fixture_item("b", "test", a, a, String::make(64, '1')),
  ]
  let r = run_audit(items, 0, 100, 10, 10)
  guard field(r, "pairs") is Array(pairs) else { fail("missing pairs") }
  assert_eq(pairs.length(), 1)
  assert_eq(field(pairs[0], "distance"), Json(64))
}

///|
test "work and output budgets expose incompleteness" {
  let a = String::make(64, 'a')
  let z = String::make(64, '0')
  let items = [
    fixture_item("a", "train", a, a, z),
    fixture_item("b", "test", a, a, z),
  ]
  let work = run_audit(items, 6, 0, 10, 10)
  assert_eq(field(work, "complete"), Json(false))
  assert_eq(field(field(work, "stats"), "reason"), Json("ComparisonBudget"))
  assert_eq(field(field(work, "stats"), "comparisons"), Json(0))
  let output = run_audit(items, 6, 100, 0, 10)
  assert_eq(field(output, "complete"), Json(false))
  assert_eq(field(field(output, "stats"), "reason"), Json("PairBudget"))
}

///|
test "JSON boundary rejects malformed deep invalid options and duplicate identifiers" {
  for
    source in [
      "{", "[]", "{\"images\":[],\"options\":{\"threshold\":65}}", "{\"images\":[],\"options\":{\"maxPairs\":-1}}",
      "{\"images\":[],\"options\":true}",
    ] {
    assert_eq(field(@json.parse(audit_json(source)), "ok"), Json(false))
  }
  assert_eq(
    field(@json.parse(audit_json("{\"images\":[]}")), "complete"),
    Json(true),
  )
}
