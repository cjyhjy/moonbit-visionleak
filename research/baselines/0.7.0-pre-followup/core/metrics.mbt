///|
// Pair scoring is product logic. Pixel normalization and exhaustive index
// references in Python stay independent and never call these helpers.
fn exact_evidence(value : String) -> Bool {
  value == "byte-identical" || value == "pixel-identical"
}

///|
fn metric_pair_array(keys : Array[String], pairs : Map[String, Json]) -> Json {
  let sorted = keys.copy()
  sorted.sort_by((a, b) => {
    let aa = pairs[a]
    let bb = pairs[b]
    guard aa is Array(av) && bb is Array(bv) else {
      return a.lexical_compare(b)
    }
    let first = text(av[0]).lexical_compare(text(bv[0]))
    if first == 0 {
      text(av[1]).lexical_compare(text(bv[1]))
    } else {
      first
    }
  })
  Json(sorted.map(key => pairs[key]))
}

///|
fn metric_ratio(numerator : Int32, denominator : Int32) -> Json {
  if denominator == 0 {
    Json::null()
  } else {
    Json(numerator.to_double() / denominator.to_double())
  }
}

///|
fn metric_counts(
  universe : Array[String],
  positive : Map[String, Bool],
  predicted : Map[String, Bool],
  pairs : Map[String, Json],
) -> Json {
  let mut tp = 0
  let mut tn = 0
  let fp : Array[String] = []
  let fn_pairs : Array[String] = []
  for key in universe {
    if positive.contains(key) {
      if predicted.contains(key) {
        tp = tp + 1
      } else {
        fn_pairs.push(key)
      }
    } else if predicted.contains(key) {
      fp.push(key)
    } else {
      tn = tn + 1
    }
  }
  {
    "tp": Json(tp),
    "fp": Json(fp.length()),
    "fn": Json(fn_pairs.length()),
    "tn": Json(tn),
    "precision": metric_ratio(tp, tp + fp.length()),
    "recall": metric_ratio(tp, tp + fn_pairs.length()),
    "falsePositiveRate": metric_ratio(fp.length(), fp.length() + tn),
    "falsePositives": metric_pair_array(fp, pairs),
    "falseNegatives": metric_pair_array(fn_pairs, pairs),
  }
}

///|
fn score_value(truth : Json, predictions : Json) -> Json {
  guard field(truth, "pairs") is Array(truth_pairs) else {
    return error_json("InvalidTruth", "Truth must contain pairs")
  }
  guard predictions is Array(output) else {
    return error_json("InvalidPredictions", "Predictions must be an array")
  }
  let labels : Map[String, String] = Map([])
  let pairs : Map[String, Json] = Map([])
  let exact : Map[String, Bool] = Map([])
  let near : Map[String, Bool] = Map([])
  let near_predictions : Map[String, Bool] = Map([])
  let exact_predictions : Map[String, Bool] = Map([])
  let wrong_tier : Array[Json] = []
  let challenges : Map[String, Bool] = Map([])
  if field(truth, "images") is Array(images) {
    for image in images {
      if text(field(image, "transform")).has_prefix("challenge-") {
        challenges[text(field(image, "id"))] = true
      }
    }
  }
  for pair in truth_pairs {
    let a = field(pair, "left")
    let b = field(pair, "right")
    let relation = text(field(pair, "relation"))
    if !nonempty(a) ||
      !nonempty(b) ||
      !["byte-identical", "pixel-identical", "near-source", "negative"].contains(
        relation,
      ) {
      return error_json(
        "InvalidTruth", "Invalid pair identifiers or truth relation",
      )
    }
    let key = review_pair_key(text(a), text(b))
    if labels.contains(key) {
      return error_json("InvalidTruth", "Duplicate truth pair")
    }
    labels[key] = relation
    let ids = [text(a), text(b)]
    ids.sort_by((a, b) => a.lexical_compare(b))
    pairs[key] = Json(ids)
    if exact_evidence(relation) {
      exact[key] = true
    }
    if relation == "near-source" {
      near[key] = true
    }
  }
  for pair in output {
    let a = field(pair, "left")
    let b = field(pair, "right")
    let evidence = text(field(pair, "evidence"))
    if !nonempty(a) || !nonempty(b) || !evidence_known(evidence) {
      return error_json(
        "InvalidPredictions", "Invalid prediction identifiers or evidence",
      )
    }
    let key = review_pair_key(text(a), text(b))
    if !labels.contains(key) {
      return error_json(
        "UnknownPair", "Audit emitted unknown or same-split pairs",
      )
    }
    if exact_evidence(evidence) {
      exact_predictions[key] = true
      if labels[key] != evidence {
        wrong_tier.push(pair)
      }
    } else {
      near_predictions[key] = true
    }
  }
  let all : Array[String] = []
  let near_universe : Array[String] = []
  let challenge_universe : Array[String] = []
  let common_universe : Array[String] = []
  let mut candidate_on_exact = 0
  for key, _ in labels {
    all.push(key)
    if exact.contains(key) {
      if near_predictions.contains(key) {
        candidate_on_exact = candidate_on_exact + 1
      }
      continue
    }
    near_universe.push(key)
    if pairs[key] is Array(ids) {
      if challenges.contains(text(ids[0])) || challenges.contains(text(ids[1])) {
        challenge_universe.push(key)
      } else {
        common_universe.push(key)
      }
    }
  }
  let scores : Json = {
    "exact": metric_counts(all, exact, exact_predictions, pairs),
    "nearOnly": metric_counts(near_universe, near, near_predictions, pairs),
    "nearCommonTransforms": metric_counts(
      common_universe, near, near_predictions, pairs,
    ),
    "nearChallengeTransforms": metric_counts(
      challenge_universe, near, near_predictions, pairs,
    ),
    "exactEvidenceTierMismatches": Json(wrong_tier),
    "exactPairsEmittedAsCandidates": Json(candidate_on_exact),
    "pairUniverse": Json(all.length()),
    "nearOnlyUniverse": Json(near_universe.length()),
  }
  { "ok": true, "scores": scores }
}

///|
#export_name("score_json")
pub fn score_json(source : String) -> String {
  if source.length() > 67108864 || !bounded_depth(source, 16) {
    return error_json(
      "MetricBudget", "Scoring input exceeds its bounded budget",
    ).stringify()
  }
  let request = @json.parse(source) catch {
    _ =>
      return error_json("InvalidJson", "Scoring requires valid JSON").stringify()
  }
  score_value(field(request, "truth"), field(request, "pairs")).stringify()
}
