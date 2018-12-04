function monsterActivation(e){var i=e.gameObject.position;if(0==e.gameObject.life.activated){if(i.x>objects.Director.Director.maxVisibleX||i.x<objects.Director.Director.minVisibleX||i.y>objects.Director.Director.maxVisibleY||i.y<objects.Director.Director.minVisibleY)return e.gameObject.Physics&&(e.gameObject.Physics.vx=0),!0;e.gameObject.life.activated=!0}}function createDestroyer(e,i,t,s,a,n,c){var r=objects[addPrefab(c||"HeroDestroyer.prefab",{position:{x:i,y:t,width:s,height:a,parent:e,zOrder:-1}})[0]];return r.Physics.onCollision={main:function(e,i){e.life&&e.life.remaining>0&&e.life.invulnerable<=0&&(e.life.decreaseBy(i.name.value),n&&n())}},r}gm.imp=function(){this.MonsterType="Imp",this.running=!1,this.closeness=0,this.vx=20,this.iswalking=!0,this.left=0,this.right=0},gm.imp.prototype.create=function(){var e=this;e.gameObject.sprite.playOnceAnim("walk",function(){e.iswalking=!1}),this.vx=this.vx+20*Math.random(),this.gameObject.Physics.vx=this.vx},gm.imp.prototype.update=function(e){var i=this;if(this.gameObject.life.remaining<=0&&"die"!=this.gameObject.sprite.currentAnim.name){try{for(var t=childrenGameObject[this.gameObject.name.value],s=0;s<t.length;s++)try{objects[t[s]].remove()}catch(e){}}catch(e){}"Vampire"==i.MonsterType&&(i.gameObject.Physics&&removeComponent(i.gameObject,"Physics"),addPrefab("smallbat.prefab",{position:{x:i.gameObject.position.x,y:i.gameObject.position.y}})),this.gameObject.sprite.playOnceAnim("die",function(){"Vampire"==i.MonsterType&&i.gameObject.remove()}),this.gameObject.Physics.vx=0}if("die"!=this.gameObject.sprite.currentAnim.name&&0!=this.gameObject.Physics.grounded){var a=this.gameObject.position;if(!monsterActivation(this)){var n=objects.main.position,c=Math.sqrt((a.x-n.x)*(a.x-n.x)+(a.y-n.y)*(a.y-n.y));if("Vampire"==i.MonsterType&&(c<24&&"attack"==this.gameObject.sprite.currentAnim.name?this.gameObject.Physics.vx+=24*Math.sign(a.x-n.x):"attack"==this.gameObject.sprite.currentAnim.name&&(this.gameObject.Physics.vx=0)),this.running&&c>150&&(this.running=!1),c<24&&0==this.iswalking&&"prepare"!=this.gameObject.sprite.currentAnim.name&&"attack"!=this.gameObject.sprite.currentAnim.name&&0==this.running)this.gameObject.position.scaleX=Math.sign(n.x-a.x),this.gameObject.Physics.vx=0,this.gameObject.sprite.playOnceAnim("prepare",function(){var e=void 0;e="Vampire"==i.MonsterType?createDestroyer(i.gameObject.name.value,4,-8,16,8):createDestroyer(i.gameObject.name.value,16,0,8,8),i.gameObject.sprite.playOnceAnim("attack",function(){"Vampire"==i.MonsterType?(i.gameObject.Physics.vx=0,i.gameObject.sprite.playOnceAnim("idle",function(){i.gameObject.sprite.playOnceAnim("walk",function(){i.iswalking=!1})})):(i.running=!0,i.gameObject.sprite.loopAnim("walk"),i.gameObject.position.scaleX=Math.sign(a.x-n.x)),e.remove()})});else if("attack"!=this.gameObject.sprite.currentAnim.name&&"prepare"!=this.gameObject.sprite.currentAnim.name&&"idle"!=this.gameObject.sprite.currentAnim.name&&1==this.iswalking)if(this.gameObject.Physics.wall!=objects.main.Physics.wall||this.running){game.renderer.width;this.gameObject.Physics.checkWalls(this.gameObject.position.x+16*this.gameObject.position.scaleX,this.gameObject.position.y+16)&&this.gameObject.position.x+16*this.gameObject.position.scaleX>objects.Director.Director.left&&this.gameObject.position.x+16*this.gameObject.position.scaleX<objects.Director.Director.right?this.gameObject.Physics.vx=this.gameObject.position.scaleX*this.vx*(this.running?2:1):(this.running=!1,this.gameObject.position.scaleX*=-1,this.gameObject.Physics.vx=this.gameObject.position.scaleX*this.vx)}else this.gameObject.position.scaleX=Math.sign(n.x-a.x),this.gameObject.Physics.vx=this.vx*this.gameObject.position.scaleX;if("walk"==this.gameObject.sprite.currentAnim.name&&0==this.iswalking){var r=this.gameObject.Physics.vx;this.gameObject.Physics.vx=0,"Vampire"==this.MonsterType?(i.gameObject.sprite.playOnceAnim("walk",function(){i.iswalking=!1}),i.iswalking=!0,i.gameObject.Physics.vx=r):(i.gameObject.sprite.playOnceAnim(i.running?"smallidle":"idle",function(){"idle"==i.gameObject.sprite.currentAnim.name&&(i.gameObject.Physics.vx=r),i.gameObject.sprite.playOnceAnim("walk",function(){i.iswalking=!1})}),i.iswalking=!0)}}}},gm.imp.prototype.dispose=function(){};