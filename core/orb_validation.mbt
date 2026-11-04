///|
fn orb_number(value : Json, low : Double, high : Double) -> Bool {
  match value {
    Number(n, ..) => n >= low && n <= high
    _ => false
  }
}

///|
fn orb_vector(value : Json, size : Int32, low : Double, high : Double) -> Bool {
  match value {
    Array(values) =>
      values.length() == size && values.all(v => orb_number(v, low, high))
    _ => false
  }
}

///|
fn orb_size(value : Json) -> Bool {
  guard value is Array(values) && values.length() == 2 else { return false }
  let width = integer(values[0])
  let height = integer(values[1])
  width >= 1 &&
  height >= 1 &&
  width <= 65535 &&
  height <= 65535 &&
  width <= 4194304 / height
}

///|
fn valid_orb_pair(pair : Json, report : Json) -> Bool {
  let w = field(pair, "matchOrb")
  let profile = field(report, "orbProfile")
  let original = text(field(w, "original"))
  let query = text(field(w, "query"))
  let ids = [text(field(pair, "left")), text(field(pair, "right"))]
  let count = integer(field(w, "inliers"))
  let matches = integer(field(w, "matches"))
  if field(field(report, "options"), "includeOrb") != Json(true) ||
    field(w, "profile") != Json("vl-orb-geometry-v1") ||
    field(profile, "id") != field(w, "profile") ||
    !hex64(text(field(profile, "profileDigest"))) ||
    !hex64(text(field(profile, "workerDigest"))) ||
    original == query ||
    !ids.contains(original) ||
    !ids.contains(query) ||
    count < 8 ||
    matches < count ||
    matches > 800 ||
    !orb_number(field(w, "inlierRatio"), 0.5, 1.0) ||
    !orb_number(field(w, "scale"), 0.15, 5.0) ||
    !orb_vector(field(w, "querySpan"), 2, 0.15, 1.0) ||
    field(w, "contained") != Json(true) ||
    !orb_size(field(w, "originalSize")) ||
    !orb_size(field(w, "querySize")) ||
    integer(field(w, "coordinateCount")) != count ||
    !hex64(text(field(w, "allCoordinatesDigest"))) ||
    field(w, "coordinatesTruncated") != Json(count > 32) {
    return false
  }
  guard field(w, "inlierRatio") is Number(ratio, ..) else { return false }
  let ratio_error = ratio * matches.to_double() - count.to_double()
  if ratio_error < -0.000001 || ratio_error > 0.000001 {
    return false
  }
  let mut dimensions_match = 0
  for image in workflow_rows(report, "images") {
    let id = text(field(image, "id"))
    if id != original && id != query {
      continue
    }
    let features = field(image, "orb")
    let dimensions = if id == original {
      field(w, "originalSize")
    } else {
      field(w, "querySize")
    }
    if dimensions != Json([field(features, "width"), field(features, "height")]) ||
      integer(field(features, "keypoints")) < count ||
      integer(field(features, "keypoints")) > 800 ||
      !hex64(text(field(features, "grayDigest"))) ||
      !hex64(text(field(features, "featureDigest"))) {
      return false
    }
    dimensions_match = dimensions_match + 1
  }
  let matrix = workflow_rows(w, "queryToOriginal")
  let corners = workflow_rows(w, "projectedQueryCorners")
  let coordinates = workflow_rows(w, "inlierCoordinates")
  dimensions_match == 2 &&
  matrix.length() == 2 &&
  matrix.all(v => orb_vector(v, 3, -1000000.0, 1000000.0)) &&
  corners.length() == 4 &&
  corners.all(v => orb_vector(v, 2, -65535.0, 131070.0)) &&
  coordinates.length() == (if count < 32 { count } else { 32 }) &&
  coordinates.all(v => orb_vector(v, 4, 0.0, 65535.0))
}
