const fs = require('node:fs'), assert = require('node:assert/strict'), vm = require('node:vm');
const src=fs.readFileSync(__dirname+'/src/test.js','utf8');
assert(src.includes('const byId = new Map()'));
assert(src.includes('if (surviving)'));
assert(src.includes('const dualActive = !!dualVisual')); 
assert(src.includes('const dualVisual = window.EonDualFFA?.visualState?.(t, multiSession, this.settings)')); 
assert(src.includes('l = dualVisual.fill')); 
// Verify the actual death callback compiled out of the bundled game code.
const deathMatch=src.match(/client\.events\.on\("died", \(\) => \{([\s\S]*?)\n\s*\}\);/);
assert(deathMatch,'death event found');
const died=new Function('client','session','secondary', deathMatch[1]);
function situation(primaryAlive, secondaryAlive, current='primary', menu=true, auto=true){
 const player=alive=>({clientReady:true,tabs:[{player:{cells:alive?[{}]:[]}}],spectate:{enabled:false}});
 const p=player(primaryAlive),s=player(secondaryAlive),session={clients:[p,s],current:current==='primary'?p:s,setActive(x){this.current=x; this.switched=true;}};
 const ui={isVisible:false,showCalled:0,hideCalled:0,show(){this.showCalled++;},hide(){this.hideCalled++;},app:{input:{states:{}},settings:{get(k){return k==='showMenuOnDeath'?menu:auto;}}}};
 died.call(ui,current==='primary'?p:s,session,current==='secondary');
 return {ui,session,p,s};
}
let a=situation(false,true,'primary');assert.equal(a.ui.showCalled,0);assert.equal(a.session.current,a.s);
a=situation(true,false,'secondary');assert.equal(a.ui.showCalled,0);assert.equal(a.session.current,a.p);
a=situation(false,false,'secondary');assert.equal(a.ui.showCalled,1);
a=situation(false,false,'primary',false);assert.equal(a.ui.showCalled,0);assert.equal(a.p.spectate.enabled,true);
a=situation(true,false,'secondary',true,false);assert.equal(a.ui.showCalled,0);assert.equal(a.session.current,a.s); // Auto-switch off
// Ensure 2 snapshots merge with ownership precedence and preserve the virus/food types.
const start=src.indexOf('                        const replay = this.app.replayManager;');
const end=src.indexOf('                        this.cellsFrame.sort((a, b) => a.r === b.r ? a.id - b.id : a.r - b.r);',start)+'                        this.cellsFrame.sort((a, b) => a.r === b.r ? a.id - b.id : a.r - b.r);'.length;
assert(start>=0 && end>start);
const merge=new Function('client','time','delta','speed','eat','eatSpeed','spawnSpeed','sizeSpeed', 'window', src.slice(start,end));
const create=(id,type,own=false)=>({id,r:10,x:id,y:id,flags:{isFood:type==='food',isVirus:type==='virus'},clientOrigin:own?{index:0}:null,moveCell(){this.didMove=true},moveFood(){this.didMove=true}});
const enemyFromP=create(10,'cell'), enemyFromS=create(10,'cell'), playerOwn=create(20,'cell',true), playerRemote=create(20,'cell');
const virus=create(30,'virus'),food=create(40,'food'), otherEnemy=create(50,'cell');
let primary={clientReady:true,isSyncing:false,cellsToBeRendered:[enemyFromP,playerRemote],cellsToBeRemoved:[],isReplay:false};
let second={clientReady:true,isSyncing:false,cellsToBeRendered:[enemyFromS,playerOwn,virus,food,otherEnemy],cellsToBeRemoved:[],isReplay:false};
let stage={app:{gameConnection:{primary,clients:[primary,second]},replayManager:{}},cellsFrame:[],cellsFrameVirus:[],cellsFrameFood:[],cellsFrameRemoved:[]};
merge.call(stage,primary,100,16,1,true,1,1,1,{EonSenpaMotion:{time:()=>100,enabled:()=>false}});
assert.equal(stage.cellsFrame.find(c=>c.id===20),playerOwn,'own player wins dedupe');
assert.equal(stage.cellsFrame.find(c=>c.id===10),enemyFromP,'active non-owned wins tie');
assert.deepEqual(stage.cellsFrame.map(c=>c.id),[10,20,30,50]);
assert.deepEqual(stage.cellsFrameVirus.map(c=>c.id),[30]);
assert.deepEqual(stage.cellsFrameFood.map(c=>c.id),[40]);
assert.equal(food.didMove,true);
// Switch active client; the SAME full scene must remain visible, still preferring local player cells.
stage.cellsFrame.length=stage.cellsFrameVirus.length=stage.cellsFrameFood.length=0;
merge.call(stage,second,116,16,1,true,1,1,1,{EonSenpaMotion:{time:()=>116,enabled:()=>false}});
assert.deepEqual(stage.cellsFrame.map(c=>c.id),[10,20,30,50]);
assert.equal(stage.cellsFrame.find(c=>c.id===20),playerOwn);
assert.equal(stage.cellsFrame.find(c=>c.id===10),enemyFromP,'primary copy stays stable after Tab');
console.log('PASS: global death/lobby (5 cases), stable merged world over Tab, virus + food, ownership + color invariants');
