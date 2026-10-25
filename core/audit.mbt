///|
// Pack once after input validation. Two 32-bit words keep the JS backend on
// native bitwise operations while preserving all 64 bits on every target.
priv struct Hash64 {
  high : UInt32
  low : UInt32
}

///|
fn pack_validated_hash(bits : String) -> Hash64 {
  let mut high : UInt32 = 0
  let mut low : UInt32 = 0
  for i = 0; i < 32; i = i + 1 {
    high = (high << 1) | (if bits[i] == '1' { 1U } else { 0U })
    low = (low << 1) | (if bits[i + 32] == '1' { 1U } else { 0U })
  }
  { high, low, }
}

///|
fn hash_distance(left : Hash64, right : Hash64) -> Int32 {
  (left.high ^ right.high).popcnt() + (left.low ^ right.low).popcnt()
}

///|
priv struct Item {
  id : String
  split : String
  bytes : String
  pixels : String
  hash : Hash64
  mirror_hash : Hash64
  orientation_hashes : Array[Hash64]
  contrast : Int32
  local_hashes : Array[Hash64]
  local_contrasts : Array[Int32]
}

///|
priv struct BkNode {
  hash : Hash64
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
  transform : String,
  rotations : Bool,
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
  let pair : Json = {
    "left": Json(a.id),
    "right": Json(b.id),
    "evidence": Json(kind),
    "distance": Json(distance),
    "lowContrast": Json(a.contrast < 16 || b.contrast < 16),
    "review": "unreviewed",
  }
  if transform != "original" && kind == "perceptual-candidate" {
    if pair is Object(fields) {
      fields[if rotations { "matchOrientation" } else { "matchTransform" }] = Json(
        transform,
      )
    }
  }
  pairs.push(pair)
  true
}

///|
fn run_audit(
  items : Array[Item],
  threshold : Int32,
  max_work : Int32,
  max_pairs : Int32,
  max_images : Int32,
  include_mirrors : Bool,
  include_rotations : Bool,
  include_crops : Bool,
) -> Json {
  let pairs : Array[Json] = []
  let nodes : Array[BkNode] = []
  let local_nodes : Array[LocalNode] = []
  let mut local_work = 0
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
            hash_distance(items[j].hash, item.hash),
            pairs,
            parents,
            budget,
            max_pairs,
            "original",
            include_rotations,
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
    let variants = if include_rotations {
      item.orientation_hashes
    } else if include_mirrors {
      [item.hash, item.mirror_hash]
    } else {
      [item.hash]
    }
    for query_hash in variants {
      let pending : Array[Int32] = if nodes.is_empty() { [] } else { [0] }
      while !pending.is_empty() {
        let n = nodes[pending.pop().unwrap()]
        if !budget.take(true) {
          break
        }
        let d = hash_distance(query_hash, n.hash)
        if d <= threshold {
          for j in n.members {
            if seen.contains(j) {
              continue
            }
            if !budget.take(false) {
              break
            }
            let (pair_d, transform) = if include_rotations {
              orientation_distance(items[j], item, budget, include_mirrors)
            } else if include_mirrors {
              mirror_distance(items[j], item, budget)
            } else {
              (d, "original")
            }
            if budget.reason != "" {
              break
            }
            seen[j] = true
            if !append_pair(
                items, j, i, pair_d, pairs, parents, budget, max_pairs, transform,
                include_rotations,
              ) {
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
    }
    if budget.reason != "" {
      break
    }
    if include_crops {
      let before = budget.work
      local_query(
        items, i, local_nodes, seen, pairs, budget, threshold, max_pairs,
      )
      if budget.reason == "" {
        local_insert(item, i, local_nodes, budget)
      }
      local_work = local_work + budget.work - before
      if budget.reason != "" {
        break
      }
    }
    for insert_hash in variants {
      if nodes.is_empty() {
        nodes.push({ hash: insert_hash, members: [i], children: Map([]), })
      } else {
        let mut cursor = 0
        while true {
          if !budget.take(true) {
            break
          }
          let n = nodes[cursor]
          let d = hash_distance(insert_hash, n.hash)
          if d == 0 {
            n.members.push(i)
            break
          }
          match n.children.get(d) {
            Some(child) => cursor = child
            None => {
              n.children[d] = nodes.length()
              nodes.push({ hash: insert_hash, members: [i], children: Map([]), })
              break
            }
          }
        }
      }
      if budget.reason != "" {
        break
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
  let result : Json = {
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
  if include_mirrors {
    if field(result, "options") is Object(fields) {
      fields["includeMirrors"] = Json(true)
    }
  }
  if include_rotations {
    if field(result, "options") is Object(fields) {
      fields["includeRotations"] = Json(true)
    }
  }
  if include_crops {
    if field(result, "options") is Object(fields) {
      fields["includeCrops"] = Json(true)
    }
    if field(result, "stats") is Object(fields) {
      fields["localComparisons"] = Json(local_work)
      fields["localIndexNodes"] = Json(local_nodes.length())
    }
    if result is Object(fields) {
      fields["localProfile"] = {
        "version": "vl-local-dhash-v1",
        "windows": Json(crop_windows()),
        "minimumGridContrast": 16,
        "distanceSemantics": "first deterministic window witness within threshold; not a minimum over all windows",
      }
    }
  }
  result
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
  let mirror_option = field(opts, "includeMirrors")
  if !(mirror_option is True || mirror_option is False || mirror_option is Null) {
    return error_json("InvalidOptions", "includeMirrors must be a boolean").stringify()
  }
  let include_mirrors = mirror_option == Json(true)
  let rotation_option = field(opts, "includeRotations")
  if !(rotation_option is True ||
    rotation_option is False ||
    rotation_option is Null) {
    return error_json("InvalidOptions", "includeRotations must be a boolean").stringify()
  }
  let include_rotations = rotation_option == Json(true)
  let crop_option = field(opts, "includeCrops")
  if !(crop_option is True || crop_option is False || crop_option is Null) {
    return error_json("InvalidOptions", "includeCrops must be boolean").stringify()
  }
  let include_crops = crop_option == Json(true)
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
    let mirror_hash = if include_mirrors {
      text(field(value, "dhashMirror"))
    } else {
      hash
    }
    let contrast = integer(field(value, "contrast"))
    if id == "" ||
      id.length() > 4096 ||
      split == "" ||
      split.length() > 64 ||
      !hex64(bytes) ||
      !hex64(pixels) ||
      !bits64(hash) ||
      !bits64(mirror_hash) ||
      contrast < 0 ||
      contrast > 255 {
      return error_json(
        "InvalidImage", "id, split, digests, hash or contrast is invalid",
      ).stringify()
    }
    if ids.contains(id) {
      return error_json("DuplicateId", "image IDs must be unique").stringify()
    }
    let orientation_hashes : Array[Hash64] = []
    if include_rotations {
      guard field(value, "dhashRotations") is Array(rotated) else {
        return error_json(
          "InvalidImage", "dhashRotations must contain three hashes",
        ).stringify()
      }
      if rotated.length() != 3 {
        return error_json(
          "InvalidImage", "dhashRotations must contain three hashes",
        ).stringify()
      }
      let mirrored = field(value, "dhashMirrorRotations")
      if include_mirrors {
        guard mirrored is Array(a) && a.length() == 3 else {
          return error_json(
            "InvalidImage", "dhashMirrorRotations must contain three hashes",
          ).stringify()
        }
      }
      orientation_hashes.push(pack_validated_hash(hash))
      if include_mirrors {
        orientation_hashes.push(pack_validated_hash(mirror_hash))
      }
      for i = 0; i < 3; i = i + 1 {
        let h = text(rotated[i])
        if !bits64(h) {
          return error_json("InvalidImage", "invalid rotated hash").stringify()
        }
        orientation_hashes.push(pack_validated_hash(h))
        if include_mirrors {
          if mirrored is Array(a) {
            let mh = text(a[i])
            if !bits64(mh) {
              return error_json(
                "InvalidImage", "invalid reflected rotated hash",
              ).stringify()
            }
            orientation_hashes.push(pack_validated_hash(mh))
          }
        }
      }
    }
    let local_hashes : Array[Hash64] = []
    let local_contrasts : Array[Int32] = []
    if include_crops {
      guard field(value, "localHashes") is Array(hs) && hs.length() == 20 else {
        return error_json(
          "InvalidImage", "localHashes must contain twenty hashes",
        ).stringify()
      }
      guard field(value, "localContrasts") is Array(cs) && cs.length() == 20 else {
        return error_json(
          "InvalidImage", "localContrasts must contain twenty contrasts",
        ).stringify()
      }
      for k = 0; k < 20; k = k + 1 {
        let h = text(hs[k])
        let c = integer(cs[k])
        if !bits64(h) || c < 0 || c > 255 {
          return error_json("InvalidImage", "invalid local hash or contrast").stringify()
        }
        local_hashes.push(pack_validated_hash(h))
        local_contrasts.push(c)
      }
    }
    ids[id] = true
    items.push({
      id,
      split,
      bytes,
      pixels,
      hash: pack_validated_hash(hash),
      mirror_hash: pack_validated_hash(mirror_hash),
      orientation_hashes,
      contrast,
      local_hashes,
      local_contrasts,
    })
  }
  run_audit(
    items, threshold, max_work, max_pairs, max_images, include_mirrors, include_rotations,
    include_crops,
  ).stringify()
}

///|
// Four ordinary Hamming metrics: never use the minimum as a BK-tree metric.
// Reflection and uneven integer sampling need not preserve original distances.
fn mirror_distance(a : Item, b : Item, budget : Budget) -> (Int32, String) {
  let mut best = 65
  let mut transform = "original"
  let labels = ["original", "mirror-left", "mirror-right", "mirror-both"]
  for k = 0; k < 4; k = k + 1 {
    if !budget.take(true) {
      return (-1, "")
    }
    let left = if k == 1 || k == 3 { a.mirror_hash } else { a.hash }
    let right = if k == 2 || k == 3 { b.mirror_hash } else { b.hash }
    let d = hash_distance(left, right)
    if d < best {
      best = d
      transform = labels[k]
    }
  }
  (best, transform)
}

///|
fn orientation_labels(mirrors : Bool) -> Array[String] {
  let names = ["original", "rotate90", "rotate180", "rotate270"]
  let labels : Array[String] = []
  for name in names {
    labels.push(name)
    if mirrors {
      labels.push(if name == "original" { "mirror" } else { name + "-mirror" })
    }
  }
  labels
}

///|
fn orientation_distance(
  a : Item,
  b : Item,
  budget : Budget,
  mirrors : Bool,
) -> (Int32, String) {
  let labels = orientation_labels(mirrors)
  let mut best = 65
  let mut transform = ""
  for j = 0; j < b.orientation_hashes.length(); j = j + 1 {
    for i = 0; i < a.orientation_hashes.length(); i = i + 1 {
      if !budget.take(true) {
        return (-1, "")
      }
      let d = hash_distance(a.orientation_hashes[i], b.orientation_hashes[j])
      if d < best {
        best = d
        transform = labels[i] + "/" + labels[j]
        // Zero proves the minimum; ties deliberately use the first combination.
        if best == 0 {
          return (best, transform)
        }
      }
    }
  }
  (best, transform)
}
