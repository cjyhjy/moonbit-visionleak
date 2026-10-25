import test from 'node:test';
import assert from 'node:assert/strict';
import { pairKey, thumbnailURL, validateReport, validateReview, reviewDocument, filterPairs, canShowThumbnails } from '../demo/review-validation.mjs';
import { reviewProgress, nextPendingPair, selectionAfterFilter, changeDecision, undoDecision } from '../demo/review-workflow.mjs';

// These records exercise the JSON trust boundary; they are not an audit result.
function report(overrides = {}) {
  return { schemaVersion: 'visionleak-report-v1', auditId: 'test-audit', complete: true, status: 'complete', images: [
    { id: 'train/a.jpg', path: 'train/a.jpg', split: 'train' },
    { id: 'test/b.jpg', path: 'test/b.jpg', split: 'test' },
    { id: 'validation/c.jpg', path: 'validation/c.jpg', split: 'validation' },
  ], pairs: [
    { left: 'train/a.jpg', right: 'test/b.jpg', evidence: 'byte-identical', distance: 0 },
    { left: 'train/a.jpg', right: 'validation/c.jpg', evidence: 'perceptual-candidate', distance: 3 },
  ], ...overrides };
}
function review(overrides = {}) {
  const left = 'train/a.jpg', right = 'test/b.jpg';
  return { pairKey: pairKey(left, right), left, right, decision: 'unsure', note: '需要查证来源', updatedAt: '2026-10-22T12:00:00.000Z', ...overrides };
}
function document(reviews = [review()], overrides = {}) {
  return { schemaVersion: 'visionleak-review-v1', auditId: 'test-audit', reviews, ...overrides };
}
test('thumbnail sources are local and cannot traverse or execute URLs', () => {
  assert.equal(thumbnailURL('thumbnails/图 A.jpg'), '/thumbnails/%E5%9B%BE%20A.jpg');
  assert.equal(thumbnailURL('/thumbnails/a.jpg'), '/thumbnails/a.jpg');
  for (const value of ['https://example.org/x', '//example.org/a', 'javascript:alert(1)', 'data:image/svg+xml,x', 'thumbnails/../a', 'thumbnails/%2e%2e/a', 'thumbnails/%2f../a', 'thumbnails/a?x', 'thumbnails/a#x', 'thumbnails/a%5cb', 'thumbnails/a%00b']) assert.equal(thumbnailURL(value), null, value);
});
test('validation is atomic and review export roundtrips without modifying machine evidence', () => {
  const raw = report(), snapshot = JSON.stringify(raw), validated = validateReport(raw);
  const valid = validateReview(document(), validated);
  assert.equal(valid.size, 1);
  assert.throws(() => validateReview(document([review(), review({ left: 'bad', pairKey: pairKey('bad', 'test/b.jpg') })]), validated));
  assert.equal(valid.size, 1);
  const exported = reviewDocument(validated, valid, '2026-10-22T13:00:00.000Z');
  assert.deepEqual(validateReview(exported, validated), valid);
  assert.equal(JSON.stringify(raw), snapshot);
  assert.equal(validated.pairs[0].evidence, 'byte-identical');
});
test('filters compose evidence, human decision, path, split, and maximum distance', () => {
  const validated = validateReport(report()), reviews = validateReview(document(), validated);
  assert.equal(filterPairs(validated, reviews, { decision: 'pending' }).length, 1);
  assert.equal(filterPairs(validated, reviews, { decision: 'unsure' }).length, 1);
  assert.equal(filterPairs(validated, reviews, { evidence: 'perceptual-candidate', maxDistance: 2 }).length, 0);
  assert.equal(filterPairs(validated, reviews, { evidence: 'perceptual-candidate', maxDistance: 3, split: 'validation', query: 'C.JPG' }).length, 1);
  assert.equal(filterPairs(validated, reviews, { split: 'test', query: 'validation' }).length, 0);
});
test('an imported report cannot reuse another audit server thumbnails', () => {
  const validated = validateReport(report());
  assert.equal(canShowThumbnails(validated, 'test-audit'), true);
  assert.equal(canShowThumbnails(validated, 'other-audit'), false);
  assert.equal(canShowThumbnails(validated, null), false);
});
test('progress distinguishes unreviewed and unsure pairs inside the current scope', () => {
  const validated = validateReport(report()), reviews = validateReview(document(), validated);
  assert.deepEqual(reviewProgress(validated.pairs, reviews), { total: 2, reviewed: 1, pending: 1, confirmed: 0, rejected: 0, unsure: 1 });
  const pending = filterPairs(validated, reviews, { decision: 'pending' });
  assert.deepEqual(reviewProgress(pending, reviews), { total: 1, reviewed: 0, pending: 1, confirmed: 0, rejected: 0, unsure: 0 });
  assert.equal(reviewProgress([], reviews).reviewed, 0);
});
test('next pending navigation wraps inside the filtered queue and skips reviewed/current pairs', () => {
  const validated = validateReport(report({ pairs: [...report().pairs, { left: 'test/b.jpg', right: 'validation/c.jpg', evidence: 'pixel-identical', distance: 0 }] }));
  const [first, second, third] = validated.pairs;
  const reviews = validateReview(document(), validated);
  assert.equal(nextPendingPair(validated.pairs, reviews, first.key), second);
  assert.equal(nextPendingPair(validated.pairs, reviews, second.key), third);
  assert.equal(nextPendingPair(validated.pairs, reviews, third.key), second);
  assert.equal(nextPendingPair(validated.pairs, reviews, null), second);
  const scoped = filterPairs(validated, reviews, { evidence: 'perceptual-candidate' });
  assert.equal(nextPendingPair(scoped, reviews, null), second);
  assert.equal(nextPendingPair(scoped, reviews, second.key), null);
  assert.equal(nextPendingPair(filterPairs(validated, reviews, { decision: 'unsure' }), reviews, null), null);
  assert.equal(nextPendingPair([], reviews, null), null);
});
test('marking a filtered pair continues after its old position instead of returning to the beginning', () => {
  const validated = validateReport(report({ pairs: [...report().pairs, { left: 'test/b.jpg', right: 'validation/c.jpg', evidence: 'pixel-identical', distance: 0 }] }));
  const [first, second, third] = validated.pairs;
  const changed = changeDecision(validated, new Map(), second.key, 'confirmed');
  const pending = filterPairs(validated, changed.reviews, { decision: 'pending' });
  assert.equal(selectionAfterFilter(pending, second.key, validated.pairs), third.key);
  assert.equal(selectionAfterFilter(pending, first.key, validated.pairs), first.key);
  assert.equal(selectionAfterFilter([first], third.key, validated.pairs), first.key);
  assert.equal(selectionAfterFilter([], second.key, validated.pairs), null);
  assert.equal(selectionAfterFilter([third], 'unknown', []), third.key);
});
test('one-step undo removes a new mark and restores an earlier decision including its note', () => {
  const validated = validateReport(report()), original = validateReview(document(), validated);
  const first = validated.pairs[0], second = validated.pairs[1];
  const updated = changeDecision(validated, original, first.key, 'confirmed', '2026-10-22T13:00:00.000Z');
  assert.equal(original.get(first.key).decision, 'unsure');
  assert.equal(updated.reviews.get(first.key).note, original.get(first.key).note);
  assert.deepEqual(undoDecision(validated, updated.reviews, updated.undo), original);
  const marked = changeDecision(validated, original, second.key, 'rejected', '2026-10-22T14:00:00.000Z');
  const restored = undoDecision(validated, marked.reviews, marked.undo);
  assert.deepEqual(restored, original);
  assert.deepEqual(validateReview(reviewDocument(validated, restored), validated), original);
  assert.equal(changeDecision(validated, original, first.key, 'unsure'), null);
});
test('undo cannot erase later notes, imported changes, another audit, or unrelated pair reviews', () => {
  const validated = validateReport(report()), original = validateReview(document(), validated);
  const key = validated.pairs[0].key;
  const updated = changeDecision(validated, original, key, 'confirmed', '2026-10-22T13:00:00.000Z');
  const withNote = new Map(updated.reviews);
  withNote.set(key, { ...withNote.get(key), note: 'New evidence entered after the decision.' });
  assert.equal(undoDecision(validated, withNote, updated.undo), null);
  const imported = new Map(updated.reviews);
  imported.set(key, { ...imported.get(key), decision: 'rejected' });
  assert.equal(undoDecision(validated, imported, updated.undo), null);
  assert.equal(undoDecision(validateReport(report({ auditId: 'another-audit' })), updated.reviews, updated.undo), null);
  const other = changeDecision(validated, updated.reviews, validated.pairs[1].key, 'rejected', '2026-10-22T14:00:00.000Z');
  const restored = undoDecision(validated, other.reviews, updated.undo);
  assert.deepEqual(restored.get(validated.pairs[1].key), other.reviews.get(validated.pairs[1].key));
  assert.deepEqual(restored.get(key), original.get(key));
});
