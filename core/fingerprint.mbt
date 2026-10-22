///|
// Core hard limit also bounds arithmetic and allocations, independent of the host.
pub fn fingerprint(width : Int32, height : Int32, rgba : Bytes) -> Json {
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
  // Canonical digest domain: ASCII VL1, uint32be width, uint32be height, RGB bytes.
  let rgb : FixedArray[Byte] = FixedArray::make(11 + count * 3, 0)
  rgb[0] = 86
  rgb[1] = 76
  rgb[2] = 49
  for k = 0; k < 4; k = k + 1 {
    rgb[3 + k] = ((width >> ((3 - k) * 8)) & 255).to_byte()
    rgb[7 + k] = ((height >> ((3 - k) * 8)) & 255).to_byte()
  }
  let gray : FixedArray[Byte] = FixedArray::make(count, 0)
  let mut lo = 255
  let mut hi = 0
  for p = 0; p < count; p = p + 1 {
    let alpha = rgba[p * 4 + 3].to_int()
    let r = (rgba[p * 4].to_int() * alpha + 255 * (255 - alpha) + 127) / 255
    let g = (rgba[p * 4 + 1].to_int() * alpha + 255 * (255 - alpha) + 127) / 255
    let b = (rgba[p * 4 + 2].to_int() * alpha + 255 * (255 - alpha) + 127) / 255
    rgb[11 + p * 3] = r.to_byte()
    rgb[12 + p * 3] = g.to_byte()
    rgb[13 + p * 3] = b.to_byte()
    let luminance = (299 * r + 587 * g + 114 * b + 500) / 1000
    gray[p] = luminance.to_byte()
    if luminance < lo {
      lo = luminance
    }
    if luminance > hi {
      hi = luminance
    }
  }
  let grid = Array::make(72, 0)
  for y = 0; y < 8; y = y + 1 {
    let y0 = y * height / 8
    let y1 = Int32::max(y0 + 1, (y + 1) * height / 8)
    for x = 0; x < 9; x = x + 1 {
      let x0 = x * width / 9
      let x1 = Int32::max(x0 + 1, (x + 1) * width / 9)
      let mut sum : Int64 = 0
      for yy = y0; yy < y1; yy = yy + 1 {
        for xx = x0; xx < x1; xx = xx + 1 {
          sum = sum + gray[yy * width + xx].to_int64()
        }
      }
      grid[y * 9 + x] = (sum / ((x1 - x0) * (y1 - y0)).to_int64()).to_int()
    }
  }
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
  {
    "ok": true,
    "width": Json(width),
    "height": Json(height),
    "pixelDigest": Json(sha256(Bytes::from_array(rgb[:]))),
    "dhash": Json(bits.to_string()),
    "contrast": Json(hi - lo),
    "normalization": "vl-rgb-v1",
  }
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
