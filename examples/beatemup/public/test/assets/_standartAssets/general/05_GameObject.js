function padLeft(e,t,i){return Array(t-String(e).length+1).join(i||"0")+e}function DrawBox(e,t,i,n,r,a,o,s,h,c,l,g,d){c||(c=1);var p={x:e-o*i,y:t-s*n},u={x:e+(1-o)*i,y:t+(1-s)*n},m={x:p.x,y:u.y},f={x:u.x,y:p.y},v={x:e,y:t},x=r;p=rotateAround(p,v,x),m=rotateAround(m,v,x),u=rotateAround(u,v,x),f=rotateAround(f,v,x),void 0==d&&a.beginFill(16724736,.01),a.lineStyle(2,h,c),a.moveTo(p.x,p.y),a.lineTo(m.x,m.y),a.lineTo(u.x,u.y),a.lineTo(f.x,f.y),a.lineTo(p.x,p.y),a.endFill(),1!=l&&(a.moveTo(v.x-2,v.y+2),a.lineTo(v.x+2,v.y-2),a.moveTo(v.x+2,v.y+2),a.lineTo(v.x-2,v.y-2)),a.lineStyle(0),1!=l&&g.addChild(a)}function DrawCircle(e,t,i,n,r,a,o,s,h,c,l){var g={x:e,y:t};r.lineStyle(2,s,h),r.drawCircle(e,t,i),1!=l&&(r.moveTo(g.x-2,g.y+2),r.lineTo(g.x+2,g.y-2),r.moveTo(g.x+2,g.y+2),r.lineTo(g.x-2,g.y-2)),r.lineStyle(0),c.addChild(r)}function DrawPolygon(e,t,i,n,r,a,o,s,h){if(!(i.length<2)){r.lineStyle(2,a,o);for(var c={x:e,y:t},l=[],g=0;g<i.length;g++)l[g]={x:i[g].x+e,y:i[g].y+t},l[g]=rotateAround(l[g],c,n);r.moveTo(l[l.length-1].x,l[l.length-1].y);for(g=0;g<l.length;g++)r.lineTo(l[g].x,l[g].y);if(s){for(g=0;g<l.length;g++)i[g].c&&r.lineStyle(2,i[g].c,1),r.drawCircle(l[g].x,l[g].y,2),i[g].c&&r.lineStyle(2,a,o);r.moveTo(c.x-2,c.y+2),r.lineTo(c.x+2,c.y-2),r.moveTo(c.x+2,c.y+2),r.lineTo(c.x-2,c.y-2)}r.lineStyle(0),h.addChild(r)}}var gm={},parents={},childrenGameObject={},selectedSprite=void 0,lockedSelection=!1,positions=new Array;Number.prototype.padLeft=function(e,t){return Array(e-String(this).length+1).join(t||"0")+this},camera={x:0,y:0,scale:1,followX:!0,followY:!0,followingTransform:void 0,followPercent:100,follow:function(e,t){t&&(this.followPercent=t),"string"==typeof e&&objects[e]?this.followingTransform=objects[e].position:e.position?this.followingTransform=e.position:void 0!=e.x&&void 0!=e.y&&(this.followingTransform=e)},update:function(e){var t=game.renderer.width,i=game.renderer.height;gameContainer.scale.x=camera.scale,gameContainer.scale.y=camera.scale,gameContainer.x=t/2-camera.x*camera.scale,gameContainer.y=i/2-camera.y*camera.scale,e||this.followingTransform&&(this.followX&&camera.followingTransform.getX()-camera.x!=0&&(this.x+=(this.followingTransform.getX()-camera.x)*this.followPercent/100),this.followY&&camera.followingTransform.getY()-camera.y!=0&&(this.y+=(this.followingTransform.getY()-camera.y)*this.followPercent/100))}},gm.position=function(){this.scaleXFunctions={},this.scaleYFunctions={},this.container=new PIXI.Container,this.isGuiElement=!1,this.rightAligned=!1,this.centerAligned=!1,this.drawAtInteger=!1,this.getZorder=function(){var e="1";return this.isGuiElement&&(e="2"),e+this.zOrder.padLeft(10)+this.gameObject.name.value},this.parent="";var e=this;return newObservable(this,"parent",void 0,function(){e.x=e.x,e.y=e.y,e.rotation=e.rotation},function(t,i){if(parents[e.gameObject.name.value]=i,i&&(childrenGameObject[i]||(childrenGameObject[i]=new Array),childrenGameObject[i].push(e.gameObject.name.value)),t&&childrenGameObject[t]){var n=childrenGameObject[t].indexOf(e.gameObject.name.value);-1!=n&&childrenGameObject[t].splice(n,1)}e.isGuiElement=e.isGuiElement}),this.childrenGameObject=new Array,this.x=0,this.y=0,this.zOrder=0,this.width=32,this.height=32,this.scaleX=1,this.scaleY=1,this.rotation=0,this.centerx=.5,this.centery=.5,this.worksInEditor=!0,this.dragging=!1,this.prefabName="",this.prePosition=void 0,this.parentContainer=void 0,this.private={dragging:!0,parent:!0,prefabName:!0,prePosition:!0},this.reloadInEditor={isGuiElement:!0},this.isCollidingScreen=function(e,t){for(var i=0;i<this.container.children.length;i++)if(void 0!=this.container.children[i].containsPoint)return this.container.children[i].containsPoint({x:e,y:t});return e-=camera.x,t-=camera.y,(this.getScreenX()+this.width*(1-this.centerx))*camera.scale>e&&(this.getScreenX()-this.width*this.centerx)*camera.scale<e&&(this.getScreenY()+this.height*(1-this.centery))*camera.scale>t&&(this.getScreenY()-this.height*this.centery)*camera.scale<t},this.init=function(e){this.centerx=this.centerx,this.centery=this.centery,this.width=this.width,this.height=this.height},this.customDiv={centerMe:function(e){var t=this;addMenu("Zero",function(){t.x=0,t.y=0,socketemit("gameobject",{action:"change",name:t.gameObject.name.value,plugin:"position",newval:{x:t.x,y:t.y}})},"",e,""),addMenu("Center",function(){t.x=game.renderer.width/2,t.y=game.renderer.height/2,socketemit("gameobject",{action:"change",name:t.gameObject.name.value,plugin:"position",newval:{x:t.x,y:t.y}})},"",e,"")}},this.create=function(){void 0!=this.parent&&""!=this.parent?this.parentContainer=objects[this.parent].position.container:this.isGuiElement?(this.parentContainer=guiContainer,this.private.rightAligned=!1,this.private.centerAligned=!1):(this.parentContainer=gameContainer,this.private.rightAligned=!0,this.private.centerAligned=!0),this.parentContainer.addChild(this.container);var e=this;newObservable(this,"x",void 0,function(){e.isGuiElement&&(e.rightAligned||e.centerAligned)||(e.container.x=e.x,1==e.drawAtInteger?e.container.x=parseInt(e.x):e.container.x=e.x)})(),newObservable(this,"y",void 0,function(){1==e.drawAtInteger?e.container.y=parseInt(e.y):e.container.y=e.y})(),newObservable(this,"scaleX",void 0,function(){e.container.scale.x=e.scaleX;for(var t in e.scaleXFunctions)e.scaleXFunctions[t]()})(),newObservable(this,"scaleY",void 0,function(){e.container.scale.y=e.scaleY;for(var t in e.scaleYFunctions)e.scaleYFunctions[t]()})(),newObservable(this,"width",void 0,function(){for(var t=0;t<e.container.children.length;t++)0==e.container.children[t].children.length&&(e.container.children[t].width=e.width)})(),newObservable(this,"height",void 0,function(){for(var t=0;t<e.container.children.length;t++)0==e.container.children[t].children.length&&(e.container.children[t].height=e.height)})(),newObservable(this,"rotation",void 0,function(){e.container.rotation=e.rotation*Math.PI/180})(),newObservable(this,"zOrder",void 0,function(){e.container.zOrder=parseFloat(e.zOrder),e.parentContainer.children=e.parentContainer.children.sort(function(e,t){return t.zOrder<e.zOrder?1:-1})})(),newObservable(this,"centerx",void 0,function(){for(var t=0;t<e.container.children.length;t++)void 0!=e.container.children[t].anchor&&(e.container.children[t].anchor.x=e.centerx)})(),newObservable(this,"centery",void 0,function(){for(var t=0;t<e.container.children.length;t++)void 0!=e.container.children[t].anchor&&(e.container.children[t].anchor.y=e.centery)})(),INEDITOR&&(newObservable(this,"prefabName",void 0,function(){selectedSprite==this.gameObject&&reDrawPanel(selectedSprite)}),this.clickMe=function(){if(0==gameMouseAction&&!lockedSelection&&void 0==selectedPrefab()){selectedSprite=this.gameObject;var e=goBack(selectedSprite);socketemit("selectgameobject",e)}},this.dragDisabled=function(){return 0!=gameMouseAction||lockedSelection||selectedSprite!=this.gameObject},this.dragStart=function(e,t){var i=goBack(selectedSprite);socketemit("selectgameobject",i)},this.drag=function(e,t){},this.dragStop=function(e,t){var i=goBack(selectedSprite);socketemit("gameobject",{action:"change",name:i.name.value,plugin:"position",newval:{x:i.position.x,y:i.position.y}})},this.graphics=new PIXI.Graphics),this.rightAlignedGUI()},this.dispose=function(){this.parentContainer.removeChild(this.container),INEDITOR&&selectedSprite==this.gameObject&&(this.container.removeChild(this.graphics),delete this.graphics,selectedSprite=void 0,$("#gameproperties").html(""))},this.render=function(){this.rightAlignedGUI(),INEDITOR&&(this.container.removeChild(this.graphics),delete this.graphics,this.graphics=new PIXI.Graphics,selectedSprite==this.gameObject&&DrawBox(0,0,this.width,this.height,0,this.graphics,this.centerx,this.centery,16767232,1,!1,this.container))},this.move=function(){},this.rightAlignedGUI=function(){if(this.isGuiElement&&this.rightAligned){e=game.renderer.width/(guiContainer.scale.x*this.getScaleX());this.container.x!=this.x+e&&(this.container.x=this.x+e)}if(this.isGuiElement&&this.centerAligned){var e=game.renderer.width/(guiContainer.scale.x*this.getScaleX()*2);this.container.x!=this.x+e&&(this.container.x=this.x+e)}},this.update=function(){},this.getScaleX=function(){return this.parent?parseFloat(this.scaleX)*objects[this.parent].position.getScaleX():parseFloat(this.scaleX)},this.getScaleY=function(){return this.parent?parseFloat(this.scaleY)*objects[this.parent].position.getScaleY():parseFloat(this.scaleY)},this.getParentScaleX=function(){return this.parent?objects[this.parent].position.getScaleX():1},this.getParentScaleY=function(){return this.parent?objects[this.parent].position.getScaleY():1},this.getRotation=function(){return this.parent?parseFloat(this.rotation)*Math.PI/180+objects[this.parent].position.getRotation():parseFloat(this.rotation)*Math.PI/180},this.getUnrotationalX=function(){if(this.parent){var e=parseFloat(this.x);objects[this.parent].position.getX();return e+rotationalX}return parseFloat(this.x)},this.getUnrotationalY=function(){if(this.parent){var e=parseFloat(this.y);objects[this.parent].position.getY();return e+rotationalY}return parseFloat(this.y)},this.getX=function(){if(this.parent){var e=parseFloat(this.x)*this.getParentScaleX(),t=objects[this.parent].position.getX(),i=e,n=objects[this.parent].position.getRotation();if(0!=n){var r=parseFloat(this.y),a=Math.sqrt(e*e+r*r),o=Math.atan2(r,e);i=a*Math.cos(o+n)}return t+i}return parseFloat(this.x)},this.getY=function(){if(this.parent){var e=parseFloat(this.y)*this.getParentScaleY(),t=objects[this.parent].position.getY(),i=e,n=objects[this.parent].position.getRotation();if(0!=n){var r=parseFloat(this.x),a=Math.sqrt(r*r+e*e),o=Math.atan2(e,r);i=a*Math.sin(o+n)}return t+i}return parseFloat(this.y)},this.getScreenX=function(){return this.getX()},this.getScreenY=function(){return this.getY()},this};var tags={};gm.name=function(){this.value="",this.tagName="";var e=this;return newObservable(this,"tagName",void 0,function(){},function(t,i){if(void 0!=tags[t]){var n=tags[t].indexOf(e.gameObject);-1!=n&&tags[t].splice(n,1)}void 0==tags[i]&&(tags[i]=new Array),tags[i].push(e.gameObject)}),this.dispose=function(){var t=this.tagName;if(void 0!=tags[t]){var i=tags[t].indexOf(e.gameObject);-1!=i&&tags[t].splice(i,1)}},this};