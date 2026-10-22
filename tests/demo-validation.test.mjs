import test from 'node:test';
import assert from 'node:assert/strict';
import { pairKey, thumbnailURL, validateReport, validateReview, reviewDocument, filterPairs, canShowThumbnails } from '../demo/review-validation.mjs';

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
test('pair identity is direction independent and cannot collide through delimiters', () => {
  assert.equal(pairKey('a', 'b'), pairKey('b', 'a'));
  assert.notEqual(pairKey('a|b', 'c'), pairKey('a', 'b|c'));
  assert.notEqual(pairKey('a\nb', 'c'), pairKey('a', 'b\nc'));
});
test('thumbnail sources are local and cannot traverse or execute URLs', () => {
  assert.equal(thumbnailURL('thumbnails/图 A.jpg'), '/thumbnails/%E5%9B%BE%20A.jpg');
  assert.equal(thumbnailURL('/thumbnails/a.jpg'), '/thumbnails/a.jpg');
  for (const value of ['https://example.org/x', '//example.org/a', 'javascript:alert(1)', 'data:image/svg+xml,x', 'thumbnails/../a', 'thumbnails/%2e%2e/a', 'thumbnails/%2f../a', 'thumbnails/a?x', 'thumbnails/a#x', 'thumbnails/a%5cb', 'thumbnails/a%00b']) assert.equal(thumbnailURL(value), null, value);
});
test('report requires known evidence, valid references, cross-split and unique pairs', () => {
  assert.equal(validateReport(report()).pairs.length, 2);
  assert.throws(() => validateReport(report({ schemaVersion: 'old' })), /报告格式/);
  assert.throws(() => validateReport(report({ pairs: [{ left: 'train/a.jpg', right: 'missing', evidence: 'byte-identical' }] })), /不存在/);
  assert.throws(() => validateReport(report({ pairs: [{ left: 'train/a.jpg', right: 'train/a.jpg', evidence: 'byte-identical' }] })), /不同 split/);
  assert.throws(() => validateReport(report({ pairs: [report().pairs[0], report().pairs[0]] })), /重复/);
  assert.throws(() => validateReport(report({ pairs: [{ ...report().pairs[0], evidence: '__proto__' }] })), /未知证据/);
  assert.throws(() => validateReport(report({ pairs: [{ ...report().pairs[1], distance: NaN }] })), /非负整数/);
});
test('incomplete and unspecified coverage cannot become complete', () => {
  assert.equal(validateReport(report()).complete, true);
  assert.equal(validateReport(report({ complete: false })).complete, false);
  assert.equal(validateReport(report({ complete: undefined })).complete, false);
  assert.equal(validateReport(report({ status: 'incomplete' })).complete, false);
});
test('review import rejects another audit, modified or foreign pair keys, invalid decisions and duplicates', () => {
  const validated = validateReport(report());
  assert.throws(() => validateReview(document(undefined, { auditId: 'another-audit' }), validated), /auditId/);
  assert.throws(() => validateReview(document([review({ pairKey: 'modified' })]), validated), /pair key/);
  assert.throws(() => validateReview(document([review({ left: 'unknown', pairKey: pairKey('unknown', 'test/b.jpg') })]), validated), /pair key/);
  assert.throws(() => validateReview(document([review({ decision: 'deleted' })]), validated), /confirmed/);
  assert.throws(() => validateReview(document([review(), review()]), validated), /重复/);
  assert.throws(() => validateReview(document([review({ note: 4 })]), validated), /注释/);
  assert.throws(() => validateReview(document([review({ updatedAt: 'yesterday' })]), validated), /updatedAt/);
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
test('nonempty errors override a claimed complete status', () => {
  assert.equal(validateReport(report({ errors: [{ code: 'DECODE_ERROR' }] })).complete, false);
  assert.equal(validateReport(report({ errors: [] })).complete, true);
  assert.throws(() => validateReport(report({ errors: {} })), /errors/);
});
test('64-bit dHash distance must be within 0..64', () => {
  assert.equal(validateReport(report({ pairs: [{ ...report().pairs[1], distance: 64 }] })).pairs[0].distance, 64);
  for (const distance of [-1, 65, 0.5, Infinity]) assert.throws(() => validateReport(report({ pairs: [{ ...report().pairs[1], distance }] })), /0 到 64/);
});
test('an imported report cannot reuse another audit server thumbnails', () => {
  const validated = validateReport(report());
  assert.equal(canShowThumbnails(validated, 'test-audit'), true);
  assert.equal(canShowThumbnails(validated, 'other-audit'), false);
  assert.equal(canShowThumbnails(validated, null), false);
});
