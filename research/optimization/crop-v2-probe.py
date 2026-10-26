"""Exploratory v2 rules on already-viewed photos. Never a fresh holdout claim."""
import json,itertools,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[2]
rows=[]
config={'name':'vl-local-dhash-v2-prototype','threshold':5,'minimumGridContrast':32,'minimumWitnesses':2,'scaleTolerance':0.08,'translationTolerance':0.05,'minimumCenterSeparation':0.1,'crossScale':True}
def compatible(a,b,windows):
 if a[0]==b[0] or a[1]==b[1]:return False
 def transform(hit):
  l,r=[windows[i] for i in hit]
  sx=(l[2]-l[0])/(r[2]-r[0]);sy=(l[3]-l[1])/(r[3]-r[1])
  return sx,sy,(l[0]-sx*r[0])/1000,(l[1]-sy*r[1])/1000
 x,y=transform(a),transform(b)
 if any(abs(x[i]-y[i])>config['scaleTolerance']*max(x[i],y[i]) for i in (0,1)):return False
 if any(abs(x[i]-y[i])>config['translationTolerance'] for i in (2,3)):return False
 for side in (0,1):
  p,q=windows[a[side]],windows[b[side]]
  if max(abs((p[i]+p[i+2]-q[i]-q[i+2])/2000) for i in (0,1))<config['minimumCenterSeparation']:return False
 return True
for part in ('development','holdout'):
 folder=ROOT/'reports/plan-0.5.0'/('crops-'+part)
 report=json.loads((folder/'crops-audit.json').read_text());truth=json.loads((folder/'ground-truth.json').read_text());windows=report['localProfile']['windows']
 key=lambda a,b:tuple(sorted((a,b)))
 positive={key(p['left'],p['right']) for p in truth['pairs'] if p['relation']=='near-source'}
 eligible={key(p['left'],p['right']) for p in truth['pairs'] if p['relation'] not in ('byte-identical','pixel-identical')}
 existing={key(p['left'],p['right']) for p in report['pairs'] if p['evidence']!='local-candidate'}
 predicted=set()
 for a,b in itertools.combinations(report['images'],2):
  pair=key(a['id'],b['id'])
  if a['split']==b['split'] or pair in existing:continue
  hits=[(i,j) for i,(ha,ca) in enumerate(zip(a['localHashes'],a['localContrasts'])) if ca>=32 for j,(hb,cb) in enumerate(zip(b['localHashes'],b['localContrasts'])) if cb>=32 and (int(ha,2)^int(hb,2)).bit_count()<=5]
  if any(compatible(x,y,windows) for x,y in itertools.combinations(hits,2)):predicted.add(pair)
 def score(p):
  p=p&eligible;tp=len(p&positive);fp=len(p-positive);fn=len(positive-p)
  return dict(tp=tp,fp=fp,fn=fn,precision=tp/(tp+fp) if tp+fp else None,recall=tp/(tp+fn))
 rows.append({'partition':part,'baselineLocal':score({key(p['left'],p['right']) for p in report['pairs'] if p['evidence']=='local-candidate'}),'prototypeLocal':score(predicted),'prototypeCombined':score(predicted|existing)})
result={'config':config,'scope':'Exploratory replay of already-viewed 0.5.0 photo fingerprints; both partitions are regression/exploration data. No independent new holdout; prototype is not enabled in production.','rows':rows,'decision':'Keep v1. Precision/recall tradeoff and fresh source-disjoint validation required before any v2 release.'}
(ROOT/'reports/optimization/crop-v2-probe.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(rows))
