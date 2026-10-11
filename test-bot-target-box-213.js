const {strict:assert} = require('node:assert');
const vm = require('node:vm'),fs=require('node:fs');
const listeners=new Map(), appendList=[];
const window={innerWidth:800,innerHeight:600,addEventListener(type,fn){(listeners.get(type)||listeners.set(type,[]).get(type)).push(fn);}};
const document={hidden:false,activeElement:null,body:{append(n){appendList.push(n)}},createElement(){return {hidden:false,style:{},setAttribute(){},textContent:''}}};
vm.runInNewContext(fs.readFileSync(__dirname+'/src/eonSenpaBots.js','utf8'),{window,document,console,URL,performance});
const Manager=window.EonSenpaBots.Manager, m=Object.create(Manager.prototype),canvas={}, commands=[];
const main={probeUrl:'wss://eu1.senpa.io:7101',isConnected:true,clientReady:true,authCompleted:true,player:{cells:[{x:120,y:150}]}};
const client={probeUrl:'wss://eu1.senpa.io:7101',isConnected:true,clientReady:true,authCompleted:true,tabs:[{index:0,playerId:11,player:{cells:[{}],x:100,y:100}}],clientId:11,tabIndex:0,sendCursorPosition(x,y){commands.push({x,y});}};
m.app={stage:{canvas,camera:{x:1000,y:2000,zoom:.5},border:{left:0,top:0,right:22000,bottom:22000},settings:{}},settingsMenu:{isVisible:false},lobby:{isVisible:false},replayManager:{isReplay:false},gameConnection:{primary:main,current:main}};
m.followMode='box';m.boxEnabled=true;m.boxPoint=null;m.boxServer=null;m.controls={follow:true,respawn:false,split:false,feed:false};
m.bots=[{client,primary:main,roamTargets:[],nextSplit:0,nextFeed:0,intent:null,index:0}];m.panel={querySelector(){return {value:'',hidden:true}}};m.setStatus=()=>{};
m.initializeTargetBox();
function dispatch(type,evt){for(const fn of listeners.get(type)||[])fn(evt);}
function pointer(x,y){return {target:canvas,button:2,buttons:2,clientX:x,clientY:y,preventDefault(){},stopImmediatePropagation(){}};}
dispatch('mousedown',pointer(500,350));
assert.equal(Math.round(m.boxPoint.x),1200);assert.equal(Math.round(m.boxPoint.y),2100);
dispatch('mousemove',pointer(600,400));dispatch('mouseup',pointer(600,400));
assert.equal(Math.round(m.boxPoint.x),1400);assert.equal(Math.round(m.boxPoint.y),2200);
assert.equal(m.boxElement.style.left,'600px');assert.equal(m.boxElement.style.top,'400px');
m.tick();assert.equal(commands.at(-1).x,1400);assert.equal(commands.at(-1).y,2200);
m.app.stage.camera.x=1300;m.paintTargetBox();assert.equal(m.boxElement.style.left,'450px');
main.probeUrl='wss://different.senpa.io:9999';m.paintTargetBox();assert.equal(m.boxElement.hidden,true,'server change hides old target');
m.clearTargetBox();assert.equal(m.boxPoint,null);assert.equal(m.boxElement.hidden,true);
console.log('PASS: right-click target world coords, drag, camera anchoring, bot navigation, clear');
