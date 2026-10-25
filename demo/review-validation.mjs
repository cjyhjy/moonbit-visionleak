import { review_validation_json } from '../dist/visionleak.js';
export const REPORT_SCHEMA = 'visionleak-report-v1';
export const REVIEW_SCHEMA = 'visionleak-review-v1';
export const EVIDENCE = Object.freeze({
  'byte-identical': { label: '字节相同', short: '字节', description: '文件字节完全相同，包括编码与元数据。', tone: 'byte' },
  'pixel-identical': { label: '像素相同', short: '像素', description: '解码、规范化后的像素相同；文件编码可以不同。', tone: 'pixel' },
  'perceptual-candidate': { label: '相似候选', short: '候选', description: '感知指纹距离在阈值内，需要结合图像与来源人工判断。', tone: 'candidate' },
});
export const TRANSFORMS = Object.freeze({original:'原图对比', 'mirror-left':'图像 A 水平镜像后对比', 'mirror-right':'图像 B 水平镜像后对比', 'mirror-both':'两图分别水平镜像后对比'});
export const DECISIONS = Object.freeze({ confirmed: '确认关联', rejected: '排除关联', unsure: '暂不确定' });
export const ORIENTATIONS = Object.freeze({original:'原方向',mirror:'水平镜像',rotate90:'顺时针旋转 90°',rotate180:'旋转 180°',rotate270:'顺时针旋转 270°','rotate90-mirror':'顺时针旋转 90° 后水平镜像','rotate180-mirror':'旋转 180° 后水平镜像','rotate270-mirror':'顺时针旋转 270° 后水平镜像'});
export function orientationDescription(value) {
  return value.split('/').map((v,i)=>`图像 ${i===0?'A':'B'}：${ORIENTATIONS[v]}`).join('；');
}

function validateCore(request) {
  const result = JSON.parse(review_validation_json(JSON.stringify(request)));
  if (!result.ok) throw new Error(result.error.message);
  return result;
}
export function pairKey(left, right) {
  return validateCore({ operation: 'pairKey', left, right }).key;
}

// No executable/remote URLs: a report may only refer to local thumbnail files.
export function thumbnailURL(value) {
  if (typeof value !== 'string') return null;
  const path = value.replace(/^\//, '');
  if (!path.startsWith('thumbnails/') || /[\\?#\u0000-\u001f]/u.test(path)) return null;
  let decoded;
  try { decoded = decodeURIComponent(path); } catch { return null; }
  if (decoded.split('/').some(part => !part || part === '.' || part === '..') || /[\\?#\u0000-\u001f]/u.test(decoded)) return null;
  return '/' + path.split('/').map(part => encodeURIComponent(decodeURIComponent(part))).join('/');
}

export function validateReport(value) {
  const result = validateCore({ operation: 'report', report: value });
  const images = new Map(result.images.map(image => [image.id, image]));
  const pairs = result.pairs;
  return { raw: value, auditId: result.auditId, images, pairs,
    pairMap: new Map(pairs.map(pair => [pair.key, pair])), complete: result.complete };
}

export function canShowThumbnails(report, servedAuditId) {
  return typeof servedAuditId === 'string' && report.auditId === servedAuditId;
}

export function validateReview(value, report) {
  // Date.parse is the host calendar adapter, preserving the existing accepted
  // date syntax. The core checks timestamps and all audit/pair/decision rules.
  const dates = Array.isArray(value?.reviews) ? value.reviews.map(row =>
    typeof row?.updatedAt === 'string' ? Date.parse(row.updatedAt) : null) : [];
  const result = validateCore({ operation: 'review', value, report: report.raw, dates });
  return new Map(result.reviews.map(review => [review.pairKey, review]));
}

export function reviewDocument(report, reviews, now = new Date().toISOString()) {
  return { schemaVersion: REVIEW_SCHEMA, auditId: report.auditId, exportedAt: now, reviews: [...reviews.values()].map(review => ({ ...review })) };
}

export function filterPairs(report, reviews, filters = {}) {
  const query = (filters.query ?? '').trim().toLocaleLowerCase();
  return report.pairs.filter(pair => {
    const left = report.images.get(pair.left);
    const right = report.images.get(pair.right);
    const decision = reviews.get(pair.key)?.decision ?? 'pending';
    return (!filters.evidence || filters.evidence === 'all' || pair.evidence === filters.evidence)
      && (!filters.decision || filters.decision === 'all' || decision === filters.decision)
      && (!filters.split || filters.split === 'all' || left.split === filters.split || right.split === filters.split)
      && (filters.maxDistance == null || pair.distance <= filters.maxDistance)
      && (!query || `${left.path}\n${left.split}\n${right.path}\n${right.split}`.toLocaleLowerCase().includes(query));
  });
}
