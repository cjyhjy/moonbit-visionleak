///|
fn metric_truth_fixture() -> Json {
  {
    "pairs": [
      { "left": "a", "right": "b", "relation": "byte-identical" },
      { "left": "a", "right": "c", "relation": "near-source" },
      { "left": "a", "right": "d", "relation": "negative" },
    ],
  }
}

///|
test "exact true positives do not improve approximate recall or precision" {
  let truth = metric_truth_fixture()
  let predictions : Json = [
    { "left": "a", "right": "b", "evidence": "byte-identical" },
    { "left": "a", "right": "d", "evidence": "perceptual-candidate" },
  ]
  let scored = score_value(truth, predictions)
  assert_eq(field(scored, "ok"), Json(true))
  let scores = field(scored, "scores")
  assert_eq(field(field(scores, "exact"), "recall"), Json(1))
  assert_eq(field(field(scores, "nearOnly"), "recall"), Json(0))
  assert_eq(field(field(scores, "nearOnly"), "precision"), Json(0))
  assert_eq(field(field(scores, "nearOnly"), "fp"), Json(1))
  assert_eq(field(scores, "pairUniverse"), Json(3))
  assert_eq(field(scores, "nearOnlyUniverse"), Json(2))
}

///|
test "candidate predictions on exact truth are excluded from near-only confusion matrices" {
  let predictions : Json = [
    { "left": "a", "right": "b", "evidence": "perceptual-candidate" },
  ]
  let scores = field(score_value(metric_truth_fixture(), predictions), "scores")
  assert_eq(field(scores, "exactPairsEmittedAsCandidates"), Json(1))
  assert_eq(field(field(scores, "nearOnly"), "tp"), Json(0))
  assert_eq(field(field(scores, "nearOnly"), "fp"), Json(0))
  assert_eq(field(field(scores, "nearOnly"), "fn"), Json(1))
  assert_eq(field(field(scores, "nearOnly"), "tn"), Json(1))
}

///|
test "wrong exact evidence tier remains visible even when the union exact score is correct" {
  let predictions : Json = [
    { "left": "b", "right": "a", "evidence": "pixel-identical" },
  ]
  let scores = field(score_value(metric_truth_fixture(), predictions), "scores")
  assert_eq(field(field(scores, "exact"), "tp"), Json(1))
  guard field(scores, "exactEvidenceTierMismatches") is Array(mismatches) else {
    fail("missing tiers")
  }
  assert_eq(mismatches.length(), 1)
  assert_eq(mismatches[0], contract_first({ "pairs": predictions }, "pairs"))
}

///|
test "empty metric populations use null rather than fabricated precision and recall" {
  let result = score_value({ "pairs": [] }, [])
  assert_eq(field(result, "ok"), Json(true))
  let scores = field(result, "scores")
  for
    key in [
      "exact", "nearOnly", "nearCommonTransforms", "nearChallengeTransforms",
    ] {
    let counts = field(scores, key)
    for field_name in ["tp", "fp", "fn", "tn"] {
      assert_eq(field(counts, field_name), Json(0))
    }
    for field_name in ["precision", "recall", "falsePositiveRate"] {
      assert_eq(field(counts, field_name), Json::null())
    }
    assert_eq(field(counts, "falsePositives"), Json::array([]))
    assert_eq(field(counts, "falseNegatives"), Json::array([]))
  }
}

///|
test "challenge subset denominators partition only nonexact truth pairs" {
  let truth : Json = {
    "images": [
      { "id": "c", "transform": "challenge-crop" },
      { "id": "d", "transform": "resize" },
    ],
    "pairs": [
      { "left": "a", "right": "b", "relation": "byte-identical" },
      { "left": "a", "right": "c", "relation": "near-source" },
      { "left": "a", "right": "d", "relation": "near-source" },
      { "left": "b", "right": "c", "relation": "negative" },
      { "left": "b", "right": "d", "relation": "negative" },
    ],
  }
  let predictions : Json = [
    { "left": "a", "right": "b", "evidence": "byte-identical" },
    { "left": "a", "right": "c", "evidence": "perceptual-candidate" },
    { "left": "b", "right": "d", "evidence": "perceptual-candidate" },
  ]
  let scores = field(score_value(truth, predictions), "scores")
  let near = field(scores, "nearOnly")
  for name in ["tp", "fp", "fn", "tn"] {
    assert_eq(field(near, name), Json(1))
  }
  assert_eq(field(near, "precision"), Json(0.5))
  assert_eq(field(near, "recall"), Json(0.5))
  assert_eq(field(near, "falsePositiveRate"), Json(0.5))
  let challenge = field(scores, "nearChallengeTransforms")
  assert_eq(field(challenge, "tp"), Json(1))
  assert_eq(field(challenge, "fp"), Json(0))
  assert_eq(field(challenge, "fn"), Json(0))
  assert_eq(field(challenge, "tn"), Json(1))
  let common = field(scores, "nearCommonTransforms")
  assert_eq(field(common, "tp"), Json(0))
  assert_eq(field(common, "fp"), Json(1))
  assert_eq(field(common, "fn"), Json(1))
  assert_eq(field(common, "tn"), Json(0))
}

///|
test "scoring unknown pair or malformed truth is an error rather than an ignored prediction" {
  for
    predictions in [
      Json([{ "left": "a", "right": "unknown", "evidence": "byte-identical" }]),
      Json([{ "left": "a", "right": "c", "evidence": "unknown" }]),
      Json([{ "left": "", "right": "c", "evidence": "perceptual-candidate" }]),
      Json::null(),
      Json::empty_object(),
    ] {
    assert_eq(
      field(score_value(metric_truth_fixture(), predictions), "ok"),
      Json(false),
    )
  }
  let pair : Json = { "left": "a", "right": "b", "relation": "near-source" }
  for
    truth in [
      Json::null(),
      { "pairs": Json::null() },
      { "pairs": Json([pair, pair]) },
      { "pairs": [{ "left": "a", "right": "b", "relation": "maybe" }] },
    ] {
    assert_eq(field(score_value(truth, []), "ok"), Json(false))
  }
}

///|
test "false pair lists use deterministic pair ordering and reversal-invariant identities" {
  let truth : Json = {
    "pairs": [
      { "left": "z", "right": "aa", "relation": "near-source" },
      { "left": "cc", "right": "a", "relation": "near-source" },
      { "left": "b", "right": "long", "relation": "negative" },
      { "left": "a", "right": "long", "relation": "negative" },
    ],
  }
  let predictions : Json = [
    { "left": "long", "right": "b", "evidence": "perceptual-candidate" },
    { "left": "long", "right": "a", "evidence": "perceptual-candidate" },
    { "left": "long", "right": "a", "evidence": "perceptual-candidate" },
  ]
  let near = field(field(score_value(truth, predictions), "scores"), "nearOnly")
  assert_eq(field(near, "fp"), Json(2))
  assert_eq(field(near, "falsePositives"), Json([["a", "long"], ["b", "long"]]))
  assert_eq(field(near, "falseNegatives"), Json([["a", "cc"], ["aa", "z"]]))
}

///|
test "public metrics JSON envelope covers malformed and bounded nesting inputs" {
  for
    source in [
      "{", "null", "[]", "{}", "{\"truth\":{\"pairs\":[]},\"pairs\":{}}",
    ] {
    assert_eq(field(@json.parse(score_json(source)), "ok"), Json(false))
  }
  let request : Json = { "truth": metric_truth_fixture(), "pairs": [] }
  assert_eq(
    field(@json.parse(score_json(request.stringify())), "ok"),
    Json(true),
  )
}
