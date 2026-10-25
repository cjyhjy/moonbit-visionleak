import { DECISIONS } from './review-validation.mjs';

export function reviewProgress(pairs, reviews) {
  const counts = { total: pairs.length, reviewed: 0, pending: 0, confirmed: 0, rejected: 0, unsure: 0 };
  for (const pair of pairs) {
    const decision = reviews.get(pair.key)?.decision;
    if (decision && Object.hasOwn(DECISIONS, decision)) {
      counts.reviewed += 1;
      counts[decision] += 1;
    } else counts.pending += 1;
  }
  return counts;
}

// Search within the active filters, wrap once, and never return the current pair.
export function nextPendingPair(pairs, reviews, selected) {
  const start = pairs.findIndex(pair => pair.key === selected);
  for (let offset = 1; offset <= pairs.length; offset += 1) {
    const pair = pairs[(start + offset) % pairs.length];
    if (pair.key !== selected && !reviews.has(pair.key)) return pair;
  }
  return null;
}

// A decision can remove the current pair from a filtered queue. Continue from its
// former position instead of restarting at the first remaining pair each time.
export function selectionAfterFilter(pairs, selected, previous = []) {
  const keys = new Set(pairs.map(pair => pair.key));
  if (keys.has(selected)) return selected;
  const start = previous.findIndex(pair => pair.key === selected);
  if (start >= 0) {
    for (let offset = 1; offset <= previous.length; offset += 1) {
      const pair = previous[(start + offset) % previous.length];
      if (keys.has(pair.key)) return pair.key;
    }
  }
  return pairs[0]?.key ?? null;
}

export function changeDecision(report, reviews, key, decision, updatedAt = new Date().toISOString()) {
  const pair = report.pairMap.get(key);
  const previous = reviews.get(key);
  if (!pair || !Object.hasOwn(DECISIONS, decision) || previous?.decision === decision) return null;
  const next = { pairKey: key, left: pair.left, right: pair.right, decision, note: previous?.note ?? '', updatedAt };
  const updated = new Map(reviews);
  updated.set(key, next);
  return {
    reviews: updated,
    undo: { auditId: report.auditId, key, previous: previous ? { ...previous } : null, written: { ...next } },
  };
}

export function undoDecision(report, reviews, undo) {
  if (!undo || undo.auditId !== report.auditId || !report.pairMap.has(undo.key)) return null;
  const current = reviews.get(undo.key);
  // Never overwrite an intervening note edit or imported review.
  if (!current || Object.keys(undo.written).some(key => current[key] !== undo.written[key])) return null;
  const updated = new Map(reviews);
  if (undo.previous) updated.set(undo.key, { ...undo.previous });
  else updated.delete(undo.key);
  return updated;
}
