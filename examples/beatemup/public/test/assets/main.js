function generalCombo(i,e,t,n,o,s,c,a){if(n.comboing&&0!=t)return void(void 0==n.next&&(n.next=function(){generalCombo(i,e,t,n,o,s,c)}));n.removeChilds();var m=void 0;s&&((m=objects[addPrefab("Antimonster.prefab",{position:{x:s.x,y:s.y,width:s.width,height:s.height,parent:"main"}})[0]]).Physics.onCollision={enemy:function(i){i.life&&i.life.remaining>0&&i.life.invulnerable<=0&&(a?i.life.decreaseBy(m.name.value)&&a(i):i.life.decreaseBy(m.name.value))}}),i(),n.comboing=!0,void 0==o&&(o=1e3),n.combo=t+1;var h=n.combo;c?mainanim("a"+n.combo,!0):mainanim("a"+n.combo,function(){n.comboing=!1,e(),n.next&&(n.next(),n.next=void 0)}),setTimeout(function(){n.combo==h&&(n.combo=0,n.gameObject.Physics.vx=0,mainanim("idle",!0),n.gameObject.position.rotation=0,n.comboing=!1,n.next=void 0)},o)}gm.main=function(){this.currentE=new Array,this.combo=0,this.notgrounded=0,this.prea="",this.stunned=!1},gm.main.prototype.create=function(){this.gameObject.Physics.onCollision.NewLife=function(i,e){i.remove(),e.life.remaining+=2,e.life.remaining>8&&(e.life.remaining=8)}},gm.main.prototype.removeChilds=function(){if(childrenGameObject.main&&childrenGameObject.main.length>0)for(var i=0;i<childrenGameObject.main.length;i++)try{objects[childrenGameObject.main[i]].remove()}catch(i){}},gm.main.prototype.update=function(i){if(this.gameObject.position.x<objects.Director.Director.minVisibleX?this.gameObject.position.x=objects.Director.Director.minVisibleX:this.gameObject.position.x>objects.Director.Director.maxVisibleX&&(this.gameObject.position.x=objects.Director.Director.maxVisibleX),this.gameObject.position.y-16<objects.Director.Director.minVisibleY&&this.gameObject.Physics.vy<0&&(this.gameObject.Physics.vy=0),0!=this.gameObject.Physics.grounded||"idle"!=mainanim()&&"walk"!=mainanim()?this.notgrounded=0:++this.notgrounded>4&&(mainanim("jumpfinish"),this.jumping=!0),objects.main.life.remaining<=0&&"die"!=mainanim()&&mainanim("die"),"die"==mainanim())return void(this.gameObject.Physics.vx=0);if(this.stunned)return void(this.gameObject.tint.tint=Math.random()>.5?0:16777215);16777215!=this.gameObject.tint.tint&&(this.gameObject.tint.tint=16777215),4==this.combo&&(this.gameObject.Physics.vy=-30),!this.jumping&&9!=this.combo||1!=this.gameObject.Physics.grounded||(this.gameObject.position.rotation=0,mainanim("idle",!0),this.jumping=!1,this.combo=0,this.comboing=!1,this.gameObject.Physics.vx=0,this.removeChilds()),this.jumping&&this.gameObject.Physics.vy>0&&mainanim("jumpfinish"),9==this.combo&&this.gameObject.Physics.vy>0&&(this.gameObject.position.rotation=0),0==this.combo&&1!=this.jumping&&(-1!=this.currentE.indexOf(37)||-1!=this.currentE.indexOf(39)?(mainanim("walk",!0),this.removeChilds()):mainanim("idle",!0),this.removeChilds(),this.gameObject.Physics.vx=0);for(var e=0;e<this.currentE.length;e++)37==this.currentE[e]?(-1==[3,4].indexOf(this.combo)&&(objects.main.position.scaleX=-1,this.gameObject.Physics.vx>0&&(this.gameObject.Physics.vx*=-1)),this.jumping?this.gameObject.Physics.vx=-100:0==this.combo&&(this.gameObject.Physics.vx=-80)):39==this.currentE[e]&&(-1==[3,4].indexOf(this.combo)&&(objects.main.position.scaleX=1,this.gameObject.Physics.vx<0&&(this.gameObject.Physics.vx*=-1)),this.jumping?this.gameObject.Physics.vx=100:0==this.combo&&(this.gameObject.Physics.vx=80))};var mainanim=function(i,e){if(!i)return objects.main.sprite.currentAnim.name;"die"!=mainanim()&&mainanim()!=i&&("function"==typeof e||void 0==e?objects.main.sprite.playOnceAnim(i,e||function(){}):objects.main.sprite.loopAnim(i))};gm.main.prototype.dispose=function(){},gm.main.prototype.keyPress=function(i){if("die"!=mainanim()){var e=this;if(81==i.keyCode)for(var t=getByTagName("enemy"),n=0;n<t.length;n++)t[n].life&&t[n].life.activated&&(t[n].life.remaining=0);if(88!=i.keyCode&&120!=i.keyCode||e.gameObject.Physics.grounded&&(e.jumping=!0,e.gameObject.Physics.grounded=!1,e.gameObject.Physics.vy=-500,mainanim("jump",function(){}),e.removeChilds()),90==i.keyCode||122==i.keyCode)if(this.jumping){if(0==this.gameObject.mana.remaining||1==this.gameObject.mana.remaining)return;this.gameObject.mana.remaining-=2,this.comboing=!1,this.combo=8,this.jumping=!1,generalCombo(function(){e.gameObject.Physics.grounded=!1,e.gameObject.Physics.vx=166*objects.main.position.scaleX,e.gameObject.Physics.vy=Math.abs(e.gameObject.Physics.vy)},function(){},e.combo,e,1e4,{x:16,y:16,width:16,height:16},!0)}else switch(e.combo){case 0:if(0==this.gameObject.mana.remaining)return;this.gameObject.mana.remaining--,generalCombo(function(){e.gameObject.Physics.vx=150*objects.main.position.scaleX,setTimeout(function(){e.gameObject.Physics.vx=0},30)},function(){},e.combo,e,1e3,{x:8,y:4,width:10,height:10},!1,function(i){i.position.x+=5*Math.sign(i.position.x-objects.main.position.x)});break;case 1:generalCombo(function(){e.gameObject.Physics.vx=-200*objects.main.position.scaleX,setTimeout(function(){e.gameObject.Physics.vx=0},30)},function(){},e.combo,e,1e3,{x:8,y:0,width:24,height:24},!1,function(i){i.position.x+=5*Math.sign(i.position.x-objects.main.position.x)});break;case 2:generalCombo(function(){e.gameObject.Physics.vx=0},function(){},e.combo,e,1e3,{x:0,y:0,width:40,height:40},!1,function(i){i.position.x+=5*Math.sign(i.position.x-objects.main.position.x),i.Physics.vy=-150});break;case 3:generalCombo(function(){e.gameObject.Physics.vx=150*objects.main.position.scaleX},function(){},e.combo,e,1e3,{x:8,y:0,width:12,height:12},!1,function(i){});break;case 4:generalCombo(function(){e.gameObject.Physics.vx=0},function(){},e.combo,e,1e3,{x:8,y:0,width:12,height:12},!1,function(i){i.position.x+=5*Math.sign(i.position.x-objects.main.position.x),i.Physics.vy=-300});break;case 5:generalCombo(function(){e.gameObject.Physics.vx=0},function(){},e.combo,e,1e3,{x:0,y:0,width:42,height:12},!1,function(i){i.position.x+=5*Math.sign(i.position.x-objects.main.position.x),i.Physics.vy=-200});break;case 6:generalCombo(function(){e.gameObject.Physics.vx=0},function(){},e.combo,e,1e3,{x:8,y:0,width:12,height:24},!1,function(i){i.position.x+=5*Math.sign(i.position.x-objects.main.position.x),i.Physics.vy=-300});break;case 7:generalCombo(function(){e.gameObject.Physics.vx=0},function(){},e.combo,e,1e3,{x:8,y:0,width:12,height:24},!1,function(i){i.position.x+=5*Math.sign(i.position.x-objects.main.position.x)});break;case 8:generalCombo(function(){e.gameObject.Physics.grounded=!1,e.gameObject.Physics.vx=166*objects.main.position.scaleX,e.gameObject.Physics.vy=-500,e.gameObject.position.rotation=-90*objects.main.position.scaleX},function(){},e.combo,e,1e4,{x:8,y:16,width:16,height:16},!0,function(i){i.position.x+=5*Math.sign(i.position.x-objects.main.position.x)})}}},gm.main.prototype.keyDown=function(i){-1==this.currentE.indexOf(i.keyCode)&&this.currentE.push(i.keyCode)},gm.main.prototype.keyUp=function(i){if("die"!=mainanim())for(var e=this.currentE.length-1;e>=0;e--)this.currentE[e]==i.keyCode&&this.currentE.splice(e,1)};