///|
test "perception plans remain bounded for small large narrow and uneven image dimensions" {
  for
    (w, h) in [
      (1, 1),
      (1, 65535),
      (65535, 1),
      (19, 17),
      (4000, 3000),
      (3000, 4000),
      (10000, 10000),
      (65535, 1525),
    ] {
    for maximum in [1, 2, 9, 16, 72, 1048576, 4194304] {
      let plan = sampling_plan(w, h, maximum)
      assert_eq(field(plan, "ok"), Json(true))
      let sw = integer(field(plan, "width"))
      let sh = integer(field(plan, "height"))
      assert_true(sw >= 1 && sh >= 1)
      assert_true(sw <= w && sh <= h)
      assert_true(sw * sh <= maximum)
      assert_eq(field(plan, "sourceWidth"), Json(w))
      assert_eq(field(plan, "sourceHeight"), Json(h))
      assert_eq(field(plan, "downsampled"), Json(w * h > maximum))
      if w * h <= maximum {
        assert_eq(sw, w)
        assert_eq(sh, h)
      }
    }
  }
}

///|
test "invalid sampling dimensions and budgets are rejected before allocation" {
  for
    (w, h, maximum) in [
      (0, 1, 72),
      (1, 0, 72),
      (-1, 1, 72),
      (65536, 1, 72),
      (65535, 65535, 72),
      (1, 1, 0),
      (1, 1, -1),
      (1, 1, 4194305),
    ] {
    assert_eq(field(sampling_plan(w, h, maximum), "ok"), Json(false))
    assert_eq(
      field(@json.parse(sampling_plan_json(w, h, maximum)), "ok"),
      Json(false),
    )
  }
}

///|
test "12MP sampling has expected host-compatible integer dimensions" {
  let plan = sampling_plan(4000, 3000, 4194304)
  assert_eq(field(plan, "width"), Json(2364))
  assert_eq(field(plan, "height"), Json(1773))
  assert_eq(field(plan, "downsampled"), Json(true))
  let narrow = sampling_plan(65535, 1, 16)
  assert_true(integer(field(narrow, "width")) <= 16)
  assert_eq(field(narrow, "height"), Json(1))
}
