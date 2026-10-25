///|
// An ECMAScript object enumerates array-index keys before other string keys.
// v2 historically sorted Object.keys, then constructed an object, so numeric
// keys still enumerate numerically. This matters for imported extension fields.
fn property_index(key : String) -> UInt64? {
  if key == "" || key.length() > 10 || (key.length() > 1 && key[0] == '0') {
    return None
  }
  let mut value = 0UL
  for c in key.iter() {
    if c < '0' || c > '9' {
      return None
    }
    value = value * 10 + (c.to_int() - 48).to_uint64()
  }
  if value < 4294967295UL {
    Some(value)
  } else {
    None
  }
}

///|
fn identity_write(
  value : Json,
  canonical : Bool,
  top : Bool,
  out : StringBuilder,
) -> Unit {
  match value {
    Object(fields) => {
      let numeric : Array[(UInt64, String)] = []
      let keys : Array[String] = []
      for key, _ in fields {
        if top && ["auditId", "createdAt", "timing", "review"].contains(key) {
          continue
        }
        match property_index(key) {
          Some(index) => numeric.push((index, key))
          None => keys.push(key)
        }
      }
      numeric.sort_by_key(p => p.0)
      if canonical {
        keys.sort_by((a, b) => a.lexical_compare(b))
      }
      let ordered = numeric.map(p => p.1)
      for key in keys {
        ordered.push(key)
      }
      out.write_string("{")
      for i = 0; i < ordered.length(); i = i + 1 {
        if i > 0 {
          out.write_string(",")
        }
        let key = ordered[i]
        out.write_string(Json(key).stringify())
        out.write_string(":")
        identity_write(fields[key], canonical, false, out)
      }
      out.write_string("}")
    }
    Array(values) => {
      out.write_string("[")
      for i = 0; i < values.length(); i = i + 1 {
        if i > 0 {
          out.write_string(",")
        }
        identity_write(values[i], canonical, false, out)
      }
      out.write_string("]")
    }
    // JS adapters serialize the JSON data before this call. The parser retains
    // that numeric spelling, avoiding backend-specific float formatting.
    _ => out.write_string(value.stringify())
  }
}

///|
#export_name("report_identity_json")
pub fn report_identity_json(source : String) -> String {
  if source.length() > 67108864 || !bounded_depth(source, 128) {
    return error_json(
      "ReportBudget", "报告超出大小或结构深度上限。",
    ).stringify()
  }
  let report = @json.parse(source) catch {
    _ =>
      return error_json("InvalidReport", "审计报告必须是有效 JSON。").stringify()
  }
  guard report is Object(_) else {
    return error_json("InvalidReport", "审计报告必须是对象。").stringify()
  }
  let version = field(report, "identityVersion")
  if !(version is Null) && version != Json("vl-report-sha256-v2") {
    return error_json(
      "IdentityVersion", "不支持的审计内容摘要版本。",
    ).stringify()
  }
  let out = StringBuilder()
  identity_write(report, !(version is Null), true, out)
  let payload = out.to_string()
  let digest = sha256(@utf8.encode(payload))
  let result : Json = {
    "ok": true,
    "payload": Json(payload),
    "digest": Json(digest),
  }
  result.stringify()
}
