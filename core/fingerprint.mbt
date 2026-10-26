///|
// Core hard limit also bounds arithmetic and allocations, independent of the host.
fn fingerprint_impl(
  width : Int32,
  height : Int32,
  rgba : Bytes,
  mirrors : Bool,
  rotations : Bool,
  crops : Bool,
) -> Json {
  if width <= 0 ||
    height <= 0 ||
    width > 65535 ||
    height > 65535 ||
    width > 4194304 / height {
    return error_json(
      "PixelBudget", "dimensions must fit 4194304 pixels and 65535 per side",
    )
  }
  let count = width * height
  if rgba.length() != count * 4 {
    return error_json(
      "InvalidPixels", "RGBA byte length does not match dimensions",
    )
  }
  // Keep the VL1 domain, but hash bounded RGB blocks instead of a full RGB copy.
  let digest = pixel_digest_new(width, height)
  let rgb : FixedArray[Byte] = FixedArray::make(3 * 4096, 0)
  let mut used = 0
  let gray : FixedArray[Byte] = FixedArray::make(count, 0)
  let stride = width + 1
  let sums = if crops {
    FixedArray::make(stride * (height + 1), 0)
  } else {
    FixedArray::make(0, 0)
  }
  let mut row_sum = 0
  let mut lo = 255
  let mut hi = 0
  for p = 0; p < count; p = p + 1 {
    let alpha = rgba[p * 4 + 3].to_int()
    let r = (rgba[p * 4].to_int() * alpha + 255 * (255 - alpha) + 127) / 255
    let g = (rgba[p * 4 + 1].to_int() * alpha + 255 * (255 - alpha) + 127) / 255
    let b = (rgba[p * 4 + 2].to_int() * alpha + 255 * (255 - alpha) + 127) / 255
    rgb[used] = r.to_byte()
    rgb[used + 1] = g.to_byte()
    rgb[used + 2] = b.to_byte()
    used = used + 3
    if used == rgb.length() || p == count - 1 {
      ignore(sha256_update(digest.hash, Bytes::from_array(rgb[:used])))
      used = 0
    }
    let luminance = (299 * r + 587 * g + 114 * b + 500) / 1000
    gray[p] = luminance.to_byte()
    if crops {
      let x = p % width
      let y = p / width
      if x == 0 {
        row_sum = 0
      }
      row_sum = row_sum + luminance
      sums[(y + 1) * stride + x + 1] = sums[y * stride + x + 1] + row_sum
    }
    if luminance < lo {
      lo = luminance
    }
    if luminance > hi {
      hi = luminance
    }
  }
  let grid = Array::make(72, 0)
  let mirror_grid = if mirrors { Array::make(72, 0) } else { [] }
  for y = 0; y < 8; y = y + 1 {
    let y0 = y * height / 8
    let y1 = Int32::max(y0 + 1, (y + 1) * height / 8)
    for x = 0; x < 9; x = x + 1 {
      let x0 = x * width / 9
      let x1 = Int32::max(x0 + 1, (x + 1) * width / 9)
      let mut sum : Int64 = 0
      let mut mirror_sum : Int64 = 0
      for yy = y0; yy < y1; yy = yy + 1 {
        for xx = x0; xx < x1; xx = xx + 1 {
          sum = sum + gray[yy * width + xx].to_int64()
          if mirrors {
            mirror_sum = mirror_sum +
              gray[yy * width + width - 1 - xx].to_int64()
          }
        }
      }
      grid[y * 9 + x] = (sum / ((x1 - x0) * (y1 - y0)).to_int64()).to_int()
      if mirrors {
        mirror_grid[y * 9 + x] = (mirror_sum /
        ((x1 - x0) * (y1 - y0)).to_int64()).to_int()
      }
    }
  }
  let result : Json = {
    "ok": true,
    "width": Json(width),
    "height": Json(height),
    "pixelDigest": Json(sha256_final(digest.hash)),
    "dhash": Json(grid_hash(grid)),
    "contrast": Json(hi - lo),
    "normalization": "vl-rgb-v1",
  }
  if mirrors {
    if result is Object(fields) {
      fields["dhashMirror"] = Json(grid_hash(mirror_grid))
    }
  }
  if rotations {
    if result is Object(fields) {
      fields["dhashRotations"] = Json(
        Array::makei(3, i => oriented_hash(gray, width, height, i + 1, false)),
      )
      if mirrors {
        fields["dhashMirrorRotations"] = Json(
          Array::makei(3, i => oriented_hash(gray, width, height, i + 1, true)),
        )
      }
    }
  }
  if crops {
    if result is Object(fields) {
      if local_fingerprint(width, height, sums) is Object(local_fields) {
        for key, value in local_fields {
          fields[key] = value
        }
      }
    }
  }
  result
}

///|
#export_name("fingerprint_rgba")
pub fn fingerprint_rgba(width : Int32, height : Int32, rgba : Bytes) -> String {
  fingerprint(width, height, rgba).stringify()
}

///|
#export_name("fingerprint_json")
pub fn fingerprint_json(source : String) -> String {
  // Diagnostic adapter only: large image callers should use fingerprint_rgba.
  if source.length() > 16777216 {
    return error_json("JsonBudget", "fingerprint JSON exceeds 16 Mi characters").stringify()
  }
  if !bounded_depth(source, 8) {
    return error_json(
      "JsonDepthBudget", "JSON structural depth exceeds 8 or is invalid",
    ).stringify()
  }
  let j = @json.parse(source) catch {
    _ => return error_json("InvalidJson", "invalid bounded JSON").stringify()
  }
  let w = integer(field(j, "width"))
  let h = integer(field(j, "height"))
  if w <= 0 || h <= 0 || w > 65535 || h > 65535 || w > 1048576 / h {
    return error_json(
      "PixelBudget", "JSON adapter supports at most 1048576 pixels",
    ).stringify()
  }
  guard field(j, "rgba") is Array(values) else {
    return error_json("InvalidPixels", "rgba must be an array").stringify()
  }
  if values.length() != w * h * 4 {
    return error_json("InvalidPixels", "incorrect RGBA length").stringify()
  }
  let rgba : FixedArray[Byte] = FixedArray::make(values.length(), 0)
  for i = 0; i < values.length(); i = i + 1 {
    let v = integer(values[i])
    if v < 0 || v > 255 {
      return error_json("InvalidPixels", "RGBA values must be bytes").stringify()
    }
    rgba[i] = v.to_byte()
  }
  fingerprint(w, h, Bytes::from_array(rgba[:])).stringify()
}

///|
fn grid_hash(grid : Array[Int32]) -> String {
  let bits = StringBuilder()
  for y = 0; y < 8; y = y + 1 {
    for x = 0; x < 8; x = x + 1 {
      bits.write_string(
        if grid[y * 9 + x + 1] > grid[y * 9 + x] {
          "1"
        } else {
          "0"
        },
      )
    }
  }
  bits.to_string()
}

///|
pub fn fingerprint(width : Int32, height : Int32, rgba : Bytes) -> Json {
  fingerprint_impl(width, height, rgba, false, false, false)
}

///|
#export_name("fingerprint_mirrored_rgba")
pub fn fingerprint_mirrored_rgba(
  width : Int32,
  height : Int32,
  rgba : Bytes,
) -> String {
  fingerprint_impl(width, height, rgba, true, false, false).stringify()
}

///|
// Rotate clockwise in full pixel coordinates, then optionally reflect the
// rotated image horizontally. Sampling after the transform preserves uneven bins.
fn oriented_hash(
  gray : FixedArray[Byte],
  width : Int32,
  height : Int32,
  turns : Int32,
  mirror : Bool,
) -> String {
  let w = if turns == 2 { width } else { height }
  let h = if turns == 2 { height } else { width }
  let grid = Array::make(72, 0)
  for y = 0; y < 8; y = y + 1 {
    let y0 = y * h / 8
    let y1 = Int32::max(y0 + 1, (y + 1) * h / 8)
    for x = 0; x < 9; x = x + 1 {
      let x0 = x * w / 9
      let x1 = Int32::max(x0 + 1, (x + 1) * w / 9)
      let mut sum : Int64 = 0
      for yy = y0; yy < y1; yy = yy + 1 {
        for xx = x0; xx < x1; xx = xx + 1 {
          let rx = if mirror { w - 1 - xx } else { xx }
          let (sx, sy) = match turns {
            1 => (yy, height - 1 - rx)
            2 => (width - 1 - rx, height - 1 - yy)
            _ => (width - 1 - yy, rx)
          }
          sum = sum + gray[sy * width + sx].to_int64()
        }
      }
      grid[y * 9 + x] = (sum / ((x1 - x0) * (y1 - y0)).to_int64()).to_int()
    }
  }
  grid_hash(grid)
}

///|
#export_name("fingerprint_oriented_rgba")
pub fn fingerprint_oriented_rgba(
  width : Int32,
  height : Int32,
  rgba : Bytes,
  mirrors : Bool,
) -> String {
  fingerprint_impl(width, height, rgba, mirrors, true, false).stringify()
}

///|
#export_name("fingerprint_combined_rgba")
pub fn fingerprint_combined_rgba(
  width : Int32,
  height : Int32,
  rgba : Bytes,
  mirrors : Bool,
  rotations : Bool,
) -> String {
  fingerprint_impl(width, height, rgba, mirrors, rotations, true).stringify()
}
