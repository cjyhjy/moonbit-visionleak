import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {openOrbCache} from '../tools/orb-cache.mjs';
test('ORB cache binds configuration and rejects damaged entries',async t=>{
 const root=await mkdtemp(join(tmpdir(),'vl-orb-cache-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const a=await openOrbCache(root,{profile:'a'}),b=await openOrbCache(root,{profile:'b'});
 t.after(()=>Promise.all([a.close(),b.close()]));
 const key=a.key('feature','pixels');assert.notEqual(key,b.key('feature','pixels'));
 await a.put(key,{hit:false});assert.deepEqual(await a.get(key),{hit:false});
 await writeFile(join(root,'orb-v3',key.slice(0,2),key+'.json'),'{}');assert.equal(await a.get(key),null);
});

test('ORB cache enforces disk quota without discarding completed work',async t=>{
 const root=await mkdtemp(join(tmpdir(),'vl-orb-quota-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const cache=await openOrbCache(root,{}, {shardBytes:240});
 t.after(()=>cache.close());
 const key='a'.repeat(64);await cache.put(key,{hit:false});
 await assert.rejects(cache.put('aa'+'b'.repeat(62),{payload:'x'.repeat(100)}),e=>e.code==='ORB_CACHE_BUDGET');
 assert.deepEqual(await cache.get(key),{hit:false});
});

test('OS cache lock releases after a writer dies and serializes competing processes',async t=>{
 const {spawn}=await import('node:child_process');const {once}=await import('node:events');
 const {CacheLocks}=await import('../tools/orb-cache-lock.mjs');
 const root=await mkdtemp(join(tmpdir(),'vl-orb-killed-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const cache=await openOrbCache(root,{});t.after(()=>cache.close());
 const key='f'.repeat(64);await cache.put(key,{hit:false});
 const module=new URL('../tools/orb-cache-lock.mjs',import.meta.url).href;
 const program=`import {CacheLocks} from ${JSON.stringify(module)};const locks=new CacheLocks(${JSON.stringify(join(root,'orb-v3'))});await locks.withLock('ff',async()=>{process.stdout.write('ready');await new Promise(()=>{});});`;
 const child=spawn(process.execPath,['--input-type=module','-e',program],{stdio:['ignore','pipe','pipe']});
 t.after(()=>child.kill('SIGKILL'));const closed=once(child,'close');
 await Promise.race([once(child.stdout,'data'),closed.then(()=>{throw new Error('Writer exited before lock');})]);
 const contender=new CacheLocks(join(root,'orb-v3'));t.after(()=>contender.close());
 await assert.rejects(contender.withLock('ff',async()=>assert.fail('Concurrent writer entered')),e=>e.code==='ORB_CACHE_BUSY');
 child.kill('SIGKILL');await closed;
 await cache.put('ff'+'e'.repeat(62),{hit:true});
 assert.deepEqual(await cache.get(key),{hit:false});
 assert.deepEqual(await cache.get('ff'+'e'.repeat(62)),{hit:true});
});

test('independent OS lock brokers cannot overcommit a shared cache shard',async t=>{
 const root=await mkdtemp(join(tmpdir(),'vl-orb-concurrent-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const a=await openOrbCache(root,{}, {shardBytes:400}),b=await openOrbCache(root,{}, {shardBytes:400});
 t.after(()=>Promise.all([a.close(),b.close()]));
 const results=await Promise.allSettled([a.put('cc'+'a'.repeat(62),{payload:'x'.repeat(40)}),b.put('cc'+'b'.repeat(62),{payload:'x'.repeat(40)})]);
 assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
 assert.equal(results.find(r=>r.status==='rejected').reason.code,'ORB_CACHE_BUDGET');
});
