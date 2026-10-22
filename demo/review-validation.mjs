export const REPORT_SCHEMA = 'visionleak-report-v1';
export const REVIEW_SCHEMA = 'visionleak-review-v1';
export const EVIDENCE = Object.freeze({
  'byte-identical': { label: '字节相同', short: '字节', description: '文件字节完全相同，包括编码与元数据。', tone: 'byte' },
  'pixel-identical': { label: '像素相同', short: '像素', description: '解码、规范化后的像素相同；文件编码可以不同。', tone: 'pixel' },
  'perceptual-candidate': { label: '相似候选', short: '候选', description: '感知指纹距离在阈值内，需要结合图像与来源人工判断。', tone: 'candidate' },
});
export const DECISIONS = Object.freeze({ confirmed: '确认关联', rejected: '排除关联', unsure: '暂不确定' });

function object(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} 必须是对象。`);
  return value;
}
function text(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} 必须是非空字符串。`);
  return value;
}
export function pairKey(left, right) {
  return JSON.stringify([text(left, 'left'), text(right, 'right')].sort());
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
  object(value, '报告');
  if (value.schemaVersion !== REPORT_SCHEMA) throw new Error(`不支持的报告格式，需要 ${REPORT_SCHEMA}。`);
  const auditId = text(value.auditId, 'auditId');
  if (!Array.isArray(value.images) || !Array.isArray(value.pairs)) throw new Error('报告必须包含 images 和 pairs 数组。');
  const images = new Map();
  for (const raw of value.images) {
    object(raw, '图像记录');
    const id = text(raw.id ?? raw.path, '图像 id');
    const path = text(raw.path ?? raw.id, '图像路径');
    const split = text(raw.split, '图像 split');
    if (images.has(id)) throw new Error(`图像 id 重复：${id}`);
    images.set(id, { ...raw, id, path, split });
  }
  const pairMap = new Map();
  const pairs = value.pairs.map(raw => {
    object(raw, '证据对');
    const left = text(raw.left, 'left');
    const right = text(raw.right, 'right');
    if (!images.has(left) || !images.has(right)) throw new Error('证据对引用了报告中不存在的图像。');
    if (left === right || images.get(left).split === images.get(right).split) throw new Error('证据对必须是来自不同 split 的两张图像。');
    if (!Object.hasOwn(EVIDENCE, raw.evidence)) throw new Error(`未知证据等级：${raw.evidence}`);
    const distance = raw.distance ?? (raw.evidence === 'perceptual-candidate' ? null : 0);
    if (!Number.isInteger(distance) || distance < 0 || distance > 64) throw new Error('证据距离必须是 0 到 64 的非负整数。');
    const key = pairKey(left, right);
    if (pairMap.has(key)) throw new Error('报告包含重复的证据对。');
    const pair = { ...raw, left, right, distance, key };
    pairMap.set(key, pair);
    return pair;
  });
  if (value.errors != null && !Array.isArray(value.errors)) throw new Error('报告 errors 必须是数组。');
  return { raw: value, auditId, images, pairs, pairMap, complete: value.complete === true && !['incomplete', 'error', 'failed'].includes(value.status) && !(value.errors?.length > 0) };
}

export function canShowThumbnails(report, servedAuditId) {
  return typeof servedAuditId === 'string' && report.auditId === servedAuditId;
}

export function validateReview(value, report) {
  object(value, '复核记录');
  if (value.schemaVersion !== REVIEW_SCHEMA) throw new Error(`不支持的复核格式，需要 ${REVIEW_SCHEMA}。`);
  if (value.auditId !== report.auditId) throw new Error('auditId 不匹配：复核记录属于另一份审计，未导入任何标记。');
  if (!Array.isArray(value.reviews)) throw new Error('复核记录必须包含 reviews 数组。');
  const reviews = new Map();
  for (const raw of value.reviews) {
    object(raw, '人工标记');
    const key = pairKey(raw.left, raw.right);
    if (raw.pairKey !== key || !report.pairMap.has(key)) throw new Error('证据对不匹配：复核记录包含当前报告之外或被修改的 pair key，未导入任何标记。');
    if (reviews.has(key)) throw new Error('复核记录包含重复的证据对，未导入任何标记。');
    if (!Object.hasOwn(DECISIONS, raw.decision)) throw new Error('人工标记只能是 confirmed、rejected 或 unsure。');
    if (typeof raw.note !== 'string' || raw.note.length > 20000) throw new Error('注释必须是 20,000 字符以内的文本。');
    if (typeof raw.updatedAt !== 'string' || !Number.isFinite(Date.parse(raw.updatedAt))) throw new Error('人工标记的 updatedAt 时间格式无效。');
    reviews.set(key, { pairKey: key, left: raw.left, right: raw.right, decision: raw.decision, note: raw.note, updatedAt: raw.updatedAt });
  }
  return reviews;
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
