// Private bounded JSONL interface. Receives descriptors and integer metadata,
// never filesystem paths, source pixels, credentials or executable commands.
import {CompactOrbIndex} from './orb-compact-index.mjs';
let buffer='',index;
const reply=value=>process.stdout.write(JSON.stringify({ok:true,...value})+'\n');
process.stdin.setEncoding('utf8');
process.stdin.on('data',chunk=>{
 try {
  buffer+=chunk;if(Buffer.byteLength(buffer)>8*1024*1024)throw new Error('Frame limit');
  let at;
  while((at=buffer.indexOf('\n'))>=0){
   const line=buffer.slice(0,at);buffer=buffer.slice(at+1);const req=JSON.parse(line);
   if(req.op==='init'&&!index){index=new CompactOrbIndex(req.configuration);reply({initialized:true});continue;}
   if(!index)throw new Error('Missing index');
   if(req.op==='finish'){reply(index.finish());continue;}
   if(!['add','query'].includes(req.op)||typeof req.descriptors!=='string'||req.descriptors.length>35000)throw new Error('Invalid operation');
   const bytes=Buffer.from(req.descriptors,'base64');if(bytes.toString('base64')!==req.descriptors)throw new Error('Invalid descriptors');
   if(req.op==='add'){index.add(req.index,bytes);reply({added:true});}
   else reply(index.query(req.index,bytes));
  }
 }catch{process.stdout.write(JSON.stringify({ok:false,message:'Index worker rejected input'})+'\n');process.exitCode=1;process.stdin.destroy();}
});
