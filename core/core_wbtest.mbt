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
  {
    id,
    split,
    bytes,
    pixels,
    hash: pack_validated_hash(hash),
    mirror_hash: pack_validated_hash(hash),
    orientation_hashes: [],
    contrast: 200,
  }
}

///|
test "packed distance retains every bit across both unsigned words" {
  let zero = String::make(64, '0')
  let ones = String::make(64, '1')
  let packed_zero = pack_validated_hash(zero)
  let packed_ones = pack_validated_hash(ones)
  assert_eq(hash_distance(packed_zero, packed_ones), 64)
  for bit = 0; bit < 64; bit = bit + 1 {
    let single = StringBuilder()
    for i = 0; i < 64; i = i + 1 {
      single.write_string(if bit == i { "1" } else { "0" })
    }
    let value = pack_validated_hash(single.to_string())
    assert_eq(hash_distance(packed_zero, value), 1)
    assert_eq(hash_distance(packed_ones, value), 63)
    assert_eq(hash_distance(value, value), 0)
    for other = 0; other < bit; other = other + 1 {
      let second = StringBuilder()
      for i = 0; i < 64; i = i + 1 {
        second.write_string(if other == i { "1" } else { "0" })
      }
      assert_eq(
        hash_distance(value, pack_validated_hash(second.to_string())),
        2,
      )
    }
  }
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
  let result = run_audit(images, 0, 10000, 100, 100, false, false)
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
  let r = run_audit(items, 0, 100, 10, 10, false, false)
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
  let work = run_audit(items, 6, 0, 10, 10, false, false)
  assert_eq(field(work, "complete"), Json(false))
  assert_eq(field(field(work, "stats"), "reason"), Json("ComparisonBudget"))
  assert_eq(field(field(work, "stats"), "comparisons"), Json(0))
  let output = run_audit(items, 6, 100, 0, 10, false, false)
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

///|
test "full RGBA reflection precedes uneven-grid sampling" {
  let width = 10
  let height = 3
  let rgba : FixedArray[Byte] = FixedArray::make(width * height * 4, 0)
  let mirrored : FixedArray[Byte] = FixedArray::make(width * height * 4, 0)
  for y = 0; y < height; y = y + 1 {
    for x = 0; x < width; x = x + 1 {
      for c = 0; c < 4; c = c + 1 {
        let value = ((y * 83 + x * 37 + c * 29) % 256).to_byte()
        rgba[(y * width + x) * 4 + c] = value
        mirrored[(y * width + width - 1 - x) * 4 + c] = value
      }
    }
  }
  let a = fingerprint_impl(
    width,
    height,
    Bytes::from_array(rgba[:]),
    true,
    false,
  )
  let b = fingerprint(width, height, Bytes::from_array(mirrored[:]))
  assert_eq(field(a, "dhashMirror"), field(b, "dhash"))
  assert_eq(
    field(a, "pixelDigest"),
    field(fingerprint(width, height, Bytes::from_array(rgba[:])), "pixelDigest"),
  )
}

///|
test "mirror-only evidence stays a candidate and consumes bounded work" {
  let z = String::make(64, '0')
  let o = String::make(64, '1')
  let a : Item = {
    id: "a",
    split: "train",
    bytes: "a",
    pixels: "a",
    hash: pack_validated_hash(z),
    mirror_hash: pack_validated_hash(o),
    orientation_hashes: [],
    contrast: 200,
  }
  let b : Item = {
    id: "b",
    split: "test",
    bytes: "b",
    pixels: "b",
    hash: pack_validated_hash(o),
    mirror_hash: pack_validated_hash(z),
    orientation_hashes: [],
    contrast: 200,
  }
  let r = run_audit([a, b], 0, 100, 10, 10, true, false)
  guard field(r, "pairs") is Array(pairs) else { fail("missing pairs") }
  assert_eq(pairs.length(), 1)
  assert_eq(field(pairs[0], "evidence"), Json("perceptual-candidate"))
  assert_eq(field(pairs[0], "matchTransform"), Json("mirror-left"))
  assert_eq(field(r, "groups").stringify(), "[]")
  let limited = run_audit([a, b], 0, 3, 10, 10, true, false)
  assert_eq(field(limited, "complete"), Json(false))
  assert_true(integer(field(field(limited, "stats"), "comparisons")) <= 3)
}

///|
test "right-angle sampling matches materialized clockwise rotations" {
  let mut w = 10
  let mut h = 3
  let mut data : FixedArray[Byte] = FixedArray::make(w * h * 4, 0)
  for i = 0; i < data.length(); i = i + 1 {
    data[i] = ((i * 71 + 19) % 256).to_byte()
  }
  let result = fingerprint_impl(w, h, Bytes::from_array(data[:]), true, true)
  guard field(result, "dhashRotations") is Array(hashes) else {
    fail("missing rotations")
  }
  for turn = 0; turn < 3; turn = turn + 1 {
    let next : FixedArray[Byte] = FixedArray::make(data.length(), 0)
    for y = 0; y < h; y = y + 1 {
      for x = 0; x < w; x = x + 1 {
        for c = 0; c < 4; c = c + 1 {
          next[(x * h + h - 1 - y) * 4 + c] = data[(y * w + x) * 4 + c]
        }
      }
    }
    let old_w = w
    w = h
    h = old_w
    data = next
    assert_eq(
      hashes[turn],
      field(fingerprint(w, h, Bytes::from_array(data[:])), "dhash"),
    )
  }
}

///|
test "rotation-only evidence stays candidate and respects zero work budget" {
  let r = @json.parse(
    audit_json(
      "{\"images\": [{\"id\": \"a\", \"split\": \"train\", \"byteDigest\": \"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\", \"pixelDigest\": \"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\", \"dhash\": \"0000000000000000000000000000000000000000000000000000000000000000\", \"dhashRotations\": [\"1111111111111111111111111111111111111111111111111111111111111111\", \"0000000000000000000000000000000000000000000000000000000000000000\", \"0000000000000000000000000000000000000000000000000000000000000000\"], \"contrast\": 200}, {\"id\": \"b\", \"split\": \"test\", \"byteDigest\": \"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\", \"pixelDigest\": \"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\", \"dhash\": \"1111111111111111111111111111111111111111111111111111111111111111\", \"dhashRotations\": [\"1111111111111111111111111111111111111111111111111111111111111111\", \"1111111111111111111111111111111111111111111111111111111111111111\", \"1111111111111111111111111111111111111111111111111111111111111111\"], \"contrast\": 200}], \"options\": {\"includeRotations\": true, \"threshold\": 0}}",
    ),
  )
  guard field(r, "pairs") is Array(pairs) else { fail("missing pairs") }
  assert_eq(pairs.length(), 1)
  assert_eq(field(pairs[0], "matchOrientation"), Json("rotate90/original"))
  assert_eq(field(pairs[0], "evidence"), Json("perceptual-candidate"))
  assert_eq(field(r, "groups").stringify(), "[]")
  let limited = @json.parse(
    audit_json(
      "{\"images\": [{\"id\": \"a\", \"split\": \"train\", \"byteDigest\": \"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\", \"pixelDigest\": \"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\", \"dhash\": \"0000000000000000000000000000000000000000000000000000000000000000\", \"dhashRotations\": [\"1111111111111111111111111111111111111111111111111111111111111111\", \"0000000000000000000000000000000000000000000000000000000000000000\", \"0000000000000000000000000000000000000000000000000000000000000000\"], \"contrast\": 200}, {\"id\": \"b\", \"split\": \"test\", \"byteDigest\": \"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\", \"pixelDigest\": \"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\", \"dhash\": \"1111111111111111111111111111111111111111111111111111111111111111\", \"dhashRotations\": [\"1111111111111111111111111111111111111111111111111111111111111111\", \"1111111111111111111111111111111111111111111111111111111111111111\", \"1111111111111111111111111111111111111111111111111111111111111111\"], \"contrast\": 200}], \"options\": {\"includeRotations\": true, \"threshold\": 0, \"maxComparisons\": 0}}",
    ),
  )
  assert_eq(field(limited, "complete"), Json(false))
}
