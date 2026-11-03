///|
test "exact phase finds a late byte duplicate even when the perceptual phase cannot query" {
  let a = String::make(64, 'a')
  let b = String::make(64, 'b')
  let items = [
    fixture_item("first", "train", a, a, String::make(64, '0')),
    fixture_item("middle", "validation", b, b, String::make(64, '1')),
    fixture_item("last", "test", a, a, String::make(64, '0')),
  ]
  let result = run_audit(items, 6, 0, 10, 10, false, false, false)
  assert_eq(field(result, "complete"), Json(false))
  assert_eq(
    field(field(field(result, "phases"), "deterministic"), "complete"),
    Json(true),
  )
  guard field(result, "pairs") is Array(pairs) else { fail("pairs") }
  assert_eq(pairs.length(), 1)
  assert_eq(field(pairs[0], "right"), Json("last"))
  let limited = run_audit(
    items,
    6,
    1000,
    10,
    10,
    false,
    false,
    false,
    max_exact_work=0,
  )
  assert_eq(
    field(field(field(limited, "phases"), "deterministic"), "complete"),
    Json(false),
  )
  assert_eq(
    field(field(field(limited, "phases"), "perceptual"), "status"),
    Json("skipped"),
  )
}
