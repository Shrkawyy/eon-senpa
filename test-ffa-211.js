const fs=require('fs'),assert=require('node:assert/strict');const src=n=>fs.readFileSync(__dirname+'/src/'+n,'utf8');
assert.match(src('eonSenpaProtocol.js'),/this\.eonSecondaryTid = randomId\(\)/);
assert.match(src('eonDualFFA.js'),/getItem\(KEY\)!=='0'/);
assert.match(src('eonNativeMulti.js'),/badge\(2,/);
console.log('Source checks passed');
