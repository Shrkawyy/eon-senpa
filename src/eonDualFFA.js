(function(root){
  'use strict';
  const KEY='eon_dual_ffa_opt_in_v1', MAX_LOG=120;
  const history=[];
  let active=false, terminalFailure=false, busy=false, panel=null, app=null;
  function log(event, detail='') {
    const item={at:new Date().toISOString(),event,detail:String(detail).slice(0,180)};
    history.push(item); if(history.length>MAX_LOG) history.shift();
    console.info('[EON Dual FFA]',event,item.detail);
    refresh();
  }
  function isFFA() {
    const primary=app?.gameConnection?.primary;
    if(!primary || primary.isAuxiliary) return false;
    const selected=document.querySelector('.server-select-trigger .selected-text')?.textContent || '';
    const option=Array.from(document.querySelectorAll('.server-option'))
      .find(el => el.dataset.value===app.player.serverUrl);
    return /free\s*for\s*all|\bffa\b|nemesis/i.test(option?.textContent || selected);
  }
  function ready(c) {return !!(c?.clientReady&&c.isConnected&&c.authCompleted&&c.tabs?.length);}
  function refresh(){
    if(!panel) return;
    const secondary=app?.gameConnection?.secondary;
    const text=active?'DUAL FFA ON':'DUAL FFA OFF';
    panel.textContent=text+(secondary?(ready(secondary)?' · P2 ready':' · P2 connecting'):'');
    panel.setAttribute('aria-pressed',String(active));
    panel.title='Toggle optional FFA 2-socket Multi. Tab starts/selects Player 2. No automatic reconnects.';
    panel.style.borderColor=active?'#42d4a4':'#415363';
  }
  function setEnabled(next) {
    active=!!next;
    try{localStorage.setItem(KEY,active?'1':'0');}catch{}
    log('MODE',active?'enabled':'disabled');
    terminalFailure=false;
    if(!active) {
      const mgr=app?.gameConnection,secondary=mgr?.secondary;
      if(mgr?.primary) mgr.setActive(mgr.primary);
      secondary?.close();
    }
    refresh();
    return active;
  }
  function switchTab(a){
    if(a) app=a;
    const mgr=app?.gameConnection,primary=mgr?.primary,secondary=mgr?.secondary;
    if(!active||!isFFA()||!ready(primary)||!root.SenpaAccount?.snapshot?.().verified)return false;
    if(primary.tabs.length>1) return primary.switchPlayer();
    if(ready(secondary)) {
      const target=mgr.current===primary?secondary:primary;
      if(!mgr.setActive(target)) return false;
      log('TAB_SWITCH',target===secondary?'secondary':'primary');
      if(target.isDead) target.sendSpawn();
      return true;
    }
    if(terminalFailure) {log('BLOCKED','Secondary rejected; disable and re-enable to retry');return false;}
    if(secondary||busy) return false;
    busy=true;
    log('CONNECT_SECONDARY','Requesting a separate game connection with the SAME verified Senpa account');
    const client=app.lobby.initClient(app.player.serverUrl,{secondary:true});
    if(!client){busy=false;log('NOT_STARTED','Primary connection not ready or server changed');return false;}
    const onReady=()=>{
      busy=false;
      if(!active||!ready(client)||!isFFA()||app.gameConnection.secondary!==client)return;
      app.gameConnection.setActive(client);
      log('SECONDARY_READY','Server allocated '+client.tabs.length+' slot(s) on second socket');
      client.sendSpawn();
    };
    client.events.once('ready',onReady);
    return true;
  }
  function onDisconnected(client){
    if(!client?.isEonSecondary){
      // A live Multi without its original account socket is not a supported
      // state. Shut down ONLY the optional secondary on primary disconnect.
      if(client && app?.gameConnection?.secondary){
        log('PRIMARY_DISCONNECTED','Closing optional secondary; no automatic relogin');
        app.gameConnection.secondary.close();
      }
      return;
    }
    busy=false;
    setTimeout(()=>{
      const code=client.lastCloseCode??null;
      log('SECONDARY_DISCONNECTED','code='+(code??'unknown')+'; reason='+(client.lastCloseReason||'not supplied'));
      // Never reattempt a server-rejected second connection automatically.
      if([4101,4404,4405,4406,4403,4100,4103].includes(code)) terminalFailure=true;
    },150);
  }
  function initialize(instance){
    app=instance;
    try{active=localStorage.getItem(KEY)==='1';}catch{active=false;}
    if(panel)return;
    panel=document.createElement('button');panel.type='button';panel.id='eon-dual-ffa-toggle';
    panel.style.cssText='position:fixed;left:12px;bottom:85px;z-index:800;background:#142536;color:#eff9ff;padding:7px 11px;border:1px solid #415363;border-radius:6px;font:600 12px system-ui;cursor:pointer';
    panel.onclick=()=>setEnabled(!active);
    document.body.append(panel);
    refresh();
    log('INIT','Optional dual-socket FFA ready; server permission still required');
  }
  const api={initialize,enabled:()=>active,switchTab,onDisconnected,setEnabled,
    status:()=>({enabled:active,selectedServer:app?.player?.serverUrl||'',modeFFA:isFFA(),
      mainVerified:!!root.SenpaAccount?.snapshot?.().verified,
      clients:app?.gameConnection?.clients.map(c=>({type:c.isEonSecondary?'secondary':'primary',
         ready:ready(c),slots:c.tabs?.length||0,closeCode:c.lastCloseCode??null,
         closeReason:c.lastCloseReason||''}))||[],terminalFailure,history:history.slice()}),
    exportJSON(){const json=JSON.stringify(api.status(),null,2);const u=URL.createObjectURL(new Blob([json],{type:'application/json'}));
      const a=document.createElement('a');a.href=u;a.download='eon-dual-ffa-log.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}};
  root.EonDualFFA=api;
})(window);
