import { EVIDENCE, DECISIONS, TRANSFORMS, orientationDescription, validateReport, validateReview, thumbnailURL, reviewDocument, filterPairs, canShowThumbnails, workbenchScope } from './review-validation.mjs';
import { verifyReportIdentity } from './report-identity.mjs';
import { reviewProgress, nextPendingPair, selectionAfterFilter, changeDecision, undoDecision } from './review-workflow.mjs';

const $ = id => document.getElementById(id);
const MAX_FILE_BYTES = 32 * 1024 * 1024;
const state = { report: null, servedAuditId: null, reviews: new Map(), selected: null, filtered: [], visibleLimit: 100, loadSequence: 0, storageOK: true, undo: null };
const formatCount = number => number.toLocaleString('zh-CN');
const storageKey = report => `visionleak:reviews:v1:${encodeURIComponent(report.auditId)}`;

function notice(message, error = false) {
  $('notice').textContent = message;
  $('notice').classList.toggle('error', error);
  $('notice').hidden = !message;
}
function filters() {
  return { query: $('search').value, evidence: $('evidence-filter').value, decision: $('decision-filter').value, split: $('split-filter').value, maxDistance: Number($('distance-filter').value), includeLowContrast:$('show-low-contrast').checked, groupId:$('group-filter').value };
}
function resetFilters() {
  $('search').value = '';
  $('evidence-filter').value = 'all';
  $('decision-filter').value = 'all';
  $('split-filter').value = 'all';
  $('group-filter').value = '';
  $('show-low-contrast').checked = false;
  $('distance-filter').value = $('distance-filter').max;
  $('distance-output').value = $('distance-filter').value;
  state.visibleLimit = 100;
}
function mergeReviews(base, incoming) {
  const merged = new Map(base);
  for (const [key, review] of incoming) {
    const previous = merged.get(key);
    if (!previous || Date.parse(review.updatedAt) >= Date.parse(previous.updatedAt)) merged.set(key, review);
  }
  return merged;
}
async function installReport(raw, source, served = false, sequence = state.loadSequence) {
  const report = validateReport(raw);
  let reviews = raw.review == null ? new Map() : validateReview(raw.review, report);
  await verifyReportIdentity(raw);
  if (sequence !== state.loadSequence) return;
  let warning = '';
  state.storageOK = true;
  try {
    const stored = localStorage.getItem(storageKey(report));
    if (stored) reviews = mergeReviews(reviews, validateReview(JSON.parse(stored), report));
  } catch (error) {
    warning = ` 本地保存记录未恢复：${error.message}`;
    state.storageOK = false;
  }
  if (served) state.servedAuditId = report.auditId;
  if (!canShowThumbnails(report, state.servedAuditId)) warning += ' 当前报告与本地服务的 auditId 不同或服务报告尚未加载，已禁用缩略图，防止误显示另一份报告的图片。请使用这份报告重新启动本地服务。';
  state.report = report;
  state.reviews = reviews;
  state.selected = null;
  state.filtered = [];
  state.undo = null;
  $('workspace').hidden = false;
  $('empty-state').hidden = true;
  $('audit-id').textContent = report.auditId;
  $('audit-id').title = report.auditId;
  $('audit-status').className = `status-pill ${report.complete ? 'complete' : 'incomplete'}`;
  $('audit-status').textContent = report.complete ? '扫描完成 · 限本次配置' : '扫描不完整';
  $('incomplete-banner').hidden = report.complete;
  $('incomplete-reason').textContent = `报告状态：${typeof raw.status === 'string' ? raw.status : '未声明'}。预算或输入限制可能使部分图像或候选未被处理；请展开「运行信息与覆盖范围」检查统计与错误。已完成的人工标记仍可独立导出。`;
  $('metric-images').textContent = formatCount(report.images.size);
  for (const [id, evidence] of [['byte', 'byte-identical'], ['pixel', 'pixel-identical'], ['candidate', 'perceptual-candidate'], ['local', 'local-candidate']]) {
    $(`metric-${id}`).textContent = formatCount(report.pairs.filter(pair => pair.evidence === evidence).length);
  }
  $('pair-count').textContent = `${formatCount(report.pairs.length)} 对`;
  const scope = workbenchScope(report,{includeLowContrast:true});
  $('low-contrast-count').textContent = `展开低对比度配对（${formatCount(scope.lowContrastPairs)}）`;
  $('group-filter').replaceChildren(new Option(`全部候选组（${scope.candidateGroups.length}）`, ''));
  for (const [index, group] of scope.candidateGroups.entries()) $('group-filter').add(new Option(`组 ${index+1} · ${group.members.length} 张图像`,group.id));
  $('coverage-summary').textContent = raw.coverage?.summary ?? '历史报告未记录逐集合覆盖统计；结论仅覆盖此报告的输入与已完成比较。';
  $('split-filter').replaceChildren(new Option('全部集合', 'all'));
  for (const split of [...new Set([...report.images.values()].map(image => image.split))].sort()) $('split-filter').add(new Option(split, split));
  let maximumDistance = 64;
  for (const pair of report.pairs) maximumDistance = Math.max(maximumDistance, pair.distance);
  $('distance-filter').max = String(maximumDistance);
  const errors = Array.isArray(raw.errors) ? raw.errors : [];
  $('error-summary').textContent = `${errors.length ? `${formatCount(errors.length)} 条错误或跳过记录` : '无错误记录'} · 统计与选项`;
  $('report-stats').textContent = JSON.stringify({ stats: raw.stats ?? null, scope: raw.scope ?? null, coverage:raw.coverage ?? null, timing: raw.timing ?? null }, null, 2);
  $('report-options').textContent = JSON.stringify({ options: raw.options ?? null, normalization: raw.normalization ?? null, decoder: raw.decoder ?? null }, null, 2);
  $('report-errors').textContent = errors.length ? JSON.stringify(errors, null, 2) : '[]';
  resetFilters();
  render();
  notice(`已加载${source}：${formatCount(report.images.size)} 张图像、${formatCount(report.pairs.length)} 对证据${reviews.size ? `，恢复 ${formatCount(reviews.size)} 条人工标记` : ''}。${warning}`, Boolean(warning));
}
function renderMetrics() {
  const { total, reviewed, pending, unsure } = reviewProgress(state.report.pairs, state.reviews);
  $('metric-reviewed').replaceChildren(document.createTextNode(`${formatCount(reviewed)} `));
  const denominator = document.createElement('em');
  denominator.textContent = `/ ${formatCount(total)}`;
  $('metric-reviewed').append(denominator);
  const percent = total ? Math.round(reviewed / total * 100) : 0;
  $('review-progress').textContent = `${percent}%`;
  $('progress-fill').style.width = `${percent}%`;
  $('review-summary').textContent = `未复核 ${formatCount(pending)} · 暂不确定 ${formatCount(unsure)}`;
}
function renderWorkflow() {
  const counts = reviewProgress(state.filtered, state.reviews);
  $('queue-progress').textContent = `当前筛选 ${formatCount(counts.total)} 对 · 未复核 ${formatCount(counts.pending)} · 暂不确定 ${formatCount(counts.unsure)}`;
  $('next-pending').disabled = !nextPendingPair(state.filtered, state.reviews, state.selected);
  $('undo-review').disabled = !state.undo;
}
function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content != null) node.textContent = content;
  return node;
}
function renderQueue() {
  const report = state.report;
  const list = $('pair-list');
  const fragment = document.createDocumentFragment();
  $('queue-total').textContent = `${formatCount(state.filtered.length)} / ${formatCount(report.pairs.length)} 项`;
  $('queue-empty').hidden = state.filtered.length > 0;
  for (const pair of state.filtered.slice(0, state.visibleLimit)) {
    const left = report.images.get(pair.left), right = report.images.get(pair.right);
    const review = state.reviews.get(pair.key);
    const evidence = EVIDENCE[pair.evidence];
    const button = element('button', `queue-item${pair.key === state.selected ? ' selected' : ''}`);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(pair.key === state.selected));
    button.setAttribute('aria-label', `${evidence.label}：${left.path} 与 ${right.path}，${review ? DECISIONS[review.decision] : '未复核'}`);
    const top = element('div', 'queue-item-top');
    top.append(element('span', `evidence-badge ${evidence.tone}`, evidence.label), element('span', 'queue-distance', `d = ${pair.distance}`));
    const bottom = element('div', 'queue-item-bottom');
    bottom.append(element('span', '', `${left.split} ↔ ${right.split}`), element('span', `queue-review${review ? '' : ' pending'}`, review ? DECISIONS[review.decision] : '○ 未复核'));
    button.append(top, element('code', 'queue-path', left.path), element('code', 'queue-path', right.path), bottom);
    button.addEventListener('click', () => selectPair(pair.key));
    fragment.append(button);
  }
  if (state.filtered.length > state.visibleLimit) {
    const more = element('button', 'button quiet', `再显示 ${Math.min(100, state.filtered.length - state.visibleLimit)} 对`);
    more.type = 'button';
    more.addEventListener('click', () => { state.visibleLimit += 100; renderQueue(); });
    fragment.append(more);
  }
  list.replaceChildren(fragment);
}
function setImage(side, imageRecord, rect) {
  const image = $(`${side}-image`), fallback = $(`${side}-fallback`);
  const matchesServer = canShowThumbnails(state.report, state.servedAuditId);
  const url = matchesServer ? thumbnailURL(imageRecord.thumbnail) : null;
  fallback.replaceChildren(document.createTextNode(matchesServer ? '缩略图不可用' : '已禁用缩略图 · 报告不匹配'), document.createElement('br'), element('small', '', '请通过对应报告的本地服务打开'));
  const overlay = $(`${side}-window`);
  overlay.hidden = true;
  if (rect) {
    overlay.style.left = `${rect[0] / 10}%`;
    overlay.style.top = `${rect[1] / 10}%`;
    overlay.style.width = `${(rect[2] - rect[0]) / 10}%`;
    overlay.style.height = `${(rect[3] - rect[1]) / 10}%`;
    overlay.setAttribute('aria-label', `命中窗口：左 ${rect[0]/10}%，上 ${rect[1]/10}%，右 ${rect[2]/10}%，下 ${rect[3]/10}%`);
  }
  image.hidden = true;
  fallback.hidden = false;
  image.onload = () => { image.hidden = false; fallback.hidden = true; overlay.hidden = !rect; };
  image.onerror = () => { image.hidden = true; fallback.hidden = false; overlay.hidden = true; };
  image.alt = `${imageRecord.split}：${imageRecord.path}`;
  if (url) image.src = url;
  else image.removeAttribute('src');
  $(`${side}-path`).textContent = imageRecord.path;
  $(`${side}-split`).textContent = imageRecord.split;
  const dimensions = Number.isFinite(imageRecord.width) && Number.isFinite(imageRecord.height) ? `${imageRecord.width} × ${imageRecord.height} px` : '尺寸未提供';
  $(`${side}-size`).textContent = `${dimensions} · ${side === 'left' ? '图像 A' : '图像 B'}`;
}
function renderDetail() {
  const pair = state.report.pairMap.get(state.selected);
  $('pair-detail').hidden = !pair;
  $('no-selection').hidden = Boolean(pair);
  if (!pair) return;
  const evidence = EVIDENCE[pair.evidence];
  const review = state.reviews.get(pair.key);
  const left = state.report.images.get(pair.left), right = state.report.images.get(pair.right);
  $('detail-evidence').className = `evidence-badge ${evidence.tone}`;
  $('detail-evidence').textContent = evidence.label;
  $('detail-decision').textContent = review ? `人工：${DECISIONS[review.decision]}` : '等待人工复核';
  $('detail-distance').textContent = pair.distance;
  $('evidence-explanation').textContent = `${evidence.description} ${['perceptual-candidate','local-candidate'].includes(pair.evidence) ? '相似度不是泄漏概率；缩放、低对比度或重复纹理都可能造成误报。' : '相同证据说明内容重合；是否影响评测，还取决于数据来源、分组方式和任务定义。'}`;
  if (pair.lowContrast) $('evidence-explanation').textContent += ' 此配对包含低对比度图像，请谨慎解释感知距离。';
  if (pair.matchLocal) $('evidence-explanation').textContent += ` 局部窗口 A=${pair.matchLocal.leftWindow} / B=${pair.matchLocal.rightWindow}；这是首个满足阈值的窗口证据，距离不是全部窗口的最小值。`;
  if (pair.matchTransform) $('evidence-explanation').textContent += ` 匹配依据：${TRANSFORMS[pair.matchTransform]}；预览图保持原方向，距离取四种方向组合的最小值。`;
  if (pair.matchOrientation) $('evidence-explanation').textContent += ` 匹配依据：${orientationDescription(pair.matchOrientation)}。预览图保持原方向；距离为已启用方向组合的最小值，旋转发生在 EXIF 校正之后。`;
  const windows = state.report.raw.localProfile?.windows;
  setImage('left', left, windows?.[pair.matchLocal?.leftWindow]);
  setImage('right', right, windows?.[pair.matchLocal?.rightWindow]);
  const index = state.filtered.findIndex(item => item.key === pair.key);
  $('pair-position').textContent = `${formatCount(index + 1)} / ${formatCount(state.filtered.length)}`;
  $('previous-pair').disabled = index <= 0;
  $('next-pair').disabled = index < 0 || index === state.filtered.length - 1;
  const fingerprints = $('fingerprint-values');
  fingerprints.replaceChildren();
  for (const [label, value] of [
    ['A · byte', left.byteDigest], ['B · byte', right.byteDigest],
    ['A · pixel', left.pixelDigest], ['B · pixel', right.pixelDigest],
    ['A · dHash', left.dhash], ['B · dHash', right.dhash],
    ...(state.report.raw.options?.includeMirrors ? [['A · mirror dHash', left.dhashMirror], ['B · mirror dHash', right.dhashMirror], ['匹配方向', pair.matchOrientation ? orientationDescription(pair.matchOrientation) : TRANSFORMS[pair.matchTransform ?? 'original']]] : []),
    ...(state.report.raw.options?.includeRotations ? [['A · 90/180/270° dHash', left.dhashRotations?.join(' / ')], ['B · 90/180/270° dHash', right.dhashRotations?.join(' / ')], ['旋转匹配方向', pair.matchOrientation ? orientationDescription(pair.matchOrientation) : '精确证据保持原方向']] : []),
    ['A · contrast', left.contrast], ['B · contrast', right.contrast],
    ['pair key', pair.key],
  ]) fingerprints.append(element('dt', '', label), element('dd', '', value == null ? '未提供' : String(value)));
  for (const button of document.querySelectorAll('[data-decision]')) button.setAttribute('aria-pressed', String(review?.decision === button.dataset.decision));
  $('review-note').value = review?.note ?? '';
  $('review-note').disabled = !review;
  $('note-count').textContent = `${review?.note.length ?? 0} / 20000`;
  renderSavedState(review);
}
function renderSavedState(review) {
  $('saved-state').textContent = review ? (state.storageOK ? '✓ 已保存在本浏览器' : '仅在内存 · 请导出') : '尚未标记';
  $('saved-state').classList.toggle('failed', !state.storageOK && Boolean(review));
}
function render() {
  if (!state.report) return;
  const previous = state.filtered;
  state.filtered = filterPairs(state.report, state.reviews, filters());
  state.selected = selectionAfterFilter(state.filtered, state.selected, previous);
  ensureSelectionVisible();
  renderMetrics();
  renderWorkflow();
  renderQueue();
  renderDetail();
}
function saveReviews() {
  try {
    localStorage.setItem(storageKey(state.report), JSON.stringify(reviewDocument(state.report, state.reviews)));
    state.storageOK = true;
  } catch {
    state.storageOK = false;
    notice('浏览器未能保存复核记录（可能禁用了存储或空间已满）。当前标记仍在内存，请及时「导出复核」留存。', true);
  }
}
function setDecision(decision) {
  if (!state.report) return;
  const change = changeDecision(state.report, state.reviews, state.selected, decision);
  if (!change) return;
  state.reviews = change.reviews;
  state.undo = change.undo;
  saveReviews();
  render();
}
function undoLastDecision() {
  if (!state.report) return;
  const undo = state.undo;
  const restored = undoDecision(state.report, state.reviews, undo);
  state.undo = null;
  if (!restored) { renderWorkflow(); return; }
  state.reviews = restored;
  state.selected = undo.key;
  saveReviews();
  render();
  if (state.storageOK) notice(`已撤销上次标记，恢复为「${undo.previous ? DECISIONS[undo.previous.decision] : '未复核'}」。`);
}
function ensureSelectionVisible() {
  const index = state.filtered.findIndex(pair => pair.key === state.selected);
  state.visibleLimit = Math.max(state.visibleLimit, Math.ceil((index + 1) / 100) * 100);
}
function selectPair(key) {
  const focusQueue = $('pair-list').contains(document.activeElement);
  state.selected = key;
  ensureSelectionVisible();
  renderQueue();
  renderDetail();
  renderWorkflow();
  const selected = $('pair-list').querySelector('.selected');
  if (focusQueue) selected?.focus({ preventScroll: true });
  selected?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
function navigatePair(step) {
  const index = state.filtered.findIndex(pair => pair.key === state.selected);
  const next = state.filtered[index + step];
  if (!next) return;
  selectPair(next.key);
}
function navigatePending() {
  const next = nextPendingPair(state.filtered, state.reviews, state.selected);
  if (next) selectPair(next.key);
}
function downloadJSON(value, filename) {
  const blob = new Blob([JSON.stringify(value, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
async function parseFile(file) {
  if (!file) return null;
  if (file.size > MAX_FILE_BYTES) throw new Error('文件超过 32 MiB 的浏览器导入上限，请缩小审计范围或使用 CLI 检查报告。');
  try { return JSON.parse(await file.text()); } catch { throw new Error('无法解析 JSON，请选择完整、有效的报告或复核文件。'); }
}
async function loadDefault() {
  const sequence = ++state.loadSequence;
  notice('正在读取本地 /report.json…');
  try {
    const response = await fetch('/report.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(response.status === 404 ? '未发现 /report.json。请先运行审计并启动对应的本地服务，或导入报告文件。' : `报告加载失败：HTTP ${response.status}。`);
    if (Number(response.headers.get('content-length')) > MAX_FILE_BYTES) throw new Error('报告超过 32 MiB 的浏览器读取上限，请缩小审计范围。');
    const raw = await response.text();
    if (raw.length > MAX_FILE_BYTES) throw new Error('报告超过浏览器读取上限。');
    if (sequence !== state.loadSequence) return;
    await installReport(JSON.parse(raw), '/report.json', true, sequence);
  } catch (error) {
    if (sequence === state.loadSequence) notice(error.message, Boolean(state.report) || !error.message.startsWith('未发现'));
  }
}
for (const id of ['report-file', 'empty-report-file']) $(id).addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  const sequence = ++state.loadSequence;
  notice('正在读取并校验报告身份…');
  try {
    const value = await parseFile(file);
    if (sequence === state.loadSequence) await installReport(value, `文件 ${file.name}`, false, sequence);
  } catch (error) { if (sequence === state.loadSequence) notice(error.message, true); }
  finally { event.target.value = ''; }
});
$('review-file').addEventListener('change', async event => {
  const file = event.target.files[0], report = state.report;
  if (!file || !report) return;
  try {
    const incoming = validateReview(await parseFile(file), report);
    if (report !== state.report) throw new Error('导入过程中报告已切换，请重新选择复核文件。');
    state.reviews = mergeReviews(state.reviews, incoming);
    state.undo = null;
    saveReviews();
    render();
    if (state.storageOK) notice(`已校验并合并 ${incoming.size} 条复核记录；同一图像对保留时间较新的结论。`);
  } catch (error) { notice(error.message, true); }
  finally { event.target.value = ''; }
});
$('export-review').addEventListener('click', () => { if (state.report) downloadJSON(reviewDocument(state.report, state.reviews), 'review.json'); });
$('export-report').addEventListener('click', () => { if (state.report) downloadJSON({ ...state.report.raw, review: reviewDocument(state.report, state.reviews) }, 'report-reviewed.json'); });
$('load-default').addEventListener('click', loadDefault);
for (const id of ['search', 'evidence-filter', 'decision-filter', 'split-filter', 'distance-filter','show-low-contrast','group-filter']) $(id).addEventListener('input', () => {
  $('distance-output').value = $('distance-filter').value;
  state.visibleLimit = 100;
  render();
});
$('reset-filters').addEventListener('click', () => { resetFilters(); render(); });
$('previous-pair').addEventListener('click', () => navigatePair(-1));
$('next-pair').addEventListener('click', () => navigatePair(1));
$('next-pending').addEventListener('click', navigatePending);
$('undo-review').addEventListener('click', undoLastDecision);
for (const button of document.querySelectorAll('[data-decision]')) button.addEventListener('click', () => setDecision(button.dataset.decision));
$('review-note').addEventListener('input', event => {
  const review = state.reviews.get(state.selected);
  if (!review) return;
  review.note = event.target.value;
  review.updatedAt = new Date().toISOString();
  state.undo = null;
  $('undo-review').disabled = true;
  $('note-count').textContent = `${review.note.length} / 20000`;
  saveReviews();
  renderSavedState(review);
});
document.addEventListener('keydown', event => {
  if (!state.report || event.defaultPrevented || event.repeat || event.isComposing || event.metaKey || event.ctrlKey || event.altKey) return;
  const active = document.activeElement;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(active?.tagName) || active?.isContentEditable) return;
  const shortcuts = { '/': () => $('search').focus(), j: () => navigatePair(1), k: () => navigatePair(-1), n: navigatePending, '1': () => setDecision('confirmed'), c: () => setDecision('confirmed'), '2': () => setDecision('rejected'), r: () => setDecision('rejected'), '3': () => setDecision('unsure'), u: () => setDecision('unsure'), z: undoLastDecision };
  const key = event.key.toLowerCase();
  if (!Object.hasOwn(shortcuts, key)) return;
  event.preventDefault();
  shortcuts[key]();
});
loadDefault();
