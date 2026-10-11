'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const queue=[]; const nodes = new Map(); const logs=[];
const url='wss://eu.senpa.io:7123';
const document={
 querySelectorAll:q=>q==='.server-option'?[{dataset:{value:url},textContent:'Free For All'}]:[],
 querySelector:q=>q==='.server-select-trigger .selected-text'?{textContent:'Free For All'}:null,
 getElementById:id=>nodes.get(id)||null,
 createElement:tag=>({tag,style:{},children:[],remove(){nodes.delete(this.id)},append(...els){this.children.push(...els)},addEventListener(type,callback){this['on'+type]=callback},set textContent(v){this._textContent=v},get textContent(){return this._textContent}}),
 body:{append(el){nodes.set(el.id,el)}}};
let verified=false;let opened=0,closed=0;
const root={console:{info:(...a)=>logs.push(a)},document,Date,ArrayBuffer,Uint8Array,URL,performance:{now:()=>1},setTimeout(cb){queue.push(cb);return queue.length},clearTimeout(){},confirm(){return true},SenpaAccount:{snapshot:()=>({verified,signedIn:true,status:verified?'signed-in':'verifying'})}};
root.window=root;
vm.runInNewContext(fs.readFileSync(__dirname+'/src/eonNativeMulti.js','utf8'),root);
const events={listeners:{},once(type,fn){this.listeners[type]=fn},emit(type){const fn=this.listeners[type];delete this.listeners[type];fn?.()}};
const client={events,app:null,spectate:{enabled:false},isConnected:true,clientReady:true,authCompleted:true,tabIndex:0,stopAllFeeding(){},sendMessage(){},close(){closed++;this.isConnected=false;root.app.gameConnection.current=null;events.emit('disconnected')},cleanup(){},fullSync(){},sendSpawn(){},sendPlayerInfo(){},sendCursorPosition(){}};
const app={player:{serverUrl:url},gameConnection:{current:client},lobby:{initClient(v){assert.strictEqual(v,url);opened++}},toasts:{show(){}},settingsMenu:{isVisible:false},stage:{mouse:null}};
client.app=app;root.app=app;root.EonNativeMulti.attachClient(client);
client.initializePlayers([33]);assert.strictEqual(client.tabs.length,1);assert.strictEqual(nodes.has('eon-ffa-auth-reconnect'),false);
verified=true;root.EonFFAMultiDiagnostics.authChanged();assert(nodes.has('eon-ffa-auth-reconnect'));
const btn=nodes.get('eon-ffa-auth-reconnect').children[1];btn.onclick();
while(queue.length) queue.shift()();
assert.strictEqual(closed,1);assert.strictEqual(opened,1);
assert.strictEqual(root.EonFFAMultiDiagnostics.status().mainAccount.verified,true);
console.log('PASS: late verification offers manual reconnect; old socket closed before new client starts');
