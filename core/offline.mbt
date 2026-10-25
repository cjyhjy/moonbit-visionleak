///|
fn workflow_offline(request : Json) -> Json {
  let maximum = integer(field(request, "maxBytes"))
  let header = integer(field(request, "headerBytes"))
  if maximum < 4096 || maximum > 67108864 || header < 0 || header > maximum {
    return error_json(
      "EXPORT_SIZE_LIMIT", "Offline export metadata exceeds the byte limit",
    )
  }
  let rows = workflow_rows(request, "rows")
  let selected : Array[Int32] = []
  let mut used = header
  for i, row in rows {
    let size = integer(field(row, "bytes"))
    if size < 0 {
      return error_json("ARGUMENT_ERROR", "Invalid offline row size")
    }
    if size <= maximum - used {
      selected.push(i)
      used = used + size
    }
  }
  {
    "ok": true,
    "selected": Json(selected),
    "estimatedBytes": Json(used),
    "truncated": Json(selected.length() != rows.length()),
    "includedPairs": Json(selected.length()),
    "omittedPairs": Json(rows.length() - selected.length()),
  }
}

///|
fn workflow_offline_metadata(report : Json, maximum : Int32) -> Json {
  if maximum < 4096 || maximum > 67108864 {
    return error_json("ARGUMENT_ERROR", "Offline limit must be 4096..67108864")
  }
  // Reserve at least half the file for the shell, evidence and media. When
  // the source JSON itself is too large, identify the embedded report as a
  // partial snapshot, never as an intact report carrying the source auditId.
  let encoded_size = (@utf8.encode(report.stringify()).length() + 2) / 3 * 4
  let truncated = encoded_size > maximum / 2
  let embedded : Json = if truncated {
    {
      "schemaVersion": "visionleak-report-snapshot-v1",
      "sourceAuditId": field(report, "auditId"),
      "originalComplete": field(report, "complete"),
      "complete": false,
      "images": [],
      "pairs": [],
      "notice": "报告 JSON 超出内嵌预算，已裁剪；已包含配对的完整证据与复核记录在 evidence 中。",
    }
  } else {
    report
  }
  {
    "ok": true,
    "metadata": {
      "schemaVersion": "visionleak-offline-v1",
      "auditId": field(report, "auditId"),
      "complete": field(report, "complete"),
      "totalImages": Json(workflow_rows(report, "images").length()),
      "totalPairs": Json(workflow_rows(report, "pairs").length()),
      "reportTruncated": Json(truncated),
      "report": embedded,
    },
  }
}
