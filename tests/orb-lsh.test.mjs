import test from 'node:test';
import assert from 'node:assert/strict';
import {bitTables,rankDescriptors} from '../tools/orb-lsh.mjs';
test('research LSH postings agree with independent descriptor-pair bucket enumeration',()=>{
 const rows=[{id:'a',split:'train',descriptors:Buffer.alloc(96,17)},{id:'b',split:'test',descriptors:Buffer.alloc(96,17)},{id:'c',split:'validation',descriptors:Buffer.alloc(64,238)}];
 rows[1].descriptors[7]^=1;
 const config={bits:12,tables:4},positions=bitTables(12,4),actual=rankDescriptors(rows,config).ranks;
 for(const q of rows){
  const expected=[];
  for(const original of rows){
   if(q.split===original.split)continue;let votes=0;
   for(let offset=0;offset<q.descriptors.length;offset+=32){
    let found=false;
    for(let partner=0;partner<original.descriptors.length;partner+=32)for(const bits of positions){
     if(bits.every(bit=>((q.descriptors[offset+Math.floor(bit/8)]>>bit%8)&1)===((original.descriptors[partner+Math.floor(bit/8)]>>bit%8)&1)))found=true;
    }
    if(found)votes++;
   }
   if(votes)expected.push({id:original.id,votes});
  }
  expected.sort((a,b)=>b.votes-a.votes||a.id.localeCompare(b.id));assert.deepEqual(actual.get(q.id),expected);
 }
});
