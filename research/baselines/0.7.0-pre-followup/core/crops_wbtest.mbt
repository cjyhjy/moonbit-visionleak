///|
test "local full window agrees with the original fingerprint including alpha" {
  let w = 19
  let h = 17
  let rgba = Bytes::from_array(
    Array::makei(w * h * 4, i => ((i * 73 + 29) % 256).to_byte()),
  )
  let fp = fingerprint(w, h, rgba)
  let loc = @json.parse(fingerprint_local_rgba(w, h, rgba)) catch {
    _ => Json::null()
  }
  assert_eq(field(loc, "ok"), Json(true))
  guard field(loc, "localHashes") is Array(hashes) else {
    fail("missing hashes")
  }
  inspect(hashes.length(), content="20")
  assert_eq(hashes[0], field(fp, "dhash"))
}

///|
test "local profile bounds and transparent tiny images" {
  for w in [1, 2, 7] {
    let rgba = Bytes::from_array(Array::make(w * 4, (0).to_byte()))
    let loc = @json.parse(fingerprint_local_rgba(w, 1, rgba)) catch {
      _ => Json::null()
    }
    assert_eq(field(loc, "ok"), Json(true))
    guard field(loc, "localContrasts") is Array(values) else {
      fail("missing contrasts")
    }
    for c in values {
      assert_eq(c, Json(0))
    }
  }
  let bad = @json.parse(fingerprint_local_rgba(0, 1, Bytes::new(0))) catch {
    _ => Json::null()
  }
  assert_eq(field(bad, "ok"), Json(false))
}

///|
fn crop_test_image(
  id : String,
  split : String,
  global_hash : String,
  local_hash : String,
) -> Json {
  {
    "id": Json(id),
    "split": Json(split),
    "byteDigest": Json(if id == "a" { "a".repeat(64) } else { "b".repeat(64) }),
    "pixelDigest": Json(if id == "a" { "c".repeat(64) } else { "d".repeat(64) }),
    "dhash": Json(global_hash),
    "contrast": 150,
    "localHashes": Json(Array::make(20, local_hash)),
    "localContrasts": Json(Array::make(20, 100)),
  }
}

///|
test "local candidates obey shared budget and never merge exact groups" {
  let empty : Array[Json] = []
  let images = [
    crop_test_image("a", "train", "0".repeat(64), "01".repeat(32)),
    crop_test_image("b", "test", "1".repeat(64), "01".repeat(32)),
  ]
  let request : Json = {
    "images": Json(images),
    "options": { "includeCrops": true, "maxComparisons": 10000 },
  }
  let r = @json.parse(audit_json(request.stringify())) catch {
    _ => Json::null()
  }
  assert_eq(field(r, "complete"), Json(true))
  assert_eq(field(r, "groups"), Json(empty))
  guard field(r, "pairs") is Array(pairs) && pairs.length() == 1 else {
    fail("expected one local witness")
  }
  assert_eq(field(pairs[0], "evidence"), Json("local-candidate"))
  let gate = workflow_gate(r, "candidate")
  assert_eq(field(gate, "exitCode"), Json(3))
  assert_eq(field(field(gate, "counts"), "localCandidate"), Json(1))
  let limited : Json = {
    "images": Json(images),
    "options": { "includeCrops": true, "maxComparisons": 1 },
  }
  let stopped = @json.parse(audit_json(limited.stringify())) catch {
    _ => Json::null()
  }
  assert_eq(field(stopped, "complete"), Json(false))
  assert_eq(field(field(stopped, "stats"), "comparisons"), Json(1))
  let legacy : Json = { "images": Json(images) }
  let old = @json.parse(audit_json(legacy.stringify())) catch {
    _ => Json::null()
  }
  assert_eq(field(old, "pairs"), Json(empty))
  assert_eq(field(old, "localProfile"), Json::null())
}
