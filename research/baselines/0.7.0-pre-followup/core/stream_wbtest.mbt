///|
test "stream SHA256 published answers repeated finalization and update after finalization" {
  let context = sha256_new()
  assert_true(sha256_update(context, b"a"))
  assert_true(sha256_update(context, b""))
  assert_true(sha256_update(context, b"bc"))
  let expected = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
  assert_eq(sha256_final(context), expected)
  assert_eq(sha256_final(context), expected)
  assert_false(sha256_update(context, b"d"))
}

///|
test "stream SHA256 chunk boundaries match the published two-block vector" {
  let bytes = b"abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"
  for chunk in [1, 3, 7, 55, 56, 63, 64] {
    let state = sha256_new()
    for start = 0; start < bytes.length(); start = start + chunk {
      let end = Int32::min(bytes.length(), start + chunk)
      assert_true(sha256_update(state, bytes[start:end].to_owned()))
    }
    assert_eq(
      sha256_final(state),
      "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
    )
  }
}

///|
test "stream SHA256 million a published vector has no full message allocation" {
  let state = sha256_new()
  let block : FixedArray[Byte] = FixedArray::make(1000, 97)
  let chunk = Bytes::from_array(block[:])
  for _ in 0..<1000 {
    assert_true(sha256_update(state, chunk))
  }
  assert_eq(
    sha256_final(state),
    "cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0",
  )
}

///|
test "stream pixel digest preserves legacy dimensions alpha and ordering across row boundaries" {
  let random : OracleRandom = { seed: 0x129459U, }
  for
    (width, height) in [
      (1, 1),
      (1, 13),
      (13, 1),
      (2, 3),
      (9, 8),
      (10, 7),
      (31, 27),
    ] {
    let rgba : FixedArray[Byte] = FixedArray::make(width * height * 4, 0)
    for i = 0; i < rgba.length(); i = i + 1 {
      rgba[i] = (random.next() & 255U).to_byte()
    }
    let bytes = Bytes::from_array(rgba[:])
    let expected = field(fingerprint(width, height, bytes), "pixelDigest")
    for chunk_pixels in [1, 7, 16, 64, width, width * height] {
      let context = pixel_digest_new(width, height)
      for start = 0; start < bytes.length(); start = start + chunk_pixels * 4 {
        assert_true(
          pixel_digest_update_rgba(
            context,
            bytes[start:Int32::min(bytes.length(), start + chunk_pixels * 4)].to_owned(),
          ),
        )
      }
      let first = pixel_digest_final(context)
      assert_eq(field(@json.parse(first), "pixelDigest"), expected)
      assert_eq(pixel_digest_final(context), first)
    }
  }
}

///|
test "stream pixel digest never returns identity for truncated overlong or invalid input" {
  for (w, h) in [(0, 1), (1, 0), (-1, 1), (65536, 1), (65535, 65535)] {
    assert_eq(
      field(@json.parse(pixel_digest_final(pixel_digest_new(w, h))), "ok"),
      Json(false),
    )
  }
  let incomplete = pixel_digest_new(2, 1)
  assert_true(pixel_digest_update_rgba(incomplete, b"\xff\x00\x00\xff"))
  assert_eq(
    field(@json.parse(pixel_digest_final(incomplete)), "ok"),
    Json(false),
  )
  assert_true(pixel_digest_update_rgba(incomplete, b"\xff\x00\x00\xff"))
  assert_eq(
    field(@json.parse(pixel_digest_final(incomplete)), "ok"),
    Json(true),
  )
  assert_false(pixel_digest_update_rgba(incomplete, b"\xff\x00\x00\xff"))
  let invalid = pixel_digest_new(1, 1)
  assert_false(pixel_digest_update_rgba(invalid, b"abc"))
  assert_eq(field(@json.parse(pixel_digest_final(invalid)), "ok"), Json(false))
  let overlong = pixel_digest_new(1, 1)
  assert_false(pixel_digest_update_rgba(overlong, b"12345678"))
  assert_eq(field(@json.parse(pixel_digest_final(overlong)), "ok"), Json(false))
}

///|
test "stream pixel contrast uses full-resolution canonical luminance including transparent colors" {
  let context = pixel_digest_new(3, 1)
  assert_true(pixel_digest_update_rgba(context, b"\x00\x00\x00\x00"))
  assert_true(
    pixel_digest_update_rgba(context, b"\xff\x00\x00\xff\x00\x00\x00\xff"),
  )
  let result = @json.parse(pixel_digest_final(context))
  assert_eq(field(result, "contrast"), Json(255))
  let bytes = b"\x00\x00\x00\x00\xff\x00\x00\xff\x00\x00\x00\xff"
  let legacy = fingerprint(3, 1, bytes)
  assert_eq(field(result, "contrast"), field(legacy, "contrast"))
  assert_eq(field(result, "pixelDigest"), field(legacy, "pixelDigest"))
}

///|
test "stream dimensions support 12MP but still reject the explicit full-resolution hard ceiling" {
  assert_true(pixel_digest_new(4000, 3000).valid)
  assert_true(pixel_digest_new(10000, 10000).valid)
  assert_false(pixel_digest_new(10001, 10000).valid)
  let incomplete = pixel_digest_new(4000, 3000)
  assert_eq(
    field(@json.parse(pixel_digest_final(incomplete)), "ok"),
    Json(false),
  )
}
