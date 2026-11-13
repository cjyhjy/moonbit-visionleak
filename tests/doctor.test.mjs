import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,copyFile,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFile,spawnSync} from 'node:child_process';
import {promisify} from 'node:util';
import {doctor} from '../tools/doctor.mjs';
const exec=promisify(execFile);
test('doctor default checks installed runtime without optional Python',async()=>{
 const result=await doctor({python:'/missing-python'});assert.equal(result.ok,true);assert.equal(result.orbRequested,false);
 assert.deepEqual(result.checks.map(c=>c.id),['node','sharp','core']);
});
test('doctor diagnoses absent Sharp and Core from dependency-free bootstrap',async t=>{
 const root=await mkdtemp(join(tmpdir(),'vl-doctor-'));t.after(()=>rm(root,{recursive:true,force:true}));
 await mkdir(join(root,'tools'));
 for(const name of ['cli.mjs','doctor.mjs'])await copyFile(new URL('../tools/'+name,import.meta.url),join(root,'tools',name));
 let result;try {await exec(process.execPath,[join(root,'tools/cli.mjs'),'doctor']);assert.fail('expected failed diagnostics');}
 catch(error){assert.equal(error.code,1);result=JSON.parse(error.stdout);}
 assert.equal(result.ok,false);
 assert.equal(result.checks.find(c=>c.id==='sharp').status,'failed');
 assert.equal(result.checks.find(c=>c.id==='core').status,'failed');
 assert.ok(result.checks.find(c=>c.id==='sharp').fix.includes('npm ci'));
});
test('doctor gives executable environment setup for missing Python',async()=>{
 const result=await doctor({includeOrb:true,python:'/missing-python'});
 const check=result.checks.find(c=>c.id==='orb-dependencies');assert.equal(check.status,'failed');
 assert.ok(check.fix.some(command=>command.includes('requirements-orb.txt')));
});

test('public audit API remains importable from Node stdin entry point',()=>{
 const module=new URL('../tools/cli.mjs',import.meta.url).href;
 const result=spawnSync(process.execPath,['--input-type=module','-'],{input:`import {DEFAULTS,runAudit} from ${JSON.stringify(module)};console.log(JSON.stringify({images:DEFAULTS.maxImages,type:typeof runAudit}));`,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);assert.equal(JSON.parse(result.stdout).type,'function');
});
