const fs=require('fs'),vm=require('vm'),assert=require('assert');
const entries=[];
const ffaUrl='wss://eu.senpa.io:7123';
const option={dataset:{value:ffaUrl},textContent:'Free For All - EUROPE'};
const document={querySelectorAll:q=>q==='.server-option'?[option]:[],querySelector:q=>q==='.server-select-trigger .selected-text'?{textContent:'Free For All - EUROPE'}:null,getElementById:()=>null};
const sandbox={console:{info:(...args)=>entries.push(args)},document,window:null,setTimeout:()=>1,clearTimeout:()=>{},Date,Uint8Array,ArrayBuffer,URL,performance:{now:()=>0}};
sandbox.window=sandbox;
vm.runInNewContext(fs.readFileSync(__dirname+'/src/eonNativeMulti.js','utf8'),sandbox);
let toasts=[];let sent=[];
function client(){let c={app:{player:{serverUrl:ffaUrl},toasts:{show:(...args)=>toasts.push(args)},stage:{mouse:null},input:{},settingsMenu:{isVisible:false},lobby:{isVisible:false}},spectate:{enabled:false},isConnected:true,clientReady:true,authCompleted:true,tabIndex:0,close(){},cleanup(){},fullSync(){},sendMessage:x=>sent.push(new Uint8Array(x)),sendPlayerInfo(){},sendSpawn(){this.spawnCalls=(this.spawnCalls||0)+1},sendCursorPosition(){},events:{emit(){}},sendPing(){}};sandbox.EonNativeMulti.attachClient(c);Object.defineProperty(c,'isDead',{get(){return !this.player.cells.length}});return c;}
let c=client();c.initializePlayers([31]); assert.strictEqual(c.switchPlayer(),false);assert.strictEqual(c.tabs.length,1);assert(toasts.some(x=>x[0].includes('only 1 player slot')));
let d=client();d.initializePlayers([31,32]);assert.strictEqual(d.switchPlayer(),true);assert.strictEqual(d.tabIndex,1);assert.strictEqual(d.clientId,32);assert.strictEqual(d.spawnCalls,1);assert.strictEqual(d.eonMultiHistory.some(x=>x.event==='SELECT_SLOT'),true);
// Forbid inventing extra connections/slots.
assert.strictEqual(d.tabs.length,2);assert.strictEqual(c.tabs.length,1);
// Check diagnostic response exposes no credentials.
sandbox.app={gameConnection:{current:d}};const report=sandbox.EonFFAMultiDiagnostics.status();assert.strictEqual(report.serverSlots,2);assert(!JSON.stringify(report).includes('jwt'));
console.log('PASS: single-slot remains blocked; two-slot Tab switches and requests second spawn; safe diagnostics');
