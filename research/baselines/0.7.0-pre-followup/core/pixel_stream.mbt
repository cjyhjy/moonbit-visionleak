///|
// A full-resolution pixel identity has exactly the vl-rgb-v1 digest domain.
// Sampling is deliberately absent here: callers may sample for perception only.
pub struct PixelDigestState {
  hash : Sha256State
  width : Int32
  height : Int32
  expected : Int64
  mut pixels : Int64
  mut low : Int32
  mut high : Int32
  mut valid : Bool
}

///|
#export_name("pixel_digest_new")
pub fn pixel_digest_new(width : Int32, height : Int32) -> PixelDigestState {
  let valid = width > 0 &&
    height > 0 &&
    width <= 65535 &&
    height <= 65535 &&
    width <= 100000000 / height
  let hash = sha256_new()
  if valid {
    let prefix : FixedArray[Byte] = FixedArray::make(11, 0)
    prefix[0] = 86
    prefix[1] = 76
    prefix[2] = 49
    for k = 0; k < 4; k = k + 1 {
      prefix[3 + k] = ((width >> ((3 - k) * 8)) & 255).to_byte()
      prefix[7 + k] = ((height >> ((3 - k) * 8)) & 255).to_byte()
    }
    ignore(sha256_update(hash, Bytes::from_array(prefix[:])))
  }
  {
    hash,
    width,
    height,
    expected: width.to_int64() * height.to_int64(),
    pixels: 0L,
    low: 255,
    high: 0,
    valid,
  }
}

///|
#export_name("pixel_digest_update_rgba")
pub fn pixel_digest_update_rgba(
  context : PixelDigestState,
  rgba : Bytes,
) -> Bool {
  if !context.valid || rgba.length() % 4 != 0 || context.hash.digest is Some(_) {
    context.valid = false
    return false
  }
  let count = rgba.length() / 4
  if count.to_int64() > context.expected - context.pixels {
    context.valid = false
    return false
  }
  // At most one caller-sized RGB chunk is allocated. No full-image RGB/gray
  // arrays are retained by the streaming identity path.
  let rgb : FixedArray[Byte] = FixedArray::make(count * 3, 0)
  for p = 0; p < count; p = p + 1 {
    let alpha = rgba[p * 4 + 3].to_int()
    for c = 0; c < 3; c = c + 1 {
      rgb[p * 3 + c] = ((
        rgba[p * 4 + c].to_int() * alpha + 255 * (255 - alpha) + 127
      ) /
      255).to_byte()
    }
  }
  for p = 0; p < count; p = p + 1 {
    let luminance = (
        299 * rgb[p * 3].to_int() +
        587 * rgb[p * 3 + 1].to_int() +
        114 * rgb[p * 3 + 2].to_int() +
        500
      ) /
      1000
    context.low = Int32::min(context.low, luminance)
    context.high = Int32::max(context.high, luminance)
  }
  context.pixels = context.pixels + count.to_int64()
  sha256_update(context.hash, Bytes::from_array(rgb[:]))
}

///|
#export_name("pixel_digest_final")
pub fn pixel_digest_final(context : PixelDigestState) -> String {
  if !context.valid || context.pixels != context.expected {
    return error_json(
      "InvalidPixels", "Full-resolution pixel stream has invalid dimensions or length",
    ).stringify()
  }
  let result : Json = {
    "ok": true,
    "width": Json(context.width),
    "height": Json(context.height),
    "pixelDigest": Json(sha256_final(context.hash)),
    "normalization": "vl-rgb-v1",
    "contrast": Json(context.high - context.low),
  }
  result.stringify()
}
