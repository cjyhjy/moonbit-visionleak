import {readdirSync,readFileSync,lstatSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
export const sourceRoots=['core','tools','tests','demo','fixtures','research/photos-v1','moon.mod','package.json','package-lock.json','requirements-oracle.txt','toolchain.lock.json','.node-version','.python-version','.gitattributes','.moonignore','.github'];
export function sourceFiles(root){
  const files=[];
  function visit(relative){
    if(relative==='demo/qa'||relative.split('/').some((p,index)=>p==='__pycache__'||(p.startsWith('.')&&!(index===0&&['.github','.node-version','.python-version','.gitattributes','.moonignore'].includes(p)))))return;
    const absolute=join(root,relative),stat=lstatSync(absolute);
    if(stat.isSymbolicLink())throw new Error(`Symlink in source: ${relative}`);
    if(stat.isDirectory())for(const child of readdirSync(absolute).sort())visit(relative+'/'+child);
    else if(stat.isFile())files.push(relative);
  }
  for(const entry of sourceRoots)visit(entry);
  return files.sort();
}
export function sourceDigest(root){
  const hash=createHash('sha256');
  for(const name of sourceFiles(root)){hash.update(name);hash.update('\0');hash.update(readFileSync(join(root,name)));hash.update('\0');}
  return hash.digest('hex');
}
