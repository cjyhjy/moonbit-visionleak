///|
// The resource policy for perception is independent of full pixel identity.
// A dimension plan never silently changes the dimensions hashed by VL1.
fn sampling_plan(width : Int32, height : Int32, maximum : Int32) -> Json {
  if width <= 0 ||
    height <= 0 ||
    width > 65535 ||
    height > 65535 ||
    width > 100000000 / height ||
    maximum < 1 ||
    maximum > 4194304 {
    return error_json(
      "InvalidSamplingBudget", "Dimensions or perception pixel cap are outside the documented bounds",
    )
  }
  let downsampled = width * height > maximum
  let scale = if downsampled {
    (maximum.to_double() / (width * height).to_double()).sqrt()
  } else {
    1.0
  }
  let w = Int32::max(
    1,
    Int32::min(maximum, (width.to_double() * scale).to_int()),
  )
  let h = Int32::max(
    1,
    Int32::min(maximum / w, (height.to_double() * scale).to_int()),
  )
  {
    "ok": true,
    "width": Json(w),
    "height": Json(h),
    "downsampled": Json(downsampled),
    "sourceWidth": Json(width),
    "sourceHeight": Json(height),
  }
}

///|
#export_name("sampling_plan_json")
pub fn sampling_plan_json(
  width : Int32,
  height : Int32,
  maximum : Int32,
) -> String {
  sampling_plan(width, height, maximum).stringify()
}
