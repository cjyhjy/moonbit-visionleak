import {validateReport,validateReview,reviewDocument} from './review-validation.mjs';
import {verifyReportIdentity} from './report-identity.mjs';
const canonical=value=>value===null||typeof value!=='object'?JSON.stringify(value):Array.isArray(value)?'['+value.map(canonical).join(',')+']':'{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
function imageBinding(image){
 if(!image||! /^[a-f0-9]{64}$/.test(image.byteDigest||'')||! /^[a-f0-9]{64}$/.test(image.pixelDigest||''))return null;
 const value={...image};for(const key of ['id','path','thumbnail','thumbnailDigest'])delete value[key];return value;
}
async function bindingDigest(value){
 const digest=await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical(value)));
 return Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('');
}
async function contentBindings(report){
 const images=new Map();
 for(const [id,image] of report.images){const value=imageBinding(image);if(value)images.set(id,await bindingDigest(value));}
 const context={normalization:report.raw.normalization||null};
 for(const key of ['reviewContext','goal','scientificGoal','auditGoal'])context[key]={root:report.raw[key]??null,scope:report.raw.scope?.[key]??null};
 return {images,context:await bindingDigest(context),localProfile:await bindingDigest(report.raw.localProfile??null),orbProfile:await bindingDigest(report.raw.orbProfile?{id:report.raw.orbProfile.id,profileDigest:report.raw.orbProfile.profileDigest}:null)};
}
function pairBinding(report,pair,bindings){
 const a=bindings.images.get(pair.left),b=bindings.images.get(pair.right);if(!a||!b)return null;
 const value={...pair};delete value.key;value.left=a;value.right=b;
 if(value.matchOrb){const original=bindings.images.get(value.matchOrb.original),query=bindings.images.get(value.matchOrb.query);if(!original||!query)return null;value.matchOrb={...value.matchOrb,original,query};}
 if(canonical(a)>canonical(b)){
  value.left=b;value.right=a;
  if(value.matchLocal)value.matchLocal={...value.matchLocal,leftWindow:value.matchLocal.rightWindow,rightWindow:value.matchLocal.leftWindow};
  if(value.matchTransform)value.matchTransform=({'mirror-left':'mirror-right','mirror-right':'mirror-left'})[value.matchTransform]||value.matchTransform;
  if(value.matchOrientation)value.matchOrientation=value.matchOrientation.split('/').reverse().join('/');
 }
 return canonical({context:bindings.context,localProfile:pair.matchLocal?bindings.localProfile:null,orbProfile:pair.matchOrb?bindings.orbProfile:null,pair:value});
}
export function reviewTransferDocument(report,reviews){return {schemaVersion:'visionleak-review-transfer-v1',sourceReport:report.raw,review:reviewDocument(report,reviews)};}
export async function planReviewTransfer(document,target){
 if(document?.schemaVersion!=='visionleak-review-transfer-v1')throw new Error('需要 visionleak-review-transfer-v1 迁移包。');
 const source=validateReport(document.sourceReport);await verifyReportIdentity(source.raw);await verifyReportIdentity(target.raw);
 const sourceBindings=await contentBindings(source),targetBindings=await contentBindings(target);
 const reviews=validateReview(document.review,source),targets=new Map(),sources=new Map();
 for(const pair of target.pairs){const binding=pairBinding(target,pair,targetBindings);if(binding){if(!targets.has(binding))targets.set(binding,[]);targets.get(binding).push(pair);}}
 for(const pair of source.pairs){const binding=pairBinding(source,pair,sourceBindings);if(binding)sources.set(binding,(sources.get(binding)||0)+1);}
 const proposals=[];let unmatched=0,ambiguous=0;
 for(const review of reviews.values()){
  const binding=pairBinding(source,source.pairMap.get(review.pairKey),sourceBindings),matches=targets.get(binding)||[];
  if(!binding||!matches.length){unmatched++;continue;}
  if(matches.length!==1||sources.get(binding)!==1){ambiguous++;continue;}
  const pair=matches[0];proposals.push({...review,left:pair.left,right:pair.right,pairKey:pair.key,migratedFrom:{auditId:source.auditId,pairKey:review.pairKey}});
 }
 return {auditId:target.auditId,sourceAuditId:source.auditId,proposals,unmatched,ambiguous,total:reviews.size};
}
export function applyReviewTransfer(report,reviews,plan){
 if(plan?.auditId!==report.auditId)throw new Error('迁移目标报告已改变。');
 const next=new Map(reviews),changes=[];let existing=0,remaining=0;
 for(const row of plan.proposals){
  if(!report.pairMap.has(row.pairKey))throw new Error('迁移配对不属于目标报告。');
  if(next.has(row.pairKey)){existing++;continue;}
  if(changes.length>=200){remaining++;continue;}
  const written={...row};next.set(row.pairKey,written);changes.push({auditId:report.auditId,key:row.pairKey,previous:null,written:{...written}});
 }
 validateReview(reviewDocument(report,next),report);
 return {reviews:next,remaining,applied:changes.length,existing,undo:changes.length?{auditId:report.auditId,changes}:null};
}
