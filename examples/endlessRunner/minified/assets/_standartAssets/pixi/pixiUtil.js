function TilerDiv(t){var s=this,e=addMenu("Edit",function(){s.Editing?(lockedSelection=!1,$(".btnResetTile").removeClass("btn-danger").html("Edit"),s.Editing=!1,s.currentTile={},$("canvas").off("click",s.onclick),null!=s.preRotation&&(s.gameObject.position.rotation=s.preRotation)):(camera.scale=1,lockedSelection=!0,s.Editing=!0,s.preRotation=s.gameObject.position.rotation,s.gameObject.position.rotation=0,$(".btnResetTile").addClass("btn-danger").html("Stop"),s.onclick=function(t){var e=Math.ceil(s.texture.width/s.tileWidth),i=Math.ceil(s.texture.height/s.tileHeight),a=Math.floor(t.offsetX/s.tileWidth),n=Math.floor(t.offsetY/s.tileHeight);a<e&&n<i&&(s.currentTile={x:a,y:n}),null!=s.currentTile.x&&(a=Math.floor((t.offsetX-s.gameObject.position.getScreenX()-camera.x)/s.tileWidth),n=Math.floor((t.offsetY-s.gameObject.position.getScreenY()-camera.y)/s.tileHeight),e=Math.ceil(s.gameObject.position.width/s.tileWidth),i=Math.ceil(s.gameObject.position.height/s.tileHeight),a<e&&n<i&&-1<a&&-1<n&&(null==s.tilesNum[a]&&(s.tilesNum[a]=[]),s.tilesNum[a][n]=s.currentTile,s.reloadME++,socketemit("gameobject",{action:"change",name:s.gameObject.name.value,plugin:"sprite",newval:{tilesNum:s.tilesNum}})))},$("canvas").on("click",s.onclick))},"",t,"btnResetTile");1==s.Editing&&(camera.scale=1,lockedSelection=!0,$(e).addClass("btn-danger").html("Stop"))}gm.sprite=function(){this.currentAnim={frame:0,loop:!0,func:function(){}},this.path="",this.AnimationSpeed=.5,$this=this,Object.defineProperty(this,"FPS",{enumerable:!0,configurable:!0,get:function(){return 1/$this.AnimationSpeed},set:function(t){$this.AnimationSpeed=1/t,CommitValue($this.gameObject,"sprite","AnimationSpeed")}}),this.isTileMap=!1,this.spriteSheet=!1,this.randomTiled=!1,this.sheetTileWidth=32,this.sheetTileHeight=32,this.sheetTileSpacing=0,this.tileWidth=32,this.tileHeight=32,this.animations=[],this.animationData=[],this.texture={},this.currentTile={},this.tempPallete=void 0,this.private={AnimationSpeed:!0,sheetTileSpacing:!0,tileWidth:!0,tileHeight:!0,reloadME:!0,sheetTileWidth:!0,sheetTileHeight:!0},this.reloadInEditor={randomTiled:!0,path:!0,isTileMap:!0,tileWidth:!0,tileHeight:!0,reloadME:!0,spriteSheet:!0,sheetTileWidth:!0,sheetTileHeight:!0},this.tiles=[],this.tilesNum=[],this.randomTypes=[],this.dontSerialize={FPS:!0,Editing:!0,reloadME:!0},this.serializeObject={tilesNum:!0,animationData:!0,randomTypes:!0},this.reloadME=0,newObservable(this,"AnimationSpeed",void 0,function(t,e){try{e.sprite.animationSpeed=parseFloat(e.AnimationSpeed)}catch(t){}}),this.worksInEditor=!0,this.comboBoxes={},this.SetComboboxes=function(){if("assetList"in window){this.comboBoxes.path=new Array;for(var t=0;t<assetList.length;t++)0==assetList[t].isFolder&&(isImage(assetList[t].name)||assetList[t].name.endsWith(".anim"))&&this.comboBoxes.path.push({text:assetList[t].name,value:assetList[t].name})}},this.SetComboboxes(),this.selectGameObjectEditor=function(){this.SetComboboxes()},this.loopAnim=function(t){var e=t;if("string"==typeof e)for(var i=0;i<this.animationData.length;i++)this.animationData[i].name==e&&(e=i);else t=this.animationData[e].name;this.currentAnim={name:t,frame:e,loop:!0,func:function(){}},this.reloadME++},this.playOnceAnim=function(t,e){var i=t;if("string"==typeof i)for(var a=0;a<this.animationData.length;a++)this.animationData[a].name==i&&(i=a);else t=this.animationData[i].name;i!=this.currentAnim.frame?(this.currentAnim={name:t,frame:i,loop:!1,func:null!=e?e:function(){}},this.reloadME++):(this.currentAnim={name:t,frame:i,loop:!1,func:null!=e?e:function(){}},this.sprite.loop=this.currentAnim.loop,this.sprite.onComplete=this.currentAnim.func,this.sprite.gotoAndPlay(0))},this.create=function(){try{if(this.private.sheetTileSpacing=!0,this.randomTiled){if(this.spriteSheet&&(this.spriteSheet=!1),this.private.sheetTileWidth=!1,this.private.sheetTileHeight=!1,this.private.sheetTileSpacing=!1,0<this.randomTypes.length){for(var t=resources[this.path].texture,e=PIXI.RenderTexture.create(this.gameObject.position.width,this.gameObject.position.height),i=t.width,a=t.height,n=parseInt(i/this.sheetTileWidth),s=(parseInt(a/this.sheetTileHeight),Math.ceil(this.gameObject.position.width/this.sheetTileWidth)),h=Math.ceil(this.gameObject.position.height/this.sheetTileHeight),o=0;o<s;o++)for(var r=0;r<h;r++){for(var p=new Array,l=new Array,m=0;m<this.randomTypes.length;m++){var c=this.randomTypes[m];if((-1==c.minX||o<=c.minX)&&(-1==c.maxX||o>=c.maxX)&&(-1==c.minY||r<=c.minY)&&(-1==c.maxY||r>=c.maxY)){for(var d=c.num.toString().split(","),g=0;g<d.length;g++)p.push(parseInt(d[g]));l.push(c)}}var u=Math.floor(Math.random()*p.length),f=0,T=u;for(g=0;g<l.length&&0<(T-=l[g].num.toString().split(",").length);g++)f++;var w=l[f],v=p[u],b=0;try{if(w.shiftData){var S=JSON.parse(w.shiftData);for(var y in S){var I=y.replace("a","").split("_");(!I[0]||o>=parseInt(I[0]))&&(!I[1]||o<=parseInt(I[1]))&&(null!=S[y].h&&(b=parseInt(S[y].h)),(!S[y].lim||parseInt(S[y].lim)>=r)&&((I[0]&&o==parseInt(I[0])&&S[y].l||0==o&&S[y].l)&&(v=S[y].l),(I[1]&&o==parseInt(I[1])&&S[y].r||o==s-1&&S[y].r)&&(v=S[y].r)))}}}catch(t){}var O=v-(D=parseInt(v/n))*n,j=new PIXI.Texture(t,new PIXI.Rectangle(O*this.sheetTileWidth,D*this.sheetTileHeight,this.sheetTileWidth,this.sheetTileHeight)),x=new PIXI.Sprite(j);new PIXI.Transform;x.x=o*(this.sheetTileWidth-this.sheetTileSpacing)-this.sheetTileSpacing,x.y=r*(this.sheetTileHeight-this.sheetTileSpacing)-this.sheetTileSpacing-b,game.renderer.render(x,e,!1)}this.sprite=new PIXI.Sprite(e)}INEDITOR&&(this.customDiv={types:function(t){for(var e=this,i=$("<table style='width:100%' />").appendTo(t),a=0;a<this.randomTypes.length;a++){var n=this.randomTypes[a],s=$("<tr />").appendTo(i),h=$("<td style='width:40%' />").appendTo(s),o=$("<td colspan='2' />").appendTo(s),r=$("<td style='width:16px' />").appendTo(s);h.append("<b>"+a+" Sprite Number:</b>");var p=$("<input style='width:100%' />").appendTo(o);p.val(n.num),p.attr("whichAnim",a),p.on("change",function(){var t=parseInt($(this).attr("whichAnim"));e.randomTypes[t].num=$(this).val(),socketemit("gameobject",{action:"change",name:e.gameObject.name.value,plugin:"sprite",newval:{randomTypes:e.randomTypes}}),e.reloadME++});var l=$('<img src="img/close.png" />').appendTo(r);l.attr("whichAnim",a),l.on("click",function(){var t=parseInt($(this).attr("whichAnim"));e.randomTypes.splice(t,1),socketemit("gameobject",{action:"change",name:e.gameObject.name.value,plugin:"sprite",newval:{randomTypes:e.randomTypes}}),e.reloadME++});s=$("<tr />").appendTo(i),h=$("<td />").appendTo(s),o=$("<td style='width:30%' />").appendTo(s),r=$("<td colspan='2' />").appendTo(s);h.append(a+" X Range:"),(p=$("<input  style='width:100%'/>").appendTo(r)).val(this.randomTypes[a].minX),p.attr("whichAnim",a),p.on("change",function(){var t=parseInt($(this).attr("whichAnim"));e.randomTypes[t].minX=parseInt($(this).val()),socketemit("gameobject",{action:"change",name:e.gameObject.name.value,plugin:"sprite",newval:{randomTypes:e.randomTypes}}),e.reloadME++}),(p=$("<input  style='width:100%'/>").appendTo(o)).val(this.randomTypes[a].maxX),p.attr("whichAnim",a),p.on("change",function(){var t=parseInt($(this).attr("whichAnim"));e.randomTypes[t].maxX=parseInt($(this).val()),socketemit("gameobject",{action:"change",name:e.gameObject.name.value,plugin:"sprite",newval:{randomTypes:e.randomTypes}}),e.reloadME++});s=$("<tr />").appendTo(i),h=$("<td />").appendTo(s),o=$("<td style='width:30%' />").appendTo(s),r=$("<td colspan='2' />").appendTo(s);h.append(a+" Y Range:"),(p=$("<input  style='width:100%'/>").appendTo(r)).val(this.randomTypes[a].minY),p.attr("whichAnim",a),p.on("change",function(){var t=parseInt($(this).attr("whichAnim"));e.randomTypes[t].minY=parseInt($(this).val()),socketemit("gameobject",{action:"change",name:e.gameObject.name.value,plugin:"sprite",newval:{randomTypes:e.randomTypes}}),e.reloadME++}),(p=$("<input  style='width:100%'/>").appendTo(o)).val(this.randomTypes[a].maxY),p.attr("whichAnim",a),p.on("change",function(){var t=parseInt($(this).attr("whichAnim"));e.randomTypes[t].maxY=parseInt($(this).val()),socketemit("gameobject",{action:"change",name:e.gameObject.name.value,plugin:"sprite",newval:{randomTypes:e.randomTypes}}),e.reloadME++});s=$("<tr />").appendTo(i),h=$("<td />").appendTo(s),o=$("<td colspan='3' />").appendTo(s);h.append(a+" Shift Data"),(p=$("<input  style='width:100%'/>").appendTo(o)).val(this.randomTypes[a].shiftData),p.attr("whichAnim",a),p.on("change",function(){var t=parseInt($(this).attr("whichAnim"));e.randomTypes[t].shiftData=$(this).val(),socketemit("gameobject",{action:"change",name:e.gameObject.name.value,plugin:"sprite",newval:{randomTypes:e.randomTypes}}),e.reloadME++})}addMenu("Add New Random Tile",function(){e.randomTypes.push({num:0,minX:-1,maxX:-1,minY:-1,maxY:-1,shiftData:""}),socketemit("gameobject",{action:"change",name:e.gameObject.name.value,plugin:"sprite",newval:{randomTypes:e.randomTypes}}),e.reloadME++},"",t,"btnAddAnimation")}})}else if(this.spriteSheet){this.private.sheetTileWidth=!1,this.private.sheetTileHeight=!1,this.animations=[];i=(t=resources[this.path].texture).width,a=t.height,n=parseInt(i/this.sheetTileWidth),parseInt(a/this.sheetTileHeight);0==this.animationData.length&&(this.animationData=[{seq:[0],FPS:6,name:"default"}]);for(o=0;o<this.animationData.length;o++){var A=this.animationData[o];this.animations[o]=[];for(r=0;r<A.seq.length;r++){var D=parseInt(A.seq[r]/n);O=A.seq[r]-D*n;this.animations[o].push(new PIXI.Texture(t,new PIXI.Rectangle(O*this.sheetTileWidth,D*this.sheetTileHeight,this.sheetTileWidth,this.sheetTileHeight)))}}this.sprite=new PIXI.extras.AnimatedSprite(this.animations[this.currentAnim.frame]),this.sprite.loop=this.currentAnim.loop,this.sprite.onComplete=this.currentAnim.func,changing&&INEDITOR&&(this.gameObject.position.width=this.sprite.width,this.gameObject.position.height=this.sprite.height,socketemit("gameobject",{action:"change",name:this.gameObject.name.value,plugin:"position",newval:{width:this.gameObject.position.width,height:this.gameObject.position.height}})),this.currentAnim.name=this.animationData[this.currentAnim.frame].name,this.sprite.animationSpeed=this.animationData[this.currentAnim.frame].FPS/60,INEDITOR?this.customDiv={animationSequences:function(t){for(var e=this,i=$("<table style='width:100%' />").appendTo(t),a=0;a<this.animationData.length;a++){var n=$("<tr />").appendTo(i),s=$("<td style='width:40%' />").appendTo(n),h=$("<td  />").appendTo(n),o=$("<td style='width:16px' />").appendTo(n);s.append("<b>"+a+" animation Name:</b>");var r=$("<input style='width:100%' />").appendTo(h);r.val(this.animationData[a].name),r.attr("whichAnim",a),r.on("change",function(){var t=parseInt($(this).attr("whichAnim"));e.animationData[t].name=$(this).val(),socketemit("gameobject",{action:"change",name:e.gameObject.name.value,plugin:"sprite",newval:{animationData:e.animationData}}),e.reloadME++});var p=$('<img src="img/close.png" />').appendTo(o);p.attr("whichAnim",a),p.on("click",function(){var t=parseInt($(this).attr("whichAnim"));e.animationData.splice(t,1),socketemit("gameobject",{action:"change",name:e.gameObject.name.value,plugin:"sprite",newval:{animationData:e.animationData}}),e.reloadME++});n=$("<tr />").appendTo(i),s=$("<td />").appendTo(n),h=$("<td colspan='2' />").appendTo(n);s.append(a+" animation FPS:"),(r=$("<input  style='width:100%'/>").appendTo(h)).val(this.animationData[a].FPS),r.attr("whichAnim",a),r.on("change",function(){var t=parseInt($(this).attr("whichAnim"));e.animationData[t].FPS=parseInt($(this).val()),socketemit("gameobject",{action:"change",name:e.gameObject.name.value,plugin:"sprite",newval:{animationData:e.animationData}}),e.reloadME++});n=$("<tr />").appendTo(i),s=$("<td/>").appendTo(n),h=$("<td colspan='2' />").appendTo(n);s.append(a+" animation sequence:"),r=$("<input style='width:100%' />").appendTo(h);var l=JSON.stringify(this.animationData[a].seq);r.val(l.substr(1,l.length-2)),r.attr("whichAnim",a),r.on("change",function(){var t=parseInt($(this).attr("whichAnim"));e.animationData[t].seq=JSON.parse("["+$(this).val()+"]"),socketemit("gameobject",{action:"change",name:e.gameObject.name.value,plugin:"sprite",newval:{animationData:e.animationData}}),e.reloadME++})}addMenu("Add New Animation",function(){e.animationData.push({seq:[0],FPS:6,name:""}),socketemit("gameobject",{action:"change",name:e.gameObject.name.value,plugin:"sprite",newval:{animationData:e.animationData}}),e.reloadME++},"",t,"btnAddAnimation")}}:this.sprite.play()}else if(this.private.sheetTileWidth=!0,this.private.sheetTileHeight=!0,this.isTileMap){this.gameObject.position.centerx=0,this.gameObject.position.centery=0,this.customDiv={tiler:TilerDiv},this.private={AnimationSpeed:!0,sheetTileSpacing:!0,AnimationSpeed:!0,Editing:!0,reloadME:!0,sheetTileWidth:!0,sheetTileHeight:!0},this.texture=resources[this.path].texture;var W=Math.ceil(this.texture.width/this.tileWidth),M=Math.ceil(this.texture.height/this.tileHeight);for(o=0;o<W;o++){this.tiles[o]=[];for(r=0;r<M;r++){var E=this.tileWidth;(O=o*this.tileWidth)+E>this.texture.width&&(E=this.texture.width-O);var P=this.tileHeight;(D=r*this.tileHeight)+P>this.texture.height&&(P=this.texture.height-D),this.tiles[o][r]=new PIXI.Texture(this.texture,new PIXI.Rectangle(O,D,E,P))}}this.sprite=new PIXI.Container;for(o=0;o<this.tilesNum.length;o++)for(r=0;r<this.tilesNum[o].length;r++){var k=this.tilesNum[o][r];if(null!=k&&null!=k.x){var X=this.tiles[k.x][k.y];(x=new PIXI.Sprite(X)).x=o*this.tileWidth,x.y=r*this.tileHeight,this.sprite.addChild(x)}}}else{if(this.customDiv={},this.private={AnimationSpeed:!0,sheetTileSpacing:!0,tileWidth:!0,tileHeight:!0,Editing:!0,reloadME:!0,sheetTileWidth:!0,sheetTileHeight:!0},this.path.endsWith("anim")){var H=new Array,N=JSON.parse(resources[this.path].data);for(var o in N)H.push(resources[N[o]].texture);this.sprite=new PIXI.extras.AnimatedSprite(H),this.sprite.animationSpeed=parseFloat(this.AnimationSpeed),INEDITOR||this.sprite.play()}else this.sprite=new PIXI.Sprite(resources[this.path].texture);changing&&INEDITOR&&(this.gameObject.position.width=this.sprite.width,this.gameObject.position.height=this.sprite.height,socketemit("gameobject",{action:"change",name:this.gameObject.name.value,plugin:"position",newval:{width:this.gameObject.position.width,height:this.gameObject.position.height}}))}}catch(t){this.sprite={anchor:{}}}INEDITOR&&selectedSprite==this.gameObject&&reDrawPanel1(this.gameObject);try{this.gameObject.position.container.addChild(this.sprite)}catch(t){}this.gameObject.position.init()},this.update=function(){if(INEDITOR&&1==this.isTileMap){if(null!=this.tempPallete){try{for(;0<this.tempPallete.children.length;)this.tempPallete.removeChild(this.tempPallete.children[0])}catch(t){}guiContainer.removeChild(this.tempPallete),this.tempPallete=void 0}if(selectedSprite==this.gameObject&&1==this.Editing){this.tempPallete=new PIXI.Container;for(var t=Math.ceil(this.texture.width/this.tileWidth),e=Math.ceil(this.texture.height/this.tileHeight),i=0;i<t;i++)for(var a=0;a<e;a++){var n=this.tiles[i][a],s=new PIXI.Sprite(n);s.x=i*(this.tileWidth+1)-camera.x,s.y=a*(this.tileHeight+1)-camera.y,this.tempPallete.addChild(s)}this.graphics=new PIXI.Graphics,this.graphics.lineStyle(1,16767232,1);var h=Math.ceil(this.gameObject.position.width/this.tileWidth),o=Math.ceil(this.gameObject.position.height/this.tileHeight);for(i=1;i<h;i++)this.graphics.moveTo(i*this.tileWidth+this.gameObject.position.getScreenX(),this.gameObject.position.getScreenY()),this.graphics.lineTo(i*this.tileWidth+this.gameObject.position.getScreenX(),this.gameObject.position.height+this.gameObject.position.getScreenY());for(i=1;i<o;i++)this.graphics.moveTo(this.gameObject.position.getScreenX(),i*this.tileHeight+this.gameObject.position.getScreenY()),this.graphics.lineTo(this.gameObject.position.width+this.gameObject.position.getScreenX(),i*this.tileHeight+this.gameObject.position.getScreenY());this.graphics.lineStyle(0),null!=this.currentTile.x&&DrawBox(this.currentTile.x*(this.tileWidth+1)-camera.x,this.currentTile.y*(this.tileHeight+1)-camera.y,this.tileWidth,this.tileHeight,0,this.graphics,0,0,16711680,1,!0,this.gameObject.position.container),this.tempPallete.addChild(this.graphics),guiContainer.addChild(this.tempPallete)}}},this.dispose=function(){try{this.gameObject.position.container.removeChild(this.sprite)}catch(t){}try{this.sprite.destroy&&this.sprite.destroy()}catch(t){}delete this.sprite}},gm.tint=function(){return this.tint="0xffffff",this.worksInEditor=!0,newObservable,this.create=function(){var i=this;newObservable(this,"tint",void 0,function(t,e){i.gameObject.sprite.sprite.tint=i.tint})()},this.dispose=function(){this.gameObject.sprite&&this.gameObject.sprite.sprite&&this.gameObject.sprite.sprite.tint&&(this.gameObject.sprite.sprite.tint="0xffffff")},this},gm.text=function(){this.text="",this.fontSize="16",this.fontFamily="Arial",this.fontStyle="italic",this.fontWeight="bold",this.fill="['#ffffff']",this.stroke="#000000",this.strokeThickness=2,this.dropShadows=!0,this.ShadowColor="#000000",this.dropShadowBlur=4,this.dropShadowAngle=45,this.dropShadowDistance=6,this.wordWrap=!0,this.wordWrapWidth=440,this.private={},this.worksInEditor=!0,this.reloadInEditor={fontSize:!0,fontFamily:!0,fontStyle:!0,fontWeight:!0,fill:!0,stroke:!0,strokeThickness:!0,dropShadows:!0,ShadowColor:!0,dropShadowBlur:!0,dropShadowAngle:!0,dropShadowDistance:!0,wordWrap:!0,wordWrapWidth:!0},this.create=function(){try{var t=["#ffffff"];try{t=JSON.parse(this.fill.replace(/\'/g,'"'))}catch(t){}var e=new PIXI.TextStyle({fontFamily:this.fontFamily,fontSize:parseInt(this.fontSize),fontStyle:this.fontStyle,fontWeight:this.fontWeight,fill:t,stroke:this.stroke,strokeThickness:parseInt(this.strokeThickness),dropShadow:this.dropShadows,dropShadowColor:this.dropShadowColor,dropShadowBlur:this.dropShadowBlur,dropShadowAngle:parseFloat(this.dropShadowAngle)*Math.PI/180,dropShadowDistance:parseInt(this.dropShadowDistance),wordWrap:this.wordWrap,wordWrapWidth:parseInt(this.wordWrapWidth)});this.sprite=new PIXI.Text(this.text,e);var i=this;newObservable(this,"text",void 0,function(t,e){i.sprite.setText(t),i.gameObject.position.width=i.sprite.width,i.gameObject.position.height=i.sprite.height})}catch(t){}changing&&(this.gameObject.position.width=this.sprite.width,this.gameObject.position.height=this.sprite.height,INEDITOR&&socketemit("gameobject",{action:"change",name:this.gameObject.name.value,plugin:"position",newval:{width:this.gameObject.position.width,height:this.gameObject.position.height}})),INEDITOR&&selectedSprite==this.gameObject&&reDrawPanel1(this.gameObject);try{this.gameObject.position.container.addChild(this.sprite)}catch(t){}this.gameObject.position.init("text")},this.dispose=function(){try{this.gameObject.position.container.removeChild(this.sprite)}catch(t){}this.sprite.destroy&&this.sprite.destroy(),delete this.sprite}};