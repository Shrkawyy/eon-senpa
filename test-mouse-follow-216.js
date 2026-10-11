const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(__dirname+'/src/eonSenpaBots.js','utf8');
assert(!source.includes('BOT TARGET'), 'no visual marker text');
assert(!source.includes('eon-bot-world-target'), 'no visual marker DOM');
assert(!source.includes('contextmenu'), 'right click is left to game');
assert(!source.includes('data-target-box-'), 'no obsolete box controls');
const listeners = {};
const root = {URL, Date, Math, JSON, Number, console, performance, setTimeout, clearTimeout};
root.window=root;
root.document={hidden:false};
root.addEventListener=(key,fn)=>{(listeners[key] ||= []).push(fn)};
vm.runInNewContext(source, root);
const m=Object.create(root.EonSenpaBots.Manager.prototype);
const canvas={getBoundingClientRect:()=>({left:0,top:0,width:1000,height:600,right:1000,bottom:600})};
const main={isConnected:true,clientReady:true,authCompleted:true,probeUrl:'wss://eu1.senpa.io:7101',tabs:[],player:{cells:[]}};
const stage={canvas,camera:{x:2000,y:3000,zoom:0.5},border:{left:0,top:0,right:22000,bottom:22000},mouse:{worldX:2000,worldY:3000},updateMouseWorldPosition(){this.called=(this.called || 0)+1;}};
m.app={stage,gameConnection:{primary:main,current:main},settingsMenu:{isVisible:false},replayManager:{isReplay:false},lobby:{isVisible:false}};
m.followMode='mouse'; m.controls={follow:true,respawn:false,split:false,feed:false};
m.bots=[];m.typing=()=>false;
m.initializeMouseTracking();
assert.equal(listeners.pointermove.length,1);
const e=(x,y,blocked=false)=>({clientX:x,clientY:y,target: {closest:()=>blocked?'#eon-bots-panel':null}});
listeners.pointermove[0](e(600,350));
assert.equal(m.cursorPoint.x,2200);
assert.equal(m.cursorPoint.y,3100);
const saved=m.cursorPoint;
listeners.pointermove[0](e(400,400,true));
assert.strictEqual(m.cursorPoint,saved, 'cursor persists while interacting with bot panel');
listeners.pointermove[0](e(1200,350));
assert.strictEqual(m.cursorPoint,saved, 'cursor persists outside game canvas');
assert.equal(m.mouseTarget().x,2200);
// The same world cursor is used to request spectator spawn positioning and
// (once spawned) to send normal cursor movement for living helpers.
const sends=[];
const c={isConnected:true,clientReady:true,authCompleted:true,probeUrl:main.probeUrl,
 tabs:[{index:0,playerId:99,player:{cells:[{r:20}],x:0,y:0}}],tabIndex:0,clientId:99,
 sendCursorPosition(x,y){sends.push([x,y])},sendMessage(){},verificationPending:false};
const bot={index:0,client:c,primary:main,roamTargets:[],nextSplit:0,nextFeed:0,nextSpawn:[],intent:null};
m.bots=[bot];m.updateSpawn=(targetBot,spawnPoint)=>{assert.strictEqual(targetBot,bot);assert.equal(spawnPoint.x,2200);assert.equal(spawnPoint.y,3100)};
m.tick();
assert.deepEqual(sends,[[2200,3100]]);
console.log('PASS: invisible follow mouse, retained cursor, cursor sent for spawn positioning and follow, no target marker');
