function PlayAgain(){loadScene(currentSceneName),camera.x=0,PlayGame()}function GoMenu(){loadScene(currentSceneName),camera.x=0}function verticalSpeed(e,t){var i=e.GetLinearVelocity();e.SetLinearVelocity(new box2d.b2Vec2(t,i.y))}gm.Main=function(){this.grounded=0,this.onRope=!1,this.ropePosition={},this.flySpeed=0,this.landing=!1,this.prex=0,this.vSpeed=6,this.preSwingSpeed=0,this.ay=-54,this.ax=0,this.ropeLen=20,this.priorty=1},gm.Main.prototype.dispose=function(){gameContainer.removeChild(this.graphics),this.graphics.destroy&&this.graphics.destroy(),gameContainer.removeChild(this.graphics2),this.graphics2.destroy&&this.graphics2.destroy()},gm.Main.prototype.create=function(){$("canvas").trigger("mousedown"),$("canvas").trigger("touchstart"),this.graphics=new PIXI.Graphics,this.graphics.zOrder=-1,this.graphics2=new PIXI.Graphics,this.graphics2.zOrder=99,objects.MainSprite0.position.zOrder=1,gameContainer.addChild(this.graphics),gameContainer.addChild(this.graphics2)},gm.Main.prototype.update=function(e){if(this.prex=this.gameObject.position.x,this.graphics.clear(),this.graphics2.clear(),this.onRope){this.gameObject.position.x<3100&&3e3<this.gameObject.position.x&&(pausedUpdate=!0,objects.Tip1.text.text="",objects.Tip2.text.text="",objects.Tip3.text.text="Click/Touch again to release");var t=this.ropePosition.x-objects.Torso.position.getX(),i=this.ropePosition.y-objects.Torso.position.getY(),o=this.ropePosition.x,s=this.ropePosition.y,n=Math.sqrt(t*t+i*i);this.ropeLen<n?(o=t*this.ropeLen/n+objects.Torso.position.getX(),s=i*this.ropeLen/n+objects.Torso.position.getY(),this.ropeLen+=80):"hook.png"==this.rope.sprite.path&&(this.rope.sprite.path="hook2.png"),this.graphics.moveTo(objects.Torso.position.getX(),objects.Torso.position.getY()-40),this.graphics.lineStyle(12,16764057,1);var r={x:o,y:s};this.graphics.lineTo(r.x,r.y),this.graphics.moveTo(objects.Torso.position.getX()+6,objects.Torso.position.getY()-40),this.graphics.lineStyle(4,6697728,1);r={x:o+6,y:s};this.graphics.lineTo(r.x,r.y),this.graphics.moveTo(objects.Torso.position.getX()-6,objects.Torso.position.getY()-40),this.graphics.lineStyle(4,6697728,1);r={x:o-6,y:s};this.graphics.lineTo(r.x,r.y),this.graphics2.moveTo(objects.Torso.position.getX()-23,objects.Torso.position.getY()-12),this.graphics2.lineStyle(12,16764057,1);r={x:o,y:s};this.graphics2.lineTo(r.x,r.y),this.graphics2.moveTo(objects.Torso.position.getX()-17,objects.Torso.position.getY()-12),this.graphics2.lineStyle(4,6697728,1);r={x:o+6,y:s};this.graphics2.lineTo(r.x,r.y),this.graphics2.moveTo(objects.Torso.position.getX()-30,objects.Torso.position.getY()-12),this.graphics2.lineStyle(4,6697728,1);r={x:o-6,y:s};this.graphics2.lineTo(r.x,r.y);var a=this.gameObject.Physics.body.GetLinearVelocity().x;1==Math.sign(a)&&-1==Math.sign(this.preSwingSpeed)&&"swingforward"!=objects.MainSprite0.objectAnimator.playing&&objects.MainSprite0.objectAnimator.playXTimes("swingforward",1),-1==Math.sign(a)&&1==Math.sign(this.preSwingSpeed)&&"swingback"!=objects.MainSprite0.objectAnimator.playing&&objects.MainSprite0.objectAnimator.playXTimes("swingback",1),0!=a&&(this.preSwingSpeed=a)}else this.grounded&&objects.Main.position.y>objects.Director.Director.floorY-132?(this.landing=!1,verticalSpeed(this.gameObject.Physics.body,this.vSpeed),this.gameObject.position.x<1300&&1200<this.gameObject.position.x&&(pausedUpdate=!0,objects.Tip1.text.text="Click/Touch to jump through"),this.gameObject.position.x<2300&&2200<this.gameObject.position.x&&(pausedUpdate=!0,objects.Tip1.text.text="",objects.TipJump.text.text="",objects.TipJump.text.text="Jump again!"),"walk"!=objects.MainSprite0.objectAnimator.playing&&(objects.MainSprite0.objectAnimator.loop("walk"),objects.MainSprite0.objectAnimator.fun=function(){objects.Main.Sound.volume=2,objects.Main.Sound.path="step2.mp3",objects.Main.Sound.Play()})):0<this.flySpeed?("jump"!=objects.MainSprite0.objectAnimator.playing&&objects.MainSprite0.objectAnimator.playXTimes("jump",1),verticalSpeed(this.gameObject.Physics.body,this.flySpeed)):this.gameObject.position.x<2600&&2500<this.gameObject.position.x&&(pausedUpdate=!0,objects.Tip1.text.text="",objects.TipJump.text.text="",objects.Tip2.text.text="Click/Touch again midair to hang")},gm.Main.prototype.mouseDown=function(e,t){if(!(objects.Menu||objects.Pause&&1==objects.Pause.PauseGame.paused))if(pausedUpdate=!1,this.onRope)this.ropeLen=20,this.gameObject.removeComponent("revoluteConstraint"),objects.Director.Sound.path="oof.mp3",objects.Director.Sound.Play(),this.rope.sprite.path="hook.png",this.rope=null,this.onRope=!1,this.gameObject.Physics.velocityY=-300,this.landing=!0,objects.Torso.sprite.path="mainsprites\\torso.png","swingback"!=objects.MainSprite0.objectAnimator.playing&&objects.MainSprite0.objectAnimator.playXTimes("swingback",1);else if(0<this.grounded&&objects.Main.position.y>objects.Director.Director.floorY-192)objects.Director.Sound.path="hop.mp3",objects.Director.Sound.Play(),this.grounded=0,this.gameObject.Physics.body.SetLinearVelocity(new box2d.b2Vec2(this.vSpeed,-800)),this.landing=!1,objects.MainSprite0.objectAnimator.playXTimes("jump",1);else if(!this.landing&&this.gameObject.position.y<objects.Director.Director.floorY-120){var i=this.findClosest();if(null!=i){var o=i.obj.position.x-this.gameObject.position.x,s=i.obj.position.y-this.gameObject.position.y;Math.sqrt(o*o+s*s)+128<objects.Director.Director.floorY-i.obj.position.y&&(this.gameObject.addComponent("revoluteConstraint",{AnchorX:this.ax,AnchorY:this.ay,otherGameObjectName:i.obj.name.value}),objects.Torso.sprite.path="mainsprites\\torsohang.png","swingforward"!=objects.MainSprite0.objectAnimator.playing&&objects.MainSprite0.objectAnimator.playXTimes("swingforward",1),this.ropePosition={x:i.obj.position.x,y:i.obj.position.y},this.rope=i.obj,verticalSpeed(this.gameObject.Physics.body,3*this.gameObject.Physics.body.GetLinearVelocity().x/2),this.onRope=!0,this.flySpeed=0,this.landing=!1)}}},gm.Main.prototype.beginContact=function(e){"ground"==e.name.tagName&&(this.grounded++,0<this.grounded&&(verticalSpeed(this.gameObject.Physics.body,this.vSpeed),this.flySpeed=0,this.onRope&&(this.gameObject.Physics.velocityY=-300))),"Vial"==e.name.tagName&&(e.sprite.path="lightoff.png"),"obstacle"==e.name.tagName&&(objects[addPrefab("Explode.prefab",{position:{x:this.gameObject.position.x,y:this.gameObject.position.y}})[0]].position.other=e,this.gameObject.remove(),null==localStorage.highestEscapeEvilCorpScore&&(localStorage.highestEscapeEvilCorpScore=0),localStorage.highestEscapeEvilCorpScore<objects.Director.Director.score&&(localStorage.highestEscapeEvilCorpScore=objects.Director.Director.score),objects.Director.Sound.volume=40,objects.Director.Sound.path="saw.mp3",objects.Director.Sound.onFinish=[function(){objects.Director.Director.canRestart=!0,objects.Director.Sound.onFinish=[]}],objects.Director.Sound.Play(),GetComponents("PauseGame")[0].gameObject.position.x=-5e3,setTimeout(function(){objects.Director.Achievments.save();game.renderer.width;createGameObject({name:{value:"PlayAgain"},position:{x:-496,y:100,zOrder:9999,isGuiElement:!0,centerAligned:!0},MetroButton:{color:9091877,text:"Play Again",function:"PlayAgain()",sizeX:512,sizeY:512,icon:"play.png"}}),createGameObject({name:{value:"GoMenu"},position:{x:80,y:100,zOrder:9999,isGuiElement:!0,centerAligned:!0},MetroButton:{color:16497445,text:"Go To Menu",function:"GoMenu()",sizeX:512,sizeY:512,icon:"menu.png"}});for(var i=new PIXI.Container,e=0;e<objects.Director.Achievments.current.length;e++){var t=objects.Director.Achievments.current[e];ListItem(64,128+128*e,960,112,t.description+(t.progress?" (Current:"+parseInt(t.progress)+")":""),16759669,i,t.done?"ok.png":void 0,!0)}i.rotatable=!1,setTimeout(function(){objects.Director.Achievments.dispose(),objects.Director.Achievments.create();for(var e=i.children.length-1;0<=e;e--)i.removeChild(i.children[e]);for(e=0;e<objects.Director.Achievments.current.length;e++){var t=objects.Director.Achievments.current[e];ListItem(64,128+128*e,960,112,t.description+(t.progress?" (Current:"+parseInt(t.progress)+")":""),16759669,i,t.done?"ok.png":void 0,!0)}},2e3),createGameObject({name:{value:"AchievementsDead"},position:{x:-496,y:676,zOrder:9999,isGuiElement:!0,centerAligned:!0},MetroButton:{color:15244069,text:"Missions"+objects.Director.Achievments.getText(),alpha:.5,function:"",sizeX:1088,sizeY:512,icon:void 0,sprite:i}})},1800))},gm.Main.prototype.findClosest=function(e){null==e&&(e="ropePoint");for(var t=void 0,i=getByTagName(e),o=0;o<i.length;o++){var s=i[o];if(s.position.x>objects.Main.position.x){var n=objects.Main.position.x-s.position.x,r=objects.Main.position.y-s.position.y,a=Math.sqrt(n*n+r*r);(null==t||a<t.len)&&(t={len:a,obj:s})}}return t};