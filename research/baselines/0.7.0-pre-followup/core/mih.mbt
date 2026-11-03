///|
// Exact candidate superset for radius <= 7: among four 16-bit segments at
// least one differs by at most floor(radius / 4). Preserve the original tree
// traversal by marking candidate nodes AND their ancestors, never reordering.
priv struct MihIndex {
  buckets : Map[Int32, Array[Int32]]
  parents : Array[Int32]
}

///|
fn mih_new() -> MihIndex {
  { buckets: Map([]), parents: [], }
}

///|
fn hash_segment(hash : Hash64, part : Int32) -> Int32 {
  let word = if part < 2 { hash.high } else { hash.low }
  ((word >> (part % 2 * 16)) & 65535U).reinterpret_as_int()
}

///|
fn mih_insert(index : MihIndex, hash : Hash64, parent : Int32) -> Unit {
  let id = index.parents.length()
  index.parents.push(parent)
  for part in 0..<4 {
    let key = part * 65536 + hash_segment(hash, part)
    match index.buckets.get(key) {
      Some(ids) => ids.push(id)
      None => index.buckets[key] = [id]
    }
  }
}

///|
fn Budget::take_index(self : Budget) -> Bool {
  // Separate, explicit bound for probes, postings and ancestor walks. The
  // historical comparison budget continues to count distances + pair checks.
  if self.index_work >= self.maximum * 16 {
    self.reason = "IndexBudget"
    false
  } else {
    self.index_work = self.index_work + 1
    true
  }
}

///|
fn mih_paths(
  index : MihIndex,
  hash : Hash64,
  threshold : Int32,
  budget : Budget,
) -> Map[Int32, Bool]? {
  // Small trees cost less to traverse directly. Large radii retain BK search.
  if threshold > 7 || index.parents.length() < 128 {
    return None
  }
  let paths : Map[Int32, Bool] = Map([])
  for part in 0..<4 {
    let segment = hash_segment(hash, part)
    let probes = if threshold < 4 { 1 } else { 17 }
    for probe in 0..<probes {
      if !budget.take_index() {
        return Some(paths)
      }
      let mask = if probe == 0 { 0 } else { 1 << (probe - 1) }
      let key = part * 65536 + (segment ^ mask)
      if index.buckets.get(key) is Some(ids) {
        for id in ids {
          if !budget.take_index() {
            return Some(paths)
          }
          let mut cursor = id
          while cursor >= 0 && !paths.contains(cursor) {
            if !budget.take_index() {
              return Some(paths)
            }
            paths[cursor] = true
            cursor = index.parents[cursor]
          }
        }
      }
    }
  }
  Some(paths)
}

///|
fn mih_contains(paths : Map[Int32, Bool]?, id : Int32) -> Bool {
  match paths {
    None => true
    Some(values) => values.contains(id)
  }
}
