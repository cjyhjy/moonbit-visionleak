///|
fn test_rotate_rgba(bytes : Bytes, width : Int32, height : Int32) -> Bytes {
  let output : FixedArray[Byte] = FixedArray::make(bytes.length(), 0)
  for y = 0; y < height; y = y + 1 {
    for x = 0; x < width; x = x + 1 {
      for c = 0; c < 4; c = c + 1 {
        output[(x * height + height - 1 - y) * 4 + c] = bytes[(y * width + x) *
          4 +
          c]
      }
    }
  }
  Bytes::from_array(output[:])
}

///|
fn test_mirror_rgba(bytes : Bytes, width : Int32, height : Int32) -> Bytes {
  let output : FixedArray[Byte] = FixedArray::make(bytes.length(), 0)
  for y = 0; y < height; y = y + 1 {
    for x = 0; x < width; x = x + 1 {
      for c = 0; c < 4; c = c + 1 {
        output[(y * width + width - 1 - x) * 4 + c] = bytes[(y * width + x) * 4 +
          c]
      }
    }
  }
  Bytes::from_array(output[:])
}

///|
test "eight view fingerprints match physically transformed RGBA on tiny uneven and transparent images" {
  let random : OracleRandom = { seed: 0x119448U, }
  for
    (width, height) in [
      (1, 1),
      (1, 13),
      (13, 1),
      (2, 3),
      (8, 9),
      (9, 8),
      (10, 7),
      (17, 13),
      (31, 27),
      (90, 80),
    ] {
    let data : FixedArray[Byte] = FixedArray::make(width * height * 4, 0)
    for i = 0; i < data.length(); i = i + 1 {
      data[i] = (random.next() & 255U).to_byte()
    }
    let rgba = Bytes::from_array(data[:])
    let plain = fingerprint(width, height, rgba)
    for mirrors in [false, true] {
      let oriented = fingerprint_impl(width, height, rgba, mirrors, true, false)
      assert_eq(field(oriented, "pixelDigest"), field(plain, "pixelDigest"))
      assert_eq(field(oriented, "contrast"), field(plain, "contrast"))
      assert_eq(field(oriented, "dhash"), field(plain, "dhash"))
      if mirrors {
        let reflected = fingerprint(
          width,
          height,
          test_mirror_rgba(rgba, width, height),
        )
        assert_eq(field(oriented, "dhashMirror"), field(reflected, "dhash"))
      } else {
        assert_eq(field(oriented, "dhashMirror"), Json::null())
        assert_eq(field(oriented, "dhashMirrorRotations"), Json::null())
      }
      guard field(oriented, "dhashRotations") is Array(hashes) else {
        fail("missing orientation hashes")
      }
      let mut bytes = rgba
      let mut w = width
      let mut h = height
      for turn = 0; turn < 3; turn = turn + 1 {
        bytes = test_rotate_rgba(bytes, w, h)
        let old_width = w
        w = h
        h = old_width
        assert_eq(hashes[turn], field(fingerprint(w, h, bytes), "dhash"))
        if mirrors {
          guard field(oriented, "dhashMirrorRotations") is Array(mirror_hashes) else {
            fail("missing reflected rotations")
          }
          assert_eq(
            mirror_hashes[turn],
            field(fingerprint(w, h, test_mirror_rgba(bytes, w, h)), "dhash"),
          )
        }
      }
    }
  }
}
