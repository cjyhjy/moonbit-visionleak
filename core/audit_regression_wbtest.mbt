///|
// Independent bit-by-bit oracle. It never calls pack_validated_hash,
// hash_distance, the BK-tree or the product's pair-key/metric routines.
priv struct OracleRandom {
  mut seed : UInt32
}

///|
fn OracleRandom::next(self : OracleRandom) -> UInt32 {
  self.seed = self.seed ^ (self.seed << 13)
  self.seed = self.seed ^ (self.seed >> 17)
  self.seed = self.seed ^ (self.seed << 5)
  self.seed
}

///|
fn OracleRandom::bits(self : OracleRandom) -> String {
  let out = StringBuilder()
  for _ in 0..<64 {
    out.write_string(if (self.next() & 1U) == 1U { "1" } else { "0" })
  }
  out.to_string()
}

///|
fn oracle_distance(left : String, right : String) -> Int32 {
  let mut count = 0
  for i = 0; i < 64; i = i + 1 {
    if left[i] != right[i] {
      count = count + 1
    }
  }
  count
}

///|
fn oracle_views(
  image : Json,
  mirrors : Bool,
  rotations : Bool,
) -> Array[(String, String)] {
  let values = [(text(field(image, "dhash")), "original")]
  if mirrors {
    values.push((text(field(image, "dhashMirror")), "mirror"))
  }
  if rotations {
    guard field(image, "dhashRotations") is Array(hashes) else { return values }
    guard field(image, "dhashMirrorRotations") is Array(reflected) else {
      return values
    }
    for i = 0; i < 3; i = i + 1 {
      let name = "rotate" + ((i + 1) * 90).to_string()
      values.push((text(hashes[i]), name))
      if mirrors {
        values.push((text(reflected[i]), name + "-mirror"))
      }
    }
  }
  values
}

///|
fn oracle_pair(a : Json, b : Json, mirrors : Bool, rotations : Bool) -> Json {
  let evidence = if field(a, "byteDigest") == field(b, "byteDigest") {
    "byte-identical"
  } else if field(a, "pixelDigest") == field(b, "pixelDigest") {
    "pixel-identical"
  } else {
    "perceptual-candidate"
  }
  let mut best = oracle_distance(
    text(field(a, "dhash")),
    text(field(b, "dhash")),
  )
  let mut transform = "original"
  if evidence == "perceptual-candidate" && (mirrors || rotations) {
    best = 65
    let left = oracle_views(a, mirrors, rotations)
    let right = oracle_views(b, mirrors, rotations)
    for j = 0; j < right.length(); j = j + 1 {
      for i = 0; i < left.length(); i = i + 1 {
        let distance = oracle_distance(left[i].0, right[j].0)
        if distance < best {
          best = distance
          transform = if rotations {
            left[i].1 + "/" + right[j].1
          } else if i == 1 && j == 0 {
            "mirror-left"
          } else if i == 0 && j == 1 {
            "mirror-right"
          } else if i == 1 && j == 1 {
            "mirror-both"
          } else {
            "original"
          }
        }
      }
    }
  }
  {
    "evidence": Json(evidence),
    "distance": Json(best),
    "transform": Json(transform),
  }
}

///|
fn oracle_images(count : Int32, random : OracleRandom) -> Array[Json] {
  Array::makei(count, i => {
    let image : Json = {
      "id": Json("image-" + i.to_string()),
      "split": Json(["train", "validation", "test"][i % 3]),
      "byteDigest": Json(sha256(@utf8.encode("bytes-" + i.to_string()))),
      "pixelDigest": Json(sha256(@utf8.encode("pixels-" + i.to_string()))),
      "dhash": Json(random.bits()),
      "dhashMirror": Json(random.bits()),
      "dhashRotations": Json(Array::makei(3, _ => random.bits())),
      "dhashMirrorRotations": Json(Array::makei(3, _ => random.bits())),
      "contrast": 180,
    }
    image
  })
}

///|
fn oracle_expected(
  images : Array[Json],
  threshold : Int32,
  mirrors : Bool,
  rotations : Bool,
) -> Map[String, Json] {
  let expected : Map[String, Json] = Map([])
  for i = 0; i < images.length(); i = i + 1 {
    for j = 0; j < i; j = j + 1 {
      let a = images[j]
      let b = images[i]
      if field(a, "split") == field(b, "split") {
        continue
      }
      let prediction = oracle_pair(a, b, mirrors, rotations)
      if field(prediction, "evidence") != Json("perceptual-candidate") ||
        integer(field(prediction, "distance")) <= threshold {
        expected[text(field(a, "id")) + "|" + text(field(b, "id"))] = prediction
      }
    }
  }
  expected
}

///|
fn check_oracle_members(
  report : Json,
  expected : Map[String, Json],
) -> Unit raise {
  assert_eq(field(report, "ok"), Json(true))
  guard field(report, "pairs") is Array(pairs) else {
    fail("missing pair output")
  }
  let seen : Map[String, Bool] = Map([])
  for pair in pairs {
    let key = text(field(pair, "left")) + "|" + text(field(pair, "right"))
    assert_false(seen.contains(key))
    seen[key] = true
    guard expected.get(key) is Some(prediction) else {
      fail("unexpected pair: " + key)
    }
    assert_eq(field(pair, "evidence"), field(prediction, "evidence"))
    assert_eq(field(pair, "distance"), field(prediction, "distance"))
    let actual = null_default(
      field(pair, "matchOrientation"),
      null_default(field(pair, "matchTransform"), Json("original")),
    )
    assert_eq(actual, field(prediction, "transform"))
  }
  if field(report, "complete") == Json(true) {
    assert_eq(pairs.length(), expected.length())
  }
  let stats = field(report, "stats")
  assert_eq(
    integer(field(stats, "comparisons")),
    integer(field(stats, "distanceEvaluations")) +
    integer(field(stats, "pairChecks")),
  )
}

///|
test "independent exhaustive oracle across three modes thresholds ties and exact classes" {
  let random : OracleRandom = { seed: 0x61523427U, }
  for _ in 0..<12 {
    let images = oracle_images(30, random)
    // Inject non-metric orientation relationships and inconsistent exact metadata.
    if images[1] is Object(fields) {
      fields["dhashMirror"] = field(images[0], "dhash")
    }
    if images[2] is Object(fields) {
      fields["dhash"] = field(images[0], "dhashMirror")
    }
    if images[4] is Object(fields) {
      fields["byteDigest"] = field(images[0], "byteDigest")
    }
    if images[5] is Object(fields) {
      fields["pixelDigest"] = field(images[0], "pixelDigest")
    }
    if images[7] is Object(fields) {
      fields["dhashRotations"] = Json([
        text(field(images[0], "dhash")),
        random.bits(),
        random.bits(),
      ])
    }
    for mode in [0, 1, 2, 3] {
      let mirrors = mode == 1 || mode == 3
      let rotations = mode >= 2
      for threshold in [0, 1, 6, 16, 32, 64] {
        let options : Json = {
          "threshold": Json(threshold),
          "maxComparisons": 1000000,
          "maxPairs": 10000,
          "includeMirrors": Json(mirrors),
          "includeRotations": Json(rotations),
        }
        let input : Json = { "images": Json(images), "options": options }
        let report = @json.parse(audit_json(input.stringify()))
        assert_eq(field(report, "complete"), Json(true))
        assert_eq(
          integer(field(field(report, "stats"), "processedImages")),
          images.length(),
        )
        let factor = if rotations {
          if mirrors {
            8
          } else {
            4
          }
        } else if mirrors {
          2
        } else {
          1
        }
        assert_true(
          integer(field(field(report, "stats"), "indexNodes")) <=
          factor * images.length(),
        )
        check_oracle_members(
          report,
          oracle_expected(images, threshold, mirrors, rotations),
        )
      }
    }
  }
}

///|
test "partial budget outputs are oracle members with bounded work and unique pairs" {
  let random : OracleRandom = { seed: 0x119448U, }
  let images = oracle_images(24, random)
  for image in images {
    if image is Object(fields) {
      fields["dhash"] = Json(String::make(64, '0'))
    }
  }
  for mode in [0, 1, 2, 3] {
    let mirrors = mode == 1 || mode == 3
    let rotations = mode >= 2
    let expected = oracle_expected(images, 64, mirrors, rotations)
    for work in [0, 1, 2, 8, 32, 150, 1000] {
      for max_pairs in [0, 1, 7] {
        let input : Json = {
          "images": Json(images),
          "options": {
            "threshold": 64,
            "maxComparisons": Json(work),
            "maxPairs": Json(max_pairs),
            "includeMirrors": Json(mirrors),
            "includeRotations": Json(rotations),
          },
        }
        let report = @json.parse(audit_json(input.stringify()))
        assert_eq(field(report, "complete"), Json(false))
        assert_true(
          integer(field(field(report, "stats"), "comparisons")) <= work,
        )
        guard field(report, "pairs") is Array(pairs) else {
          fail("missing pairs")
        }
        assert_true(pairs.length() <= max_pairs)
        check_oracle_members(report, expected)
      }
    }
  }
}

///|
test "all hash word sign bits and word boundaries agree with bitwise oracle" {
  let random : OracleRandom = { seed: 0x894731U, }
  let images = oracle_images(68, random)
  let hashes = [
    String::make(64, '0'),
    String::make(64, '1'),
    String::make(32, '0') + String::make(32, '1'),
    String::make(32, '1') + String::make(32, '0'),
  ]
  for bit in 0..<64 {
    let value = StringBuilder()
    for position in 0..<64 {
      value.write_string(if bit == position { "1" } else { "0" })
    }
    hashes.push(value.to_string())
  }
  for i = 0; i < images.length(); i = i + 1 {
    if images[i] is Object(fields) {
      fields["dhash"] = Json(hashes[i])
    }
  }
  for threshold in [0, 1, 2, 31, 32, 33, 63, 64] {
    let input : Json = {
      "images": Json(images),
      "options": { "threshold": Json(threshold) },
    }
    let report = @json.parse(audit_json(input.stringify()))
    assert_eq(field(report, "complete"), Json(true))
    check_oracle_members(
      report,
      oracle_expected(images, threshold, false, false),
    )
  }
}

///|
test "JSON adapters reject invalid typed metadata and incomplete orientation arrays" {
  let random : OracleRandom = { seed: 0x36c18aU, }
  let images = oracle_images(2, random)
  let invalid_options : Array[Json] = [
    { "threshold": 0.5 },
    { "maxComparisons": 10000001 },
    { "maxImages": -1 },
    { "includeMirrors": "true" },
    { "includeRotations": 1 },
  ]
  for options in invalid_options {
    let input : Json = { "images": Json(images), "options": options }
    assert_eq(
      field(@json.parse(audit_json(input.stringify())), "ok"),
      Json(false),
    )
  }
  for
    (key, value) in [
      ("dhash", Json(String::make(64, 'x'))),
      ("contrast", Json(256)),
      ("pixelDigest", Json("wrong")),
      ("id", Json("")),
    ] {
    let changed = @json.parse(images[0].stringify())
    if changed is Object(fields) {
      fields[key] = value
    }
    let input : Json = { "images": Json([changed]) }
    assert_eq(
      field(@json.parse(audit_json(input.stringify())), "ok"),
      Json(false),
    )
  }
  for key in ["dhashRotations", "dhashMirrorRotations"] {
    for
      value in [
        Json::null(),
        Json::array([]),
        Json([random.bits(), random.bits()]),
        Json([random.bits(), random.bits(), "invalid"]),
      ] {
      let changed = @json.parse(images[0].stringify())
      if changed is Object(fields) {
        fields[key] = value
      }
      let input : Json = {
        "images": Json([changed]),
        "options": { "includeMirrors": true, "includeRotations": true },
      }
      assert_eq(
        field(@json.parse(audit_json(input.stringify())), "ok"),
        Json(false),
      )
    }
  }
  let duplicate : Json = { "images": Json([images[0], images[0]]) }
  assert_eq(
    field(
      field(@json.parse(audit_json(duplicate.stringify())), "error"),
      "code",
    ),
    Json("DuplicateId"),
  )
}

///|
test "MIH ancestor filtering agrees with exhaustive oracle on active trees across all short radii" {
  let random : OracleRandom = { seed: 0x671284U, }
  let images = oracle_images(180, random)
  // Force neighbors with differences in all four 16-bit segments.
  for k in 0..<8 {
    let original = text(field(images[k], "dhash"))
    let changed = StringBuilder()
    for bit in 0..<64 {
      let flip = bit % 16 < 2 && bit % 16 * 4 + bit / 16 < k
      changed.write_string(
        if (original[bit] == '1') != flip {
          "1"
        } else {
          "0"
        },
      )
    }
    if images[170 + k] is Object(fields) {
      fields["dhash"] = Json(changed.to_string())
    }
  }
  for threshold in 0..<8 {
    let input : Json = {
      "images": Json(images),
      "options": { "threshold": Json(threshold) },
    }
    let report = @json.parse(audit_json(input.stringify()))
    assert_eq(field(report, "complete"), Json(true))
    assert_true(integer(field(field(report, "stats"), "indexOperations")) > 0)
    check_oracle_members(
      report,
      oracle_expected(images, threshold, false, false),
    )
  }
}
