///|
fn field(j : Json, key : String) -> Json {
  match j {
    Object(m) => m.get(key).unwrap_or(Json::null())
    _ => Json::null()
  }
}

///|
fn integer(j : Json) -> Int32 {
  match j {
    Number(n, ..) =>
      if n >= 0.0 && n <= 2147483647.0 && n.to_int().to_double() == n {
        n.to_int()
      } else {
        -1
      }
    _ => -1
  }
}

///|
fn text(j : Json) -> String {
  match j {
    String(s) => s
    _ => ""
  }
}

///|
fn error_json(code : String, message : String) -> Json {
  { "ok": false, "error": { "code": code, "message": message } }
}

///|
fn hex64(s : String) -> Bool {
  if s.length() != 64 {
    return false
  }
  for c in s.iter() {
    if !((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f')) {
      return false
    }
  }
  true
}

///|
fn bits64(s : String) -> Bool {
  if s.length() != 64 {
    return false
  }
  for c in s.iter() {
    if c != '0' && c != '1' {
      return false
    }
  }
  true
}

///|
// Bound nesting before invoking the standard recursive parser. Quoted brackets
// and escaped quotes do not affect structural depth; syntax remains its job.
fn bounded_depth(source : String, maximum : Int32) -> Bool {
  let mut depth = 0
  let mut quoted = false
  let mut escaped = false
  for c in source.iter() {
    if quoted {
      if escaped {
        escaped = false
      } else if c == '\\' {
        escaped = true
      } else if c == '"' {
        quoted = false
      }
    } else if c == '"' {
      quoted = true
    } else if c == '[' || c == '{' {
      depth = depth + 1
      if depth > maximum {
        return false
      }
    } else if c == ']' || c == '}' {
      depth = depth - 1
      if depth < 0 {
        return false
      }
    }
  }
  true
}
