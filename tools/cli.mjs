#!/usr/bin/env node
// Bootstrap keeps doctor usable when Sharp or the compiled Core is missing.
import {realpathSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
let direct=false;
try{direct=!!process.argv[1]&&realpathSync(process.argv[1])===fileURLToPath(import.meta.url);}catch{}
let implementation;
if(!(direct && process.argv[2]==='doctor'))implementation=await import('./audit-cli.mjs');
export const DEFAULTS=implementation?.DEFAULTS;
export async function runAudit(...args){implementation??=await import('./audit-cli.mjs');return implementation.runAudit(...args);}
export async function main(argv=process.argv.slice(2)){
 if(argv[0]==='doctor')return (await import('./doctor.mjs')).doctorMain(argv.slice(1));
 implementation??=await import('./audit-cli.mjs');return implementation.main(argv);
}
if(direct)process.exitCode=await main();
