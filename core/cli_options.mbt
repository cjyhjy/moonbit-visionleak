///|
fn cli_limits() -> Array[(String, String, Int32, Int32, Int32)] {
  [
    ("--threshold", "threshold", 0, 64, 6),
    ("--max-images", "maxImages", 1, 10000, 1000),
    ("--max-decode-pixels", "maxDecodePixels", 1, 100000000, 64000000),
    ("--max-pixels", "maxPixels", 1, 4194304, 4194304),
    ("--max-total-pixels", "maxTotalPixels", 1, 1000000000, 100000000),
    ("--max-file-bytes", "maxFileBytes", 1, 1073741824, 33554432),
    ("--max-comparisons", "maxComparisons", 0, 10000000, 1000000),
    ("--max-pairs", "maxPairs", 0, 100000, 10000),
  ]
}

///|
fn cli_defaults() -> Json {
  let options : Map[String, Json] = Map([])
  for row in cli_limits() {
    options[row.1] = Json(row.4)
  }
  options["includeMirrors"] = Json(false)
  options["includeRotations"] = Json(false)
  Json::object(options)
}

///|
fn cli_validate_options(overrides : Json) -> Json {
  guard overrides is Object(fields) else {
    return error_json("ARGUMENT_ERROR", "Options must be an object")
  }
  let options = cli_defaults()
  guard options is Object(merged) else { return options }
  for key, value in fields {
    if !merged.contains(key) {
      return error_json("ARGUMENT_ERROR", "Unknown audit option")
    }
    merged[key] = value
  }
  for key in ["includeMirrors", "includeRotations"] {
    let value = merged[key]
    if !(value is True || value is False) {
      return error_json("ARGUMENT_ERROR", key + " must be boolean")
    }
  }
  for row in cli_limits() {
    let n = integer(merged[row.1])
    if n < row.2 || n > row.3 {
      return error_json(
        "ARGUMENT_ERROR",
        row.1 +
        " must be an integer in " +
        row.2.to_string() +
        ".." +
        row.3.to_string(),
      )
    }
  }
  { "ok": true, "options": options }
}

///|
fn cli_unsigned(raw : String, maximum : Int32) -> Int32 {
  if raw == "" {
    return -1
  }
  let mut n = 0
  for c in raw.iter() {
    if c < '0' || c > '9' {
      return -1
    }
    // The value never grows beyond a documented 32-bit host budget.
    let digit = c.to_int() - 48
    if n > (maximum - digit) / 10 {
      return -1
    }
    n = n * 10 + digit
    if n > maximum {
      return -1
    }
  }
  n
}

///|
fn cli_parse(argv : Array[Json]) -> Json {
  let args = argv.map(v => text(v))
  if args.is_empty() || args.contains("--help") || args[0] == "help" {
    return { "ok": true, "args": { "help": true } }
  }
  if args[0] != "audit" {
    return error_json("ARGUMENT_ERROR", "Expected the audit command")
  }
  let seen : Map[String, Bool] = Map([])
  let options = cli_defaults()
  guard options is Object(values) else { return options }
  let mut force = false
  let mut root = ""
  let mut out = ""
  let mut i = 1
  while i < args.length() {
    let arg = args[i]
    i = i + 1
    if seen.contains(arg) {
      return error_json("ARGUMENT_ERROR", "Duplicate option: " + arg)
    }
    seen[arg] = true
    if arg == "--force" {
      force = true
      continue
    }
    if arg == "--include-mirrors" {
      values["includeMirrors"] = Json(true)
      continue
    }
    if arg == "--include-rotations" {
      values["includeRotations"] = Json(true)
      continue
    }
    if arg == "--root" || arg == "--out" {
      if i >= args.length() || args[i] == "" || args[i].has_prefix("--") {
        return error_json("ARGUMENT_ERROR", "Missing value: " + arg)
      }
      if arg == "--root" {
        root = args[i]
      } else {
        out = args[i]
      }
      i = i + 1
      continue
    }
    let mut known = false
    for row in cli_limits() {
      if arg != row.0 {
        continue
      }
      known = true
      let raw = if i < args.length() { args[i] } else { "" }
      let n = cli_unsigned(raw, row.3)
      if n < row.2 || n > row.3 {
        return error_json(
          "ARGUMENT_ERROR",
          arg +
          " must be an integer in " +
          row.2.to_string() +
          ".." +
          row.3.to_string(),
        )
      }
      values[row.1] = Json(n)
      i = i + 1
      break
    }
    if !known {
      return error_json("ARGUMENT_ERROR", "Unknown option: " + arg)
    }
  }
  if root == "" || out == "" {
    return error_json("ARGUMENT_ERROR", "Both --root and --out are required")
  }
  {
    "ok": true,
    "args": {
      "options": options,
      "force": Json(force),
      "root": Json(root),
      "out": Json(out),
    },
  }
}

///|
#export_name("cli_options_json")
pub fn cli_options_json(source : String) -> String {
  if source.length() > 1048576 || !bounded_depth(source, 16) {
    return error_json(
      "ARGUMENT_ERROR", "CLI request exceeds its bounded input budget",
    ).stringify()
  }
  let request = @json.parse(source) catch {
    _ =>
      return error_json("ARGUMENT_ERROR", "Invalid CLI request JSON").stringify()
  }
  match text(field(request, "operation")) {
    "splitAliases" => {
      let aliases : Array[String] = []
      for row in split_alias_groups() {
        for name in row.1 {
          aliases.push(name)
        }
      }
      let result : Json = { "ok": true, "aliases": Json(aliases) }
      result.stringify()
    }
    "splits" => {
      guard field(request, "names") is Array(names) else {
        return error_json("ARGUMENT_ERROR", "Split names must be an array").stringify()
      }
      resolve_split_scope(names).stringify()
    }
    "defaults" => {
      let result : Json = { "ok": true, "options": cli_defaults() }
      result.stringify()
    }
    "parse" => {
      guard field(request, "argv") is Array(args) else {
        return error_json("ARGUMENT_ERROR", "Arguments must be an array").stringify()
      }
      cli_parse(args).stringify()
    }
    "options" => cli_validate_options(field(request, "overrides")).stringify()
    _ => error_json("ARGUMENT_ERROR", "Unknown CLI operation").stringify()
  }
}

///|
fn split_alias_groups() -> Array[(String, Array[String])] {
  [
    ("train", ["train", "training"]),
    ("validation", ["validation", "val", "valid", "dev"]),
    ("test", ["test", "testing"]),
  ]
}

///|
fn resolve_split_scope(names : Array[Json]) -> Json {
  let present : Map[String, Bool] = Map([])
  for name in names {
    guard name is String(value) else {
      return error_json(
        "ARGUMENT_ERROR", "Split directory names must be strings",
      )
    }
    present[value] = true
  }
  let directories : Array[Json] = []
  let mapping : Map[String, Json] = Map([])
  let missing : Array[String] = []
  for (split, aliases) in split_alias_groups() {
    let found = aliases.filter(name => present.contains(name))
    if found.length() > 1 {
      let result : Json = {
        "ok": false,
        "error": {
          "code": "SPLIT_ALIAS_CONFLICT",
          "message": "Multiple directories name the same split",
          "split": Json(split),
          "directories": Json(found),
        },
      }
      return result
    }
    if found.is_empty() {
      missing.push(split)
      continue
    }
    directories.push({ "directory": Json(found[0]), "split": Json(split) })
    mapping[found[0]] = Json(split)
  }
  {
    "ok": true,
    "directories": Json(directories),
    "mapping": Json::object(mapping),
    "missingSplits": Json(missing),
  }
}
