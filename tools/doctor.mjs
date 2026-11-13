import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const exec=promisify(execFile);
const quote=value=>"'"+value.replaceAll("'","'\\''")+"'";
export async function doctor({includeOrb=false,python=process.env.VISIONLEAK_ORB_PYTHON||'python3'}={}){
 const checks=[];
 const add=(id,ok,detail,fix=[])=>checks.push({id,status:ok?'passed':'failed',detail,...(!ok?{fix}: {})});
 add('node',Number(process.versions.node.split('.')[0])>=22,process.version,['Install Node.js >=22, then run: npm ci']);
 try {
  const sharp=(await import('sharp')).default;
  const bytes=await sharp({create:{width:8,height:8,channels:3,background:'#8090a0'}}).png().toBuffer();
  const decoded=await sharp(bytes).raw().toBuffer();
  add('sharp',decoded.length===192,sharp.versions,['npm ci']);
 }catch(error){add('sharp',false,error.code||error.message,['npm ci']);}
 try {
  const core=await import('../dist/visionleak.js');
  const r=JSON.parse(core.cli_options_json(JSON.stringify({operation:'defaults'})));
  add('core',r.ok===true,'Compiled Core defaults probe',['npm run build']);
 }catch(error){add('core',false,error.code||error.message,['python3 tools/bootstrap.py','npm run build']);}
 if(includeOrb){
  const profile=JSON.parse(await readFile(new URL('./orb-profile.json',import.meta.url)));
  try {
   const {stdout}=await exec(python,['-I','-c',"import json,sys,cv2,numpy; from importlib.metadata import version; cv2.setNumThreads(1); cv2.ORB_create().detectAndCompute(numpy.zeros((32,32),dtype=numpy.uint8),None); print(json.dumps({'python':sys.version.split()[0],'opencv':cv2.__version__,'numpy':numpy.__version__,'wheel':version('opencv-python-headless')}))"],{timeout:15000,maxBuffer:8192});
   const versions=JSON.parse(stdout);
   add('orb-dependencies',versions.opencv===profile.opencv&&versions.numpy===profile.numpy&&versions.wheel===profile.opencvWheel,versions,[`${quote(python)} -m pip install -r requirements-orb.txt`]);
  }catch(error){add('orb-dependencies',false,error.code||'Python/OpenCV probe failed',['python3.13 -m venv .venv-orb','.venv-orb/bin/python -m pip install -r requirements-orb.txt','export VISIONLEAK_ORB_PYTHON="$PWD/.venv-orb/bin/python"']);}
  if(checks.find(c=>c.id==='orb-dependencies').status==='passed'&&checks.find(c=>c.id==='core').status==='passed'){
   let worker;
   try {
    const {OrbWorker}=await import('./orb.mjs');worker=new OrbWorker({python,timeoutMs:15000});
    await worker.request({op:'hello'});
    // Allow at least one real RSS supervision probe, including import-fast warm launches.
    await new Promise(resolve=>setTimeout(resolve,200));
    if(worker.failure)throw worker.failure;
    add('orb-supervision',worker.peakRssBytes>0,{sampledWorkerRssBytes:worker.peakRssBytes},['Run in an environment permitting /bin/ps -o rss= -p PID']);
   }catch(error){add('orb-supervision',false,error.code||error.message,['Run in an environment permitting /bin/ps -o rss= -p PID']);}
   finally{await worker?.close();}
   let locks,temporary;
   try {
    temporary=await mkdtemp(join(tmpdir(),'visionleak-doctor-lock-'));
    const {CacheLocks}=await import('./orb-cache-lock.mjs');locks=new CacheLocks(temporary,python);
    await locks.withLock('00',async()=>{});
    add('orb-cache-lock',true,'OS advisory lock broker acquired and released a temporary lock');
   }catch(error){add('orb-cache-lock',false,error.code||error.message,['Use a macOS/Linux Python environment supporting fcntl.flock']);}
   finally{await locks?.close();if(temporary)await rm(temporary,{recursive:true,force:true});}
  }
 }
 return {schemaVersion:'visionleak-doctor-v1',ok:checks.every(c=>c.status==='passed'),environment:{platform:process.platform,arch:process.arch},orbRequested:includeOrb,checks};
}
export async function doctorMain(argv){
 if(argv.length>1 || (argv.length===1 && argv[0]!=='--include-orb')){
  process.stderr.write('Usage: node tools/cli.mjs doctor [--include-orb]\n');return 1;
 }
 const result=await doctor({includeOrb:argv.includes('--include-orb')});
 process.stdout.write(JSON.stringify(result)+'\n');return result.ok?0:1;
}
