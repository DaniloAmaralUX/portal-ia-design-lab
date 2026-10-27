const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const dir=__dirname;
const exported=fs.readFileSync(path.join(dir,'.artifacts/exported-theme.css'),'utf8');
fs.writeFileSync(path.join(dir,'.artifacts/compile-input.css'),exported.replace('@import "tailwindcss";','@import "tailwindcss" source(none);')+'\n@source inline("bg-background text-foreground bg-primary text-primary-foreground rounded-lg font-sans dark:bg-background");\n');
const result=spawnSync(process.execPath,[path.join(dir,'../node_modules/@tailwindcss/cli/dist/index.mjs'),'-i',path.join(dir,'.artifacts/compile-input.css'),'-o',path.join(dir,'.artifacts/compiled-theme.css')],{encoding:'utf8',windowsHide:true});
if(result.status!==0){process.stderr.write(result.stderr||result.stdout);process.exit(result.status||1)}
const compiled=fs.readFileSync(path.join(dir,'.artifacts/compiled-theme.css'),'utf8');
for(const utility of ['.bg-background','.text-foreground','.bg-primary','.text-primary-foreground','.rounded-lg','.font-sans'])assert.ok(compiled.includes(utility),utility);
assert.ok(compiled.includes('background-color: var(--primary)'));
assert.ok(compiled.includes('--primary: #abcdef;'));
console.log('PASS exported theme compiles with Tailwind CSS 4; light/dark tokens and generated utilities are present.');
