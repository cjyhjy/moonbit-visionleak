///|
priv struct Item {
  id : String
  split : String
  bytes : String
  pixels : String
  hash : String
  contrast : Int32
}

///|
priv struct BkNode {
  hash : String
  members : Array[Int32]
  children : Map[Int32, Int32]
}

///|
priv struct Budget {
  maximum : Int32
  mut work : Int32
  mut distances : Int32
  mut pair_checks : Int32
  mut reason : String
}

///|
fn Budget::take(self : Budget, distance : Bool) -> Bool {
  if self.work >= self.maximum {
    self.reason = "ComparisonBudget"
    false
  } else {
    self.work = self.work + 1
    if distance {
      self.distances = self.distances + 1
    } else {
      self.pair_checks = self.pair_checks + 1
    }
    true
  }
}

///|
pub fn hamming(left : String, right : String) -> Int32 {
  if !bits64(left) || !bits64(right) {
    return -1
  }
  let mut d = 0
  for i = 0; i < 64; i = i + 1 {
    if left[i] != right[i] {
      d = d + 1
    }
  }
  d
}

///|
fn root(parents : Array[Int32], i : Int32) -> Int32 {
  let mut p = i
  while parents[p] != p {
    parents[p] = parents[parents[p]]
    p = parents[p]
  }
  p
}

///|
fn append_pair(
  items : Array[Item],
  left : Int32,
  right : Int32,
  distance : Int32,
  pairs : Array[Json],
  parents : Array[Int32],
  budget : Budget,
  max_pairs : Int32,
) -> Bool {
  let a = items[left]
  let b = items[right]
  if a.split == b.split {
    return true
  }
  if pairs.length() >= max_pairs {
    budget.reason = "PairBudget"
    return false
  }
  let kind = if a.bytes == b.bytes {
    "byte-identical"
  } else if a.pixels == b.pixels {
    "pixel-identical"
  } else {
    "perceptual-candidate"
  }
  if kind != "perceptual-candidate" {
    let ra = root(parents, left)
    let rb = root(parents, right)
    parents[rb] = ra
  }
  pairs.push({
    "left": Json(a.id),
    "right": Json(b.id),
    "evidence": Json(kind),
    "distance": Json(distance),
    "lowContrast": Json(a.contrast < 16 || b.contrast < 16),
    "review": "unreviewed",
  })
  true
}

///|
fn run_audit(
  items : Array[Item],
  threshold : Int32,
  max_work : Int32,
  max_pairs : Int32,
  max_images : Int32,
) -> Json {
  let pairs : Array[Json] = []
  let nodes : Array[BkNode] = []
  let by_bytes : Map[String, Array[Int32]] = Map([])
  let by_pixels : Map[String, Array[Int32]] = Map([])
  let parents = Array::makei(items.length(), i => i)
  let budget : Budget = {
    maximum: max_work,
    work: 0,
    distances: 0,
    pair_checks: 0,
    reason: "",
  }
  let mut processed = 0
  // Exact buckets are checked independently of the approximate index.
  for i = 0; i < items.length(); i = i + 1 {
    let item = items[i]
    let seen : Map[Int32, Bool] = Map([])
    let exact_buckets = [
      by_bytes.get(item.bytes).unwrap_or([]),
      by_pixels.get(item.pixels).unwrap_or([]),
    ]
    for bucket in exact_buckets {
      for j in bucket {
        if seen.contains(j) {
          continue
        }
        seen[j] = true
        if !budget.take(false) {
          break
        }
        if !append_pair(
            items,
            j,
            i,
            hamming(items[j].hash, item.hash),
            pairs,
            parents,
            budget,
            max_pairs,
          ) {
          break
        }
      }
      if budget.reason != "" {
        break
      }
    }
    if budget.reason != "" {
      break
    }
    // Iterative metric-tree query. No recursion; each visit/pair consumes budget.
    let pending : Array[Int32] = if nodes.is_empty() { [] } else { [0] }
    while !pending.is_empty() {
      let n = nodes[pending.pop().unwrap()]
      if !budget.take(true) {
        break
      }
      let d = hamming(item.hash, n.hash)
      if d <= threshold {
        for j in n.members {
          if seen.contains(j) {
            continue
          }
          if !budget.take(false) {
            break
          }
          if !append_pair(items, j, i, d, pairs, parents, budget, max_pairs) {
            break
          }
        }
      }
      if budget.reason != "" {
        break
      }
      for edge = Int32::max(0, d - threshold)
          edge <= Int32::min(64, d + threshold)
          edge = edge + 1 {
        if n.children.get(edge) is Some(child) {
          pending.push(child)
        }
      }
    }
    if budget.reason != "" {
      break
    }
    if nodes.is_empty() {
      nodes.push({ hash: item.hash, members: [i], children: Map([]), })
    } else {
      let mut cursor = 0
      while true {
        if !budget.take(true) {
          break
        }
        let n = nodes[cursor]
        let d = hamming(item.hash, n.hash)
        if d == 0 {
          n.members.push(i)
          break
        }
        match n.children.get(d) {
          Some(child) => cursor = child
          None => {
            n.children[d] = nodes.length()
            nodes.push({ hash: item.hash, members: [i], children: Map([]), })
            break
          }
        }
      }
    }
    if budget.reason != "" {
      break
    }
    match by_bytes.get(item.bytes) {
      Some(b) => b.push(i)
      None => by_bytes[item.bytes] = [i]
    }
    match by_pixels.get(item.pixels) {
      Some(b) => b.push(i)
      None => by_pixels[item.pixels] = [i]
    }
    processed = processed + 1
  }
  let components : Map[Int32, Array[String]] = Map([])
  for i = 0; i < items.length(); i = i + 1 {
    let r = root(parents, i)
    match components.get(r) {
      Some(c) => c.push(items[i].id)
      None => components[r] = [items[i].id]
    }
  }
  let groups : Array[Json] = []
  for i = 0; i < items.length(); i = i + 1 {
    if components.get(i) is Some(members) && members.length() > 1 {
      groups.push({ "members": Json(members), "evidence": "exact-component" })
    }
  }
  let complete = budget.reason == ""
  {
    "ok": true,
    "complete": Json(complete),
    "status": Json(if complete { "complete" } else { "incomplete" }),
    "normalization": "vl-rgb-v1",
    "pairs": Json(pairs),
    "groups": Json(groups),
    "options": {
      "threshold": Json(threshold),
      "maxComparisons": Json(max_work),
      "maxPairs": Json(max_pairs),
      "maxImages": Json(max_images),
    },
    "stats": {
      "inputImages": Json(items.length()),
      "processedImages": Json(processed),
      "comparisons": Json(budget.work),
      "distanceEvaluations": Json(budget.distances),
      "pairChecks": Json(budget.pair_checks),
      "emittedPairs": Json(pairs.length()),
      "indexNodes": Json(nodes.length()),
      "reason": Json(budget.reason),
    },
  }
}

///|
fn option(options : Json, key : String, fallback : Int32) -> Int32 {
  if field(options, key) is Null {
    fallback
  } else {
    integer(field(options, key))
  }
}

///|
#export_name("audit_json")
pub fn audit_json(source : String) -> String {
  if source.length() > 16777216 {
    return error_json("JsonBudget", "audit JSON exceeds 16 Mi characters").stringify()
  }
  if !bounded_depth(source, 8) {
    return error_json(
      "JsonDepthBudget", "JSON structural depth exceeds 8 or is invalid",
    ).stringify()
  }
  let j = @json.parse(source) catch {
    _ => return error_json("InvalidJson", "invalid bounded JSON").stringify()
  }
  guard j is Object(_) else {
    return error_json("InvalidInput", "audit must be an object").stringify()
  }
  let opts = field(j, "options")
  if !(opts is Object(_) || opts is Null) {
    return error_json("InvalidOptions", "options must be an object").stringify()
  }
  let threshold = option(opts, "threshold", 6)
  let max_work = option(opts, "maxComparisons", 1000000)
  let max_pairs = option(opts, "maxPairs", 10000)
  let max_images = option(opts, "maxImages", 1000)
  if threshold < 0 ||
    threshold > 64 ||
    max_work < 0 ||
    max_work > 10000000 ||
    max_pairs < 0 ||
    max_pairs > 100000 ||
    max_images < 0 ||
    max_images > 10000 {
    return error_json(
      "InvalidOptions", "limits must be integers within documented hard bounds",
    ).stringify()
  }
  guard field(j, "images") is Array(raw) else {
    return error_json("InvalidInput", "images must be an array").stringify()
  }
  if raw.length() > max_images {
    return error_json("ImageBudget", "image count exceeds maxImages").stringify()
  }
  let items : Array[Item] = []
  let ids : Map[String, Bool] = Map([])
  for value in raw {
    let id = text(field(value, "id"))
    let split = text(field(value, "split"))
    let bytes = text(field(value, "byteDigest"))
    let pixels = text(field(value, "pixelDigest"))
    let hash = text(field(value, "dhash"))
    let contrast = integer(field(value, "contrast"))
    if id == "" ||
      id.length() > 4096 ||
      split == "" ||
      split.length() > 64 ||
      !hex64(bytes) ||
      !hex64(pixels) ||
      !bits64(hash) ||
      contrast < 0 ||
      contrast > 255 {
      return error_json(
        "InvalidImage", "id, split, digests, hash or contrast is invalid",
      ).stringify()
    }
    if ids.contains(id) {
      return error_json("DuplicateId", "image IDs must be unique").stringify()
    }
    ids[id] = true
    items.push({ id, split, bytes, pixels, hash, contrast, })
  }
  run_audit(items, threshold, max_work, max_pairs, max_images).stringify()
}
