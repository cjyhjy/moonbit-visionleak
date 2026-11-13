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

export function changeDecisions(report,reviews,keys,decision,updatedAt=new Date().toISOString()) {
  if(!Array.isArray(keys)||keys.length>200||new Set(keys).size!==keys.length||keys.some(key=>!report.pairMap.has(key))||!Object.hasOwn(DECISIONS,decision))throw new Error('批量标记必须为当前报告中最多200个不同配对。');
  let next=new Map(reviews);const changes=[];
  for(const key of keys){const change=changeDecision(report,next,key,decision,updatedAt);if(change){next=change.reviews;changes.push(change.undo);}}
  return changes.length?{reviews:next,changed:changes.length,undo:{auditId:report.auditId,changes}}:null;
}
export function undoDecisions(report,reviews,undo) {
  if(!undo?.changes)return undoDecision(report,reviews,undo);
  if(undo.auditId!==report.auditId||undo.changes.length>200)return null;
  // Check every row before changing any row: intervening edits cancel the undo.
  for(const change of undo.changes)if(!undoDecision(report,reviews,change))return null;
  let restored=new Map(reviews);for(const change of undo.changes)restored=undoDecision(report,restored,change);
  return restored;
}
export function imageAnchor(image){return JSON.stringify([image.split,image.byteDigest||'id:'+image.id]);}
export function sharedImageGroups(report){
  const groups=new Map();
  for(const pair of report.pairs)for(const id of [pair.left,pair.right]){
    const image=report.images.get(id),key=imageAnchor(image);
    if(!groups.has(key))groups.set(key,{key,path:image.path,split:image.split,keys:new Set()});groups.get(key).keys.add(pair.key);
  }
  return [...groups.values()].filter(g=>g.keys.size>1).sort((a,b)=>b.keys.size-a.keys.size||a.path.localeCompare(b.path));
}
