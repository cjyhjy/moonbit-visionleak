// Research-only binary descriptor bucket retrieval. Not a product filter.
import {createHash} from 'node:crypto';
export function bitTables(bits,tables){
 if(![12,16,20,24].includes(bits)||![4,8].includes(tables))throw new Error('Unfrozen LSH configuration');
 return Array.from({length:tables},(_,table)=>Array.from({length:256},(_,bit)=>({bit,order:createHash('sha256').update(`vl-orb-lsh-v1:${table}:${bit}`).digest('hex')})).sort((a,b)=>a.order.localeCompare(b.order)).slice(0,bits).map(x=>x.bit));
}
export function descriptorHash(bytes,offset,positions){
 let value=0;for(const bit of positions)value=value*2+((bytes[offset+(bit>>3)]>>(bit&7))&1);return value;
}
export function rankDescriptors(images,{bits=20,tables=8,memoryMiB=512,excludedPairs=new Set()}={}){
 const positions=bitTables(bits,tables),indexes=positions.map(()=>new Map());
 const pairKey=(a,b)=>JSON.stringify([a,b].sort());
 let descriptors=0;
 for(const [i,image] of images.entries()){
  const bytes=image.descriptors;
  if(bytes.length%32)throw new Error('Invalid descriptors');
  descriptors+=bytes.length/32;if(descriptors>200000)throw new Error('Research descriptor cap exceeded (200000)');
  for(let offset=0;offset<bytes.length;offset+=32)for(let table=0;table<tables;table++){
   const hash=descriptorHash(bytes,offset,positions[table]),previous=indexes[table].get(hash);
   if(previous===undefined)indexes[table].set(hash,i);
   else if(typeof previous==='number'){if(previous!==i)indexes[table].set(hash,[previous,i]);}
   else if(previous.at(-1)!==i)previous.push(i);
  }
  if(process.memoryUsage().rss>memoryMiB*1048576)throw new Error('Research RSS guard exceeded');
 }
 const built=performance.now(),ranks=new Map();let postingVisits=0,lookups=0;
 for(const image of images){
  const votes=new Map(),bytes=image.descriptors;
  for(let offset=0;offset<bytes.length;offset+=32){
   const seen=new Set();
   for(let table=0;table<tables;table++){
    const posting=indexes[table].get(descriptorHash(bytes,offset,positions[table]));lookups++;
    if(posting===undefined)continue;
    for(const i of typeof posting==='number'?[posting]:posting){
     postingVisits++;
     if(images[i].split!==image.split&&!excludedPairs.has(pairKey(image.id,images[i].id)))seen.add(i);
    }
   }
   for(const i of seen)votes.set(i,(votes.get(i)||0)+1);
  }
  ranks.set(image.id,[...votes].map(([i,votes])=>({id:images[i].id,votes})).sort((a,b)=>b.votes-a.votes||a.id.localeCompare(b.id)));
  if(process.memoryUsage().rss>memoryMiB*1048576)throw new Error('Research RSS guard exceeded');
 }
 return {ranks,descriptors,bucketCount:indexes.reduce((n,index)=>n+index.size,0),postingVisits,lookups,builtAt:built,queriedAt:performance.now()};
}
