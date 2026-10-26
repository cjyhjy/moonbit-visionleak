///|
// Normalized rectangles use [left, top, right, bottom] in thousandths.
// Fixed before new holdout images are downloaded or evaluated.
fn crop_windows() -> Array[Array[Int32]] {
  let rows = [[0, 0, 1000, 1000]]
  for side in [900, 750, 500] {
    let gap = 1000 - side
    for (x, y) in [(0, 0), (gap, 0), (0, gap), (gap, gap), (gap / 2, gap / 2)] {
      rows.push([x, y, x + side, y + side])
    }
  }
  for
    row in [
      [0, 0, 750, 1000],
      [250, 0, 1000, 1000],
      [0, 0, 1000, 750],
      [0, 250, 1000, 1000],
    ] {
    rows.push(row)
  }
  rows
}

///|
#export_name("fingerprint_local_rgba")
pub fn fingerprint_local_rgba(
  width : Int32,
  height : Int32,
  rgba : Bytes,
) -> String {
  if width <= 0 ||
    height <= 0 ||
    width > 65535 ||
    height > 65535 ||
    width > 4194304 / height ||
    rgba.length() != width * height * 4 {
    return error_json(
      "InvalidPixels", "local fingerprint requires bounded RGBA",
    ).stringify()
  }
  // Summed-area grayscale: every window costs 72 box queries, not a full decode.
  // 255 * 4194304 < 2^30, so even intermediate additions fit signed Int32.
  let stride = width + 1
  let sums = FixedArray::make((width + 1) * (height + 1), 0)
  for y = 0; y < height; y = y + 1 {
    let mut row = 0
    for x = 0; x < width; x = x + 1 {
      let p = (y * width + x) * 4
      let a = rgba[p + 3].to_int()
      let r = (rgba[p].to_int() * a + 255 * (255 - a) + 127) / 255
      let g = (rgba[p + 1].to_int() * a + 255 * (255 - a) + 127) / 255
      let b = (rgba[p + 2].to_int() * a + 255 * (255 - a) + 127) / 255
      row = row + (299 * r + 587 * g + 114 * b + 500) / 1000
      sums[(y + 1) * stride + x + 1] = sums[y * stride + x + 1] + row
    }
  }
  let hashes : Array[String] = []
  let contrasts : Array[Int32] = []
  for rect in crop_windows() {
    let left = rect[0] * width / 1000
    let top = rect[1] * height / 1000
    let right = Int32::max(left + 1, rect[2] * width / 1000)
    let bottom = Int32::max(top + 1, rect[3] * height / 1000)
    let w = right - left
    let h = bottom - top
    let grid = Array::make(72, 0)
    let mut lo = 255
    let mut hi = 0
    for y = 0; y < 8; y = y + 1 {
      let y0 = top + y * h / 8
      let y1 = Int32::min(bottom, Int32::max(y0 + 1, top + (y + 1) * h / 8))
      for x = 0; x < 9; x = x + 1 {
        let x0 = left + x * w / 9
        let x1 = Int32::min(right, Int32::max(x0 + 1, left + (x + 1) * w / 9))
        let total = sums[y1 * stride + x1] -
          sums[y0 * stride + x1] -
          sums[y1 * stride + x0] +
          sums[y0 * stride + x0]
        let mean = total / ((x1 - x0) * (y1 - y0))
        grid[y * 9 + x] = mean
        lo = Int32::min(lo, mean)
        hi = Int32::max(hi, mean)
      }
    }
    hashes.push(grid_hash(grid))
    contrasts.push(hi - lo)
  }
  let result : Json = {
    "ok": true,
    "localHashes": Json(hashes),
    "localContrasts": Json(contrasts),
    "localHashVersion": "vl-local-dhash-v1",
  }
  result.stringify()
}

///|
priv struct LocalNode {
  hash : Hash64
  members : Array[(Int32, Int32)]
  children : Map[Int32, Int32]
}

///|
fn local_query(
  items : Array[Item],
  i : Int32,
  nodes : Array[LocalNode],
  seen : Map[Int32, Bool],
  pairs : Array[Json],
  budget : Budget,
  threshold : Int32,
  max_pairs : Int32,
) -> Unit {
  let item = items[i]
  for window, hash in item.local_hashes {
    if item.local_contrasts[window] < 16 {
      continue
    }
    let pending = if nodes.is_empty() { [] } else { [0] }
    while !pending.is_empty() {
      let node = nodes[pending.pop().unwrap()]
      if !budget.take(true) {
        return
      }
      let d = hash_distance(hash, node.hash)
      if d <= threshold {
        for (j, left_window) in node.members {
          if seen.contains(j) || items[j].split == item.split {
            continue
          }
          if !budget.take(false) {
            return
          }
          if pairs.length() >= max_pairs {
            budget.reason = "PairBudget"
            return
          }
          seen[j] = true
          pairs.push({
            "left": Json(items[j].id),
            "right": Json(item.id),
            "evidence": "local-candidate",
            "distance": Json(d),
            "lowContrast": false,
            "review": "unreviewed",
            "matchLocal": {
              "leftWindow": Json(left_window),
              "rightWindow": Json(window),
              "profile": "vl-local-dhash-v1",
            },
          })
        }
      }
      for edge = Int32::max(0, d - threshold)
          edge <= Int32::min(64, d + threshold)
          edge = edge + 1 {
        if node.children.get(edge) is Some(child) {
          pending.push(child)
        }
      }
    }
  }
}

///|
fn local_insert(
  item : Item,
  i : Int32,
  nodes : Array[LocalNode],
  budget : Budget,
) -> Unit {
  for window, hash in item.local_hashes {
    if item.local_contrasts[window] < 16 {
      continue
    }
    if nodes.is_empty() {
      nodes.push({ hash, members: [(i, window)], children: Map([]), })
      continue
    }
    let mut cursor = 0
    while true {
      if !budget.take(true) {
        return
      }
      let node = nodes[cursor]
      let d = hash_distance(hash, node.hash)
      if d == 0 {
        node.members.push((i, window))
        break
      }
      match node.children.get(d) {
        Some(child) => cursor = child
        None => {
          node.children[d] = nodes.length()
          nodes.push({ hash, members: [(i, window)], children: Map([]), })
          break
        }
      }
    }
  }
}
