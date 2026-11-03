///|
// Optional bounded review ordering. This never changes report evidence or drops pairs.
fn workflow_review_order(report : Json) -> Json {
  let images : Map[String, Json] = Map([])
  for image in workflow_rows(report, "images") {
    images[text(field(image, "id"))] = image
  }
  let ranks : Map[String, (Int32, Int32, Int32, Int32)] = Map([])
  let support : Map[String, Json] = Map([])
  let mut scored = 0
  let mut comparisons = 0
  let mut unscored = 0
  let keys : Array[String] = []
  for pair in workflow_rows(report, "pairs") {
    let key = workflow_key(pair)
    keys.push(key)
    let kind = text(field(pair, "evidence"))
    let mut witnesses = 0
    if kind == "local-candidate" {
      if scored < 200 {
        let a = images.get(text(field(pair, "left"))).unwrap_or(Json::null())
        let b = images.get(text(field(pair, "right"))).unwrap_or(Json::null())
        let ah = workflow_rows(a, "localHashes")
        let bh = workflow_rows(b, "localHashes")
        let ac = workflow_rows(a, "localContrasts")
        let bc = workflow_rows(b, "localContrasts")
        if ah.length() == 20 &&
          bh.length() == 20 &&
          ac.length() == 20 &&
          bc.length() == 20 {
          let left_seen : Map[Int32, Bool] = Map([])
          let right_seen : Map[Int32, Bool] = Map([])
          for i = 0; i < 20; i = i + 1 {
            let left_hash = text(ah[i])
            if integer(ac[i]) < 16 || !bits64(left_hash) {
              continue
            }
            for j = 0; j < 20; j = j + 1 {
              let right_hash = text(bh[j])
              if integer(bc[j]) < 16 || !bits64(right_hash) {
                continue
              }
              comparisons = comparisons + 1
              if hash_distance(
                  pack_validated_hash(left_hash),
                  pack_validated_hash(right_hash),
                ) <=
                option(field(report, "options"), "threshold", 6) {
                left_seen[i] = true
                right_seen[j] = true
              }
            }
          }
          // Overlapping windows are correlated; this is a review hint, never a probability.
          witnesses = Int32::min(left_seen.length(), right_seen.length())
          support[key] = Json(witnesses)
          scored = scored + 1
        } else {
          unscored = unscored + 1
        }
      } else {
        unscored = unscored + 1
      }
    }
    let tier = if exact_evidence(kind) {
      0
    } else if kind == "perceptual-candidate" {
      1
    } else {
      2
    }
    ranks[key] = (
      tier,
      if field(pair, "lowContrast") == Json(true) {
        1
      } else {
        0
      },
      -witnesses,
      integer(field(pair, "distance")),
    )
  }
  keys.sort_by((a, b) => {
    let aa = ranks[a]
    let bb = ranks[b]
    if aa.0 != bb.0 {
      aa.0 - bb.0
    } else if aa.1 != bb.1 {
      aa.1 - bb.1
    } else if aa.2 != bb.2 {
      aa.2 - bb.2
    } else if aa.3 != bb.3 {
      aa.3 - bb.3
    } else {
      a.lexical_compare(b)
    }
  })
  {
    "ok": true,
    "keys": Json(keys),
    "localWindowSupport": Json::object(support),
    "scoredLocalPairs": Json(scored),
    "unscoredLocalPairs": Json(unscored),
    "comparisons": Json(comparisons),
    "comparisonLimit": 80000,
    "experimental": true,
  }
}
