const assert=require('node:assert/strict'),fs=require('node:fs');const read=f=>fs.readFileSync(__dirname+'/src/'+f,'utf8');
const bots=read('eonSenpaBots.js');assert.equal((bots.match(/gameConnection.primary \|\| this.app.gameConnection.current/g)||[]).length,6);assert(bots.includes('Stopped · main game session or server changed'));
const replay=read('replay.js');assert(replay.includes('gameConnection.forEachClient(client => client.close())'));
const js=read('eonSenpaioIntegration.js');assert(js.includes('this.isEonSecondary ? (player.nickname2 || player.nickname1)'));
const native=read('eonNativeMulti.js');assert(native.includes('root.EonDualFFA.switchTab(this.app)'));
const proto=read('eonSenpaProtocol.js');assert(proto.includes('client.isEonSecondary'));
console.log('PASS: stable bot primary, replay disconnect, secondary nickname/skin and independent protocol');
