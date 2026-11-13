import test from 'node:test';
import assert from 'node:assert/strict';
import {CompactOrbIndex} from '../tools/orb-compact-index.mjs';
import {rankDescriptors} from '../tools/orb-lsh.mjs';
const key=(a,b)=>JSON.stringify([a,b].sort());
test('packed index selections match frozen Map-posting research semantics, ties and exclusions',()=>{
 const images=[{id:'z',split:'train',descriptors:Buffer.alloc(96,17)},{id:'b',split:'test',descriptors:Buffer.alloc(64,17)},{id:'a',split:'validation',descriptors:Buffer.alloc(96,17)},{id:'other',split:'train',descriptors:Buffer.alloc(64,238)}];
 images[1].descriptors[0]^=1;
 const excluded=new Set([key('z','b')]),ranks=new Map([...images].sort((a,b)=>a.id.localeCompare(b.id)).map((i,r)=>[i.id,r]));
 const splits=new Map([...new Set(images.map(i=>i.split))].map((s,i)=>[s,i]));
 const compact=new CompactOrbIndex({descriptors:images.reduce((n,i)=>n+i.descriptors.length/32,0),images:images.map(i=>[splits.get(i.split),ranks.get(i.id)]),excludedPairs:[16384],maxVisits:1000000});
 images.forEach((i,index)=>compact.add(index,i.descriptors));const built=compact.finish();assert.ok(built.entries<40);
 const reference=rankDescriptors(images,{bits:24,tables:4,excludedPairs:excluded});
 for(const [index,image] of images.entries()){
  const actual=compact.query(index,image.descriptors),expected=reference.ranks.get(image.id)[0];
  assert.equal(actual.complete,true);assert.equal(actual.chosen<0?null:images[actual.chosen].id,expected?.id||null);assert.equal(actual.votes,expected?.votes||0);
 }
 assert.equal(compact.visits,reference.postingVisits);
});
test('packed index rejects incomplete input and stops before spending beyond posting budget',()=>{
 const configuration={descriptors:1,images:[[0,0]],maxVisits:0};
 const index=new CompactOrbIndex(configuration);assert.throws(()=>index.finish());index.add(0,Buffer.alloc(32));index.finish();
 assert.deepEqual(index.query(0,Buffer.alloc(32)),{complete:false,reason:'ORB_INDEX_VISIT_BUDGET',visits:0});
 assert.throws(()=>new CompactOrbIndex({...configuration,descriptors:8000001}));
});
