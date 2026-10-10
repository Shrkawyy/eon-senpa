(function(root){
    'use strict';
    const E=root.EonSenpaEmotes;
    function el(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
    function button(text,click,className='emote-button'){const b=el('button',className,text);b.type='button';b.onclick=click;return b;}
    const errors={not_enought_coins:'Not enough coins',already_owned:'You already own this emoji',not_for_sale:'This emoji is not for sale',emoji_not_owned:"You don't own that emoji",emoji_slots_duplicate:'An emoji can only sit in one slot'};
    class UI{
        constructor(app){
            this.app=app;this.tab='mine';this.items=[];this.selected=null;this.pending=null;this.busy=false;this.epoch=0;this.generation=0;
            this.hud=el('div','senpa-emote-hud');this.hud.hidden=true;
            this.radial=el('div','senpa-emote-radial');this.radial.hidden=true;
            this.fab=button('☺',()=>this.toggleRadial(),'senpa-emote-fab');this.fab.title='Emojis';this.fab.setAttribute('aria-label','Open emojis');
            this.hud.append(this.radial,this.fab);document.body.append(this.hud);
            for(const type of ['mousedown','mouseup','click','keydown','keyup','contextmenu'])this.hud.addEventListener(type,e=>e.stopPropagation());
            this.hud.addEventListener('mousedown',e=>e.preventDefault());
            document.addEventListener('pointerdown',e=>{if(!this.hud.contains(e.target))this.closeRadial();});
            document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!this.radial.hidden){e.preventDefault();e.stopImmediatePropagation();this.closeRadial();}},true);
            root.SenpaAccount.subscribe(s=>{
                if(!s.signedIn||(!s.account&&this.profile)){this.epoch++;this.closeRadial();this.items=[];this.selected=this.pending=this.confirm=null;this.generation++;}
                this.profile=s.account;for(const item of E.slots(this.profile))if(item?.image_url)E.cache.get(item.image_url);
                this.updateHUD();if(this.visible())this.render();
            });
            const room=button('All',()=>{app.nativeChatRoom=app.nativeChatRoom?0:1;room.textContent=app.nativeChatRoom?'Team':'All';room.title=app.nativeChatRoom?'Team chat':'Public chat';},'senpa-chat-room');
            room.onmousedown=e=>e.preventDefault();
            room.id='senpa-chat-room';room.title='Public chat';document.getElementById('chat-input-container').prepend(room);
            this.timer=setInterval(()=>this.updateHUD(),100);
            root.addEventListener('pagehide',()=>clearInterval(this.timer));
        }
        visible(){return this.panel?.isConnected&&this.app.settingsMenu.isVisible&&document.querySelector('.tab-btn.active')?.dataset.tab==='emojis';}
        closeRadial(){this.radial.hidden=true;clearTimeout(this.radialTimer);this.fab.setAttribute('aria-expanded','false');if(this.hud.contains(document.activeElement))document.activeElement.blur();}
        toggleRadial(){
            if(!this.radial.hidden){this.closeRadial();return;}
            this.radial.replaceChildren();E.slots(this.profile).forEach((item,i)=>{
                if(!item?.image_url)return;
                const b=button('',()=>{E.sendEmoji(this.app.gameConnection.current,i);this.closeRadial();},'senpa-emote-throw');b.setAttribute('aria-label','Throw emoji '+(i+1));
                const img=el('img');img.src=E.imageURL(item.image_url);img.draggable=false;
                const key=el('span','',this.app.input.keybinds['emoji'+(i+1)]||'');b.append(img,key);this.radial.append(b);
            });
            this.radial.hidden=false;this.fab.setAttribute('aria-expanded','true');this.radialTimer=setTimeout(()=>this.closeRadial(),5000);this.updateHUD();
        }
        updateHUD(){
            const app=this.app,client=app.gameConnection.current;
            const hidden=app.lobby.isVisible||app.settingsMenu.isVisible||app.replayManager?.isReplay||!root.SenpaAccount.getToken()||!E.slots(this.profile).some(Boolean);
            this.hud.hidden=hidden;if(hidden)this.closeRadial();
            const s=client?E.state(client):{until:0,pendingUntil:0},left=Math.max(s.until,s.pendingUntil)-performance.now();
            this.fab.textContent=left>0?Math.ceil(left/1000)+'s':'☺';
            for(const b of this.radial.querySelectorAll('button'))b.disabled=left>0||!(client?.hasAlivePlayers??!client?.isDead);
            this.hud.classList.toggle('chat-open',!!app.chatBox.isVisible);
        }
        async open(panel){
            this.panel=panel;this.loading=true;this.message='';this.selected=this.pending=this.confirm=null;this.render();await this.reload();
        }
        async reload(){
            const generation=++this.generation;this.loading=true;this.message='';this.render();
            if(!root.SenpaAccount.getToken()){this.loading=false;this.render();return;}
            try{
                const data=await E.request('/emojis/');if(generation!==this.generation)return;
                if(!Array.isArray(data.results?.emojis))throw Error('Invalid emoji catalogue.');
                this.items=data.results.emojis.filter(e=>Number.isInteger(e.id)&&E.imageURL(e.image_url));this.cooldownSeconds=data.results.cooldown_seconds||0;
            }catch(error){if(generation===this.generation)this.message=errors[error.message]||error.message;}
            finally{if(generation===this.generation){this.loading=false;this.render();}}
        }
        async mutate(callback){
            if(this.busy)return;const epoch=this.epoch;this.busy=true;this.message='';this.render();
            try{await callback(epoch);}catch(error){if(epoch===this.epoch)this.message=errors[error.message]||error.message;}
            finally{this.busy=false;this.render();}
        }
        async assign(index,item,epoch=this.epoch){
            const next=E.slots(this.profile).map(e=>e&&item&&e.id===item.id?null:e);next[index]=item?{id:item.id,image_url:item.image_url}:null;
            const result=await E.request('/emojis/slots',{slots:next.map(e=>e?.id??null)});if(!result.success)throw Error('Could not save emoji slots.');
            if(epoch!==this.epoch)return;
            this.profile.emoji_slots=next;this.selected=this.pending=null;await root.SenpaAccount.loadProfile();
        }
        equip(item){
            let index=this.selected??E.slots(this.profile).findIndex(e=>!e);
            if(index<0){this.pending=item;this.render();return;}
            this.mutate(epoch=>this.assign(index,item,epoch));
        }
        chooseSlot(index){if(this.pending)this.mutate(epoch=>this.assign(index,this.pending,epoch));else{this.selected=this.selected===index?null:index;this.render();}}
        buy(){
            const item=this.confirm;if(!item)return;
            this.mutate(async epoch=>{
                const result=await E.request('/emojis/'+item.id+'/buy',{});if(!result.success)throw Error('Could not buy emoji.');if(epoch!==this.epoch)return;
                this.confirm=null;await root.SenpaAccount.loadProfile();if(epoch!==this.epoch)return;
                const empty=E.slots(this.profile).findIndex(e=>!e);if(empty>=0)await this.assign(empty,item,epoch);
                await this.reload();
            });
        }
        render(){
            if(!this.visible())return;const p=this.panel;p.replaceChildren();
            const wrap=el('section','native-emote-library');p.append(wrap);
            const head=el('div','native-emote-heading');head.append(el('h2','','Emojis'),el('span','',String(this.profile?.coins??0)+' coins'));wrap.append(head);
            const info=el('p','emote-note','Equip up to four emojis. Use their keys while alive, or the smile button during play.');wrap.append(info);
            if(!root.SenpaAccount.getToken()){wrap.append(el('p','emote-message','Sign in to your Senpa account to use emojis.'));return;}
            const strip=el('div','emote-slots');
            E.slots(this.profile).forEach((item,i)=>{
                const tile=el('div','emote-slot'+(this.selected===i?' selected':''));tile.dataset.slot=i;
                const pick=button('',()=>this.chooseSlot(i),'emote-slot-pick');pick.setAttribute('aria-label','Emoji slot '+(i+1));
                pick.append(el('span','emote-slot-key',(i+1)+' · '+(this.app.input.keybinds['emoji'+(i+1)]||'None')));
                if(item?.image_url){const img=el('img');img.src=E.imageURL(item.image_url);pick.append(img);}else pick.append(el('span','emote-plus','＋'));
                tile.append(pick);if(item){const clear=button('×',()=>this.mutate(epoch=>this.assign(i,null,epoch)),'emote-clear');clear.setAttribute('aria-label','Clear emoji slot '+(i+1));tile.append(clear);}strip.append(tile);
            });wrap.append(strip);
            if(this.pending||this.selected!==null){wrap.append(el('p','emote-message',this.pending?'Choose a slot to replace.':'Choose an emoji for slot '+(this.selected+1)+'.'),button('Cancel selection',()=>{this.selected=this.pending=null;this.render();}));}
            const tabs=el('nav','emote-tabs');for(const [id,name]of [['mine','My Emojis'],['shop','Shop']])tabs.append(button(name,()=>{this.tab=id;this.confirm=null;this.render();},'emote-button'+(this.tab===id?' active':'')));wrap.append(tabs);
            if(this.cooldownSeconds)wrap.append(el('p','emote-note','Cooldown: '+this.cooldownSeconds+' seconds'));
            if(this.message)wrap.append(el('p','emote-error',this.message),button('Retry',()=>this.reload()));
            if(this.loading)wrap.append(el('p','emote-message','Loading emojis…'));
            const grid=el('div','emote-grid');wrap.append(grid);
            for(const item of this.items.filter(e=>this.tab==='mine'?e.owned:e.for_sale)){
                const card=el('article','emote-card');card.dataset.emojiId=item.id;const img=el('img');img.src=E.imageURL(item.image_url);img.loading='lazy';img.draggable=false;img.alt=item.name||'Emoji';card.append(img);
                if(item.animated)card.append(el('span','emote-gif','GIF'));
                const index=E.slots(this.profile).findIndex(e=>e?.id===item.id);
                if(this.tab==='mine')card.append(button(index<0?'Equip':'Unequip · '+(index+1),()=>index<0?this.equip(item):this.mutate(epoch=>this.assign(index,null,epoch))));
                else if(item.owned)card.append(el('span','emote-owned','✓ Owned'));
                else card.append(button(Number(item.price)===0?'Free':item.price+' coins',()=>{this.confirm=item;this.render();},'emote-button emote-buy'));
                grid.append(card);
            }
            if(!grid.children.length&&!this.loading&&!this.message)wrap.append(el('p','emote-message',this.tab==='mine'?'No owned emojis yet. Choose an emoji from Shop.':'No emojis for sale right now.'));
            if(this.confirm){
                const item=this.confirm,confirm=el('div','emote-confirm');confirm.setAttribute('role','alertdialog');confirm.setAttribute('aria-label','Confirm emoji purchase');
                const card=el('div','emote-confirm-card'),img=el('img');img.src=E.imageURL(item.image_url);card.append(img,el('p','',Number(item.price)===0?'Get this free emoji?':'Buy this emoji for '+item.price+' coins?'));
                const yes=button('Confirm',()=>this.buy());yes.disabled=(this.profile?.coins??0)<Number(item.price);card.append(yes,button('Cancel',()=>{this.confirm=null;this.render();}));confirm.append(card);wrap.append(confirm);
            }
            if(this.busy)for(const b of wrap.querySelectorAll('button'))b.disabled=true;
        }
    }
    function renderCommands(app,panel){
        const wrap=el('section','native-command-settings');wrap.append(el('h2','','Quick commands'),el('p','emote-note','Set a message for each command. Change its key in Controls. An equipped emoji takes priority on a shared key, as in Senpa.'));
        E.commands().forEach((value,i)=>{
            const row=el('label','command-setting');row.append(el('span','','Command '+(i+1)));const input=el('input');input.type='text';input.maxLength=255;input.value=value;input.dataset.command=i+1;input.setAttribute('aria-label','Command '+(i+1)+' text');
            input.oninput=()=>{const values=E.commands();values[i]=input.value;localStorage.setItem('eon_native_commands',JSON.stringify(values));};row.append(input);wrap.append(row);
        });
        wrap.append(button('Restore default messages',()=>{localStorage.removeItem('eon_native_commands');panel.replaceChildren();renderCommands(app,panel);}));panel.append(wrap);
    }
    function initialize(app){if(!app.emotesUI)app.emotesUI=new UI(app);}
    root.EonSenpaEmotesUI={initialize,renderLibrary:(app,panel)=>app.emotesUI.open(panel),renderCommands,leave:app=>{if(app.emotesUI)app.emotesUI.generation++;}};
})(window);

