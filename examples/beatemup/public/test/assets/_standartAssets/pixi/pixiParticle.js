function colorFind(t,e,i,s){try{for(var a=i.length,r=e/(a-1),n=0;n<a-1;n++)if(t>=n*r&&t<(n+1)*r){var h=(t-r*n)/r,o=i[n],p=i[n+1],c=parseInt(parseInt("0x"+o.substr(1,2))*(1-h)+parseInt("0x"+p.substr(1,2))*h),l=parseInt(parseInt("0x"+o.substr(3,2))*(1-h)+parseInt("0x"+p.substr(3,2))*h),m=parseInt(parseInt("0x"+o.substr(5,2))*(1-h)+parseInt("0x"+p.substr(5,2))*h);return parseInt(65536*c+256*l+1*m)}return parseInt("0x"+i[i.length-1].substr(1))}catch(t){return 16777215}}gm.particle=function(){if(this.particles=[],this.maxLife=5,this.minSpeed=10,this.maxSpeed=10,this.velocityX=0,this.velocityY=0,this.velocityRandomness=0,this.startSize=.01,this.endSize=.1,this.minRotation=0,this.maxRotation=720,this.maxRotationRandomness=360,this.maxParticle=100,this.particleSpawnSpeed=5,this.tintByLife="['#ffff00','#ff0000']",this.private={timer:!0},this.path="",this.AnimationSpeed=.5,$this=this,newObservable(this,"AnimationSpeed",void 0,function(t,e){try{e.sprite.animationSpeed=parseFloat(e.AnimationSpeed)}catch(t){}}),this.worksInEditor=!0,this.reloadInEditor={path:!0,isText:!0},this.comboBoxes={},"assetList"in window){this.comboBoxes.path=new Array;for(var t=0;t<assetList.length;t++)0==assetList[t].isFolder&&(isImage(assetList[t].name)||assetList[t].name.endsWith(".anim"))&&this.comboBoxes.path.push({text:assetList[t].name,value:assetList[t].name})}this.getSprite=function(){try{if(this.path.endsWith("anim")){var t=new Array,e=JSON.parse(resources[this.path].data);for(var i in e)t.push(resources[e[i]].texture);var s=new PIXI.extras.AnimatedSprite(t);return s.animationSpeed=parseFloat(this.AnimationSpeed),INEDITOR||s.play(),s}return new PIXI.extras.AnimatedSprite([resources[this.path].texture])}catch(t){return{anchor:{}}}},this.create=function(){this.color=["#ffffff"];try{this.color=JSON.parse(this.tintByLife.replace(/'/g,'"'))}catch(t){}INEDITOR&&selectedSprite==this.gameObject&&reDrawPanel1(this.gameObject);try{this.gameObject.position.container.addChild(this.sprite)}catch(t){}},this.timer=0,this.update=function(t){t/=100,this.timer<.5&&(this.timer+=t),INEDITOR&&selectedSprite!=this.gameObject||(this.particles.length<parseInt(this.maxParticle)&&this.spawnNewPartice(t),this.changeParticles(t))},this.changeParticles=function(t){for(var e=new Array,i=0;i<this.particles.length;i++)!function(t,e,i,s){var a=e.particles[t],r=a.speedx+parseFloat(e.velocityX)*s,n=a.speedy+parseFloat(e.velocityY)*s;Math.sqrt(r*r+n*n)<e.maxSpeed&&(a.speedx=r,a.speedy=n),a.sprite.x+=a.speedx*s,a.sprite.y+=a.speedy*s;var h=parseFloat(e.startSize)+(parseFloat(e.endSize)-parseFloat(e.startSize))*parseFloat(a.life)/parseFloat(e.maxLife);a.sprite.width=a.oWidth*h,a.sprite.height=a.oHeight*h,a.sprite.rotation=a.minRotation+(a.maxRotation-a.minRotation)*a.life/parseFloat(e.maxLife),e.color.length>1&&(a.sprite.tint=colorFind(a.life,parseFloat(e.maxLife),e.color)),a.life+=s,0!=e.maxLife&&a.life>e.maxLife&&i.push(t)}(i,this,e,t);for(i=0;i<e.length;i++)this.gameObject.position.container.removeChild(this.particles[e[i]].sprite),this.particles.splice(e[i],1)},this.spawnNewPartice=function(t){this.timer+=t;var e=parseInt(this.particleSpawnSpeed)*this.timer;if(e>1){this.timer=0;var i=Math.floor(e);i>this.maxParticle-this.particles.length&&(i=this.maxParticle-this.particles.length);for(var s=0;s<i;s++){var a=this.getSprite(),r={sprite:a,speed:Math.random()*(parseFloat(this.maxSpeed)-parseFloat(this.minSpeed))+parseFloat(this.minSpeed),angle:2*Math.random()*Math.PI,size:parseFloat(this.startSize),color:this.color[0],x:0,y:0,life:0,oWidth:a.width,oHeight:a.height,maxRotation:(parseFloat(this.maxRotation)+parseFloat(this.maxRotationRandomness)-2*Math.random()*parseFloat(this.maxRotationRandomness))*Math.PI/180,minRotation:this.minRotation*Math.PI/180};r.speedx=r.speed*Math.cos(r.angle),r.speedy=r.speed*Math.sin(r.angle),this.particles.push(r),a.x=this.gameObject.position.getScreenX(),a.y=this.gameObject.position.getScreenY(),a.anchor.y=.5,a.anchor.x=.5,a.width=r.oWidth*this.startSize,a.height=r.oHeight*this.startSize,a.tint=parseInt("0x"+this.color[0].replace("#","")),this.gameObject.position.container.addChild(r.sprite)}}},this.dispose=function(){try{for(var t=0;t<this.particles.length;t++)gameContainer.removeChild(this.particles[t].sprite),this.particles[t].sprite.destroy&&this.particles[t].sprite.destroy()}catch(t){}delete this.sprite}};