import {bitTables,descriptorHash} from './orb-lsh.mjs';
const SHIFT=16384n,MASK=16383n;
const integer=(n,max)=>Number.isSafeInteger(n)&&n>=0&&n<=max;
export class CompactOrbIndex {
 constructor({descriptors,images,excludedPairs=[],maxVisits,queryStart=0}){
  if(!integer(descriptors,8000000)||!Array.isArray(images)||images.length>10000||!integer(maxVisits,1000000000)||!integer(queryStart,images.length)||images.some(r=>!Array.isArray(r)||r.length!==2||!integer(r[0],2)||!integer(r[1],images.length-1))||excludedPairs.some(n=>!integer(n,268435455)))throw new Error('Invalid bounded index configuration');
  this.images=images;this.tables=bitTables(24,4);this.buffers=this.tables.map(()=>new BigUint64Array(descriptors));this.lengths=this.tables.map(()=>0);
  this.capacity=descriptors;this.offset=0;this.nextAdd=0;this.nextQuery=queryStart;this.ready=false;this.visits=0;this.maxVisits=maxVisits;this.excluded=new Set(excludedPairs);
  this.seen=new Uint32Array(images.length);this.votes=new Uint16Array(images.length);this.generation=0;
 }
 add(index,bytes){
  if(this.ready||index!==this.nextAdd||index>=this.images.length||!(bytes instanceof Uint8Array)||bytes.length%32||bytes.length>25600||this.offset+bytes.length/32>this.capacity)throw new Error('Invalid feature input');
  for(let offset=0;offset<bytes.length;offset+=32){
   for(let table=0;table<4;table++)this.buffers[table][this.offset]=BigInt(descriptorHash(bytes,offset,this.tables[table]))*SHIFT+BigInt(index);
   this.offset++;
  }
  this.nextAdd++;
 }
 finish(){
  if(this.nextAdd!==this.images.length||this.offset!==this.capacity||this.ready)throw new Error('Incomplete index');
  for(let table=0;table<4;table++){
   const buffer=this.buffers[table];buffer.sort();let write=0;
   for(let read=0;read<buffer.length;read++)if(read===0||buffer[read]!==buffer[read-1])buffer[write++]=buffer[read];
   this.lengths[table]=write;
  }
  this.ready=true;
  return {entries:this.lengths.reduce((n,v)=>n+v,0),allocatedBytes:this.capacity*32};
 }
 query(index,bytes){
  if(!this.ready||index!==this.nextQuery||index>=this.images.length||!(bytes instanceof Uint8Array)||bytes.length%32||bytes.length>25600)throw new Error('Invalid index query');
  this.votes.fill(0);
  for(let offset=0;offset<bytes.length;offset+=32){
   this.generation++;
   for(let table=0;table<4;table++){
    const target=BigInt(descriptorHash(bytes,offset,this.tables[table]))*SHIFT,end=target+SHIFT,buffer=this.buffers[table],length=this.lengths[table];
    let low=0,high=length;
    while(low<high){const mid=Math.floor((low+high)/2);if(buffer[mid]<target)low=mid+1;else high=mid;}
    for(let at=low;at<length&&buffer[at]<end;at++){
     if(this.visits>=this.maxVisits)return {complete:false,reason:'ORB_INDEX_VISIT_BUDGET',visits:this.visits};
     this.visits++;
     const partner=Number(buffer[at]&MASK);
     if(this.images[partner][0]===this.images[index][0]||this.seen[partner]===this.generation||this.excluded.has(Math.max(index,partner)*16384+Math.min(index,partner)))continue;
     this.seen[partner]=this.generation;this.votes[partner]++;
    }
   }
  }
  let chosen=-1,best=0;
  for(let partner=0;partner<this.images.length;partner++)if(this.votes[partner]>best||(best>0&&this.votes[partner]===best&&this.images[partner][1]<this.images[chosen][1])){best=this.votes[partner];chosen=partner;}
  this.nextQuery++;return {complete:true,chosen,votes:best,visits:this.visits};
 }
}
