function AddPolygonShapeToBody(t,e,i,s,o){var a=new box2d.b2PolygonShape;if(t.length>box2d.b2_maxPolygonVertices){var r=t.splice(0,t.length-box2d.b2_maxPolygonVertices),h=new box2d.b2Vec2;h.Copy(t[t.length-1]),r.splice(0,0,h);var c=new box2d.b2Vec2;c.Copy(t[0]),r.push(c),AddPolygonShapeToBody(r,e,i,s,o)}if(a.Set(t,t.length),s)o.pd.position=new box2d.b2Vec2(o.gameObject.position.getX(),o.gameObject.position.getY()),o.pd.shape=a,o.group=o.m_particleSystem.CreateParticleGroup(o.pd);else{var n=new box2d.b2FixtureDef;n.density=e,n.shape=a,i.CreateFixture(n)}}var mousedown;function getGameObject(t){return objects[t.gameObjectName]}window.PhysicsInitialized=!1,console.log("using box2d"),gm.Physics=function(){if(this.isLiquid=!1,this.maxParticleInOneFrame=50,this.particleRadius=5,this.particleType=box2d.b2ParticleFlag.b2_waterParticle,this.particleImage="",this.particleImageShadow=5,this.particleImageShadows=[],this.particleImageWidth=16,this.debugDraw=!1,this.fillColor="FFFFFF",this.lineColor="000000",this.reloadInEditor={reloadME:!0},this.reloadME=0,this.previousType=void 0,this.worksInEditor=!0,this.dontSerialize={Editing:!0,reloadME:!0,selectedVerticesIndex:!0},this.serializeObject={vertices:!0},this.comboBoxes={colliderType:["box","circle","polygon","concave"],particleType:[{text:"Water",value:box2d.b2ParticleFlag.b2_waterParticle},{text:"Spring",value:box2d.b2ParticleFlag.b2_springParticle},{text:"Elastic",value:box2d.b2ParticleFlag.b2_elasticParticle},{text:"Viscous",value:box2d.b2ParticleFlag.b2_viscousParticle},{text:"Tensile",value:box2d.b2ParticleFlag.b2_tensileParticle},{text:"Wall",value:box2d.b2ParticleFlag.b2_wallParticle}]},"assetList"in window){this.comboBoxes.particleImage=new Array;for(var t=0;t<assetList.length;t++)0==assetList[t].isFolder&&(isImage(assetList[t].name)||assetList[t].name.endsWith(".anim"))&&this.comboBoxes.particleImage.push({text:assetList[t].name,value:assetList[t].name})}this.colliderType="box",this.private={preX:!0,preY:!0,preRot:!0,angle:!0,Editing:!0,reloadME:!0},this.radius=1,this.width=0,this.height=0,this.damping=.1,this.friction=0,this.restitution=0,this.density=5,this.preX=0,this.preY=0,this.preRot=0,this.static=!1,this.isLiquid=!1,this.isSensor=!1,this.isBullet=!1,this.fixedRotation=!1,this.angle=0,this.Editing=!1,this.bodyDifference={x:0,y:0},this.vertices=[{x:-50,y:-50},{x:50,y:-50,c:65280},{x:50,y:50},{x:-50,y:50}],this.resetBox=function(){this.width=this.gameObject.position.width,this.height=this.gameObject.position.height,this.colliderType="box",this.vertices=[{x:-50,y:-50},{x:50,y:-50,c:65280},{x:0,y:50}];var t=goBack(this.gameObject);socketemit("gameobject",{action:"change",name:this.gameObject.name.value,plugin:"Physics",newval:t.Physics})},this.customDiv={centerMe:function(t){var e=this;addMenu("Reset BOX",function(){e.resetBox()},"",t,""),addMenu("Edit",function(){if($(".btnPhysicsEdit").removeClass("btn-danger"),1!=e.Editing)e.Editing=!0,lockedSelection=!0,$(".btnPhysicsEdit").html("Stop"),$(".btnPhysicsEdit").addClass("btn-danger");else{lockedSelection=!1,e.Editing=!1,$(".btnPhysicsEdit").html("Edit");var t=goBack(e.gameObject);socketemit("gameobject",{action:"change",name:e.gameObject.name.value,plugin:"Physics",newval:t.Physics})}},"",t,"btnPhysicsEdit"),1==this.Editing&&($(".btnPhysicsEdit").html("Stop"),$(".btnPhysicsEdit").addClass("btn-danger"))}}},gm.Physics.prototype.editorPrivates=function(){if(this.private.selectedVerticesIndex=!0,this.isLiquid?(this.private.friction=!0,this.private.restitution=!0,this.private.static=!0,this.private.isSensor=!0,this.private.isBullet=!0,this.private.fixedRotation=!0,this.private.debugDraw=!0,this.debugDraw=!1,this.private.particleRadius=!1,this.private.particleType=!1,this.private.particleImage=!1,this.private.particleImageWidth=!1,this.private.particleImageShadow=!1,this.private.maxParticleInOneFrame=!1):(this.private.friction=!1,this.private.restitution=!1,this.private.static=!1,this.private.isSensor=!1,this.private.isBullet=!1,this.private.fixedRotation=!1,this.private.debugDraw=!1,this.private.particleRadius=!0,this.private.particleType=!0,this.private.particleImage=!0,this.private.particleImageWidth=!0,this.private.particleImageShadow=!0,this.private.maxParticleInOneFrame=!0),"box"==this.colliderType){if(this.private.radius=!0,this.private.width=!1,this.private.height=!1,selectedSprite==this.gameObject){var t=goBack(selectedSprite);socketemit("selectgameobject",t)}}else if("circle"==this.colliderType){if(this.private.width=!0,this.private.height=!0,this.private.radius=!1,selectedSprite==this.gameObject){t=goBack(selectedSprite);socketemit("selectgameobject",t)}}else if(("polygon"==this.colliderType||"concave"==this.colliderType)&&(this.private.width=!0,this.private.height=!0,this.private.radius=!0,selectedSprite==this.gameObject)){t=goBack(selectedSprite);socketemit("selectgameobject",t)}},gm.Physics.prototype.createBody=function(){if(this.isLiquid){var t=new box2d.b2ParticleSystemDef;this.m_particleSystem=world.CreateParticleSystem(t),this.m_particleSystem.SetDensity(this.density),this.m_particleSystem.SetRadius(this.particleRadius),this.m_particleSystem.SetDamping(this.damping),this.pd=new box2d.b2ParticleGroupDef,this.pd.flags=this.particleType}switch(this.colliderType){case"box":if((e=new box2d.b2PolygonShape).SetAsBox(this.width*Math.abs(this.gameObject.position.scaleX)/2,this.height*Math.abs(this.gameObject.position.scaleY)/2,new box2d.b2Vec2,0),this.isLiquid)this.pd.position=new box2d.b2Vec2(this.gameObject.position.getX(),this.gameObject.position.getY()),this.pd.shape=e,this.group=this.m_particleSystem.CreateParticleGroup(this.pd);else(i=new box2d.b2FixtureDef).density=this.density,i.shape=e,this.body.CreateFixture(i);break;case"circle":var e,i;if((e=new box2d.b2CircleShape).m_p.Copy(new box2d.b2Vec2(0,0)),e.m_radius=this.radius*this.gameObject.position.scaleX,this.isLiquid)this.pd.position=new box2d.b2Vec2(this.gameObject.position.getX(),this.gameObject.position.getY()),this.pd.shape=e,this.group=this.m_particleSystem.CreateParticleGroup(this.pd);else(i=new box2d.b2FixtureDef).density=this.density,i.shape=e,this.body.CreateFixture(i);break;case"polygon":for(var s=box2d.b2Vec2.MakeArray(this.vertices.length),o=0;o<this.vertices.length;o++)s[o].Set(this.vertices[o].x*this.gameObject.position.scaleX,this.vertices[o].y*this.gameObject.position.scaleY);AddPolygonShapeToBody(s,this.density,this.body,this.isLiquid,this);break;case"concave":for(s=[],o=0;o<this.vertices.length;o++)s[o]=[this.vertices[o].x,this.vertices[o].y];decomp.makeCCW(s);var a=decomp.quickDecomp(s);for(o=0;o<a.length;o++){for(var r=box2d.b2Vec2.MakeArray(a[o].length),h=0;h<a[o].length;h++)r[h].Set(a[o][h][0]*this.gameObject.position.scaleX,a[o][h][1]*this.gameObject.position.scaleY);AddPolygonShapeToBody(r,this.density,this.body,this.isLiquid,this)}}this.isLiquid||(this.body.gameObjectName=this.gameObject.name.value)},gm.Physics.prototype.changeAttributes=function(){var e=this;function t(t){t.isBullet?t.body.SetType(box2d.b2BodyType.b2_bulletBody):t.static?t.body.SetType(box2d.b2BodyType.b2_staticBody):t.body.SetType(box2d.b2BodyType.b2_dynamicBody)}newObservable(this,"colliderType",void 0,function(){e.reloadME++}),newObservable(this,"isBullet",void 0,function(){t(e)}),newObservable(this,"static",void 0,function(){t(e)})(),newObservable(this,"isSensor",void 0,function(){e.body.m_fixtureList.SetSensor(e.isSensor)})(),newObservable(this,"friction",void 0,function(){e.body.m_fixtureList.SetFriction(e.friction)})(),newObservable(this,"restitution",void 0,function(){e.body.m_fixtureList.SetRestitution(e.restitution)})(),newObservable(this,"density",void 0,function(){e.reloadME++}),newObservable(this,"fixedRotation",void 0,function(){e.body.SetFixedRotation(!1)})(),newObservable(this,"debugDraw",void 0,function(){e.reloadME++})(),newObservable(this,"velocityY",void 0,function(){var t=e.body.GetLinearVelocity();e.body.SetLinearVelocity(new box2d.b2Vec2(t.x,e.velocityY))})(),newObservable(this,"velocityX",void 0,function(){var t=e.body.GetLinearVelocity();e.body.SetLinearVelocity(new box2d.b2Vec2(e.velocityX,t.y))})(),newObservable(this,"damping",void 0,function(){e.body.m_linearDamping=parseFloat(e.damping)})()},gm.Physics.prototype.create=function(){if(INEDITOR){0==this.width&&0==this.height&&"box"==this.colliderType&&this.resetBox();e=this;newObservable(this,"colliderType",void 0,function(){e.editorPrivates()})(),newObservable(this,"isLiquid",void 0,function(){e.editorPrivates()})(),newObservable(this,"debugDraw",void 0,function(){if(e.debugDraw?(e.private.fillColor=!1,e.private.lineColor=!1):(e.private.fillColor=!0,e.private.lineColor=!0),selectedSprite==e.gameObject){var t=goBack(selectedSprite);socketemit("selectgameobject",t)}})(),this.selectedVerticesIndex=-1,this.mouseDown=function(t,e){if(this.selectedVerticesIndex=-1,selectedSprite==this.gameObject&&this.Editing){for(var i=0;i<this.vertices.length;i++)delete this.vertices[i].c;for(i=0;i<this.vertices.length;i++){var s=this.vertices[i],o=t.x-s.x-this.gameObject.position.x,a=t.y-s.y-this.gameObject.position.y;Math.sqrt(o*o+a*a)<16&&(s.c=65280,this.selectedVerticesIndex=i)}if(-1==this.selectedVerticesIndex)for(i=0;i<this.vertices.length;i++){var r,h=this.vertices[i];r=i==this.vertices.length-1?this.vertices[0]:this.vertices[i+1];var c=t.x-h.x-this.gameObject.position.x,n=t.y-h.y-this.gameObject.position.y,l=t.x-r.x-this.gameObject.position.x,d=t.y-r.y-this.gameObject.position.y,p=(o=h.x-r.x,a=h.y-r.y,Math.sqrt(o*o+a*a)),b=Math.sqrt(c*c+n*n),g=Math.sqrt(l*l+d*d);if(Math.abs(b+g-p)<16){var m={x:parseInt(t.x-this.gameObject.position.x),y:parseInt(t.y-this.gameObject.position.y),c:65280};return this.vertices.splice(i+1,0,m),void(this.selectedVerticesIndex=i+1)}}}},this.mouseMove=function(t,e){selectedSprite==this.gameObject&&this.Editing&&-1<this.selectedVerticesIndex&&(this.vertices[this.selectedVerticesIndex].x=parseInt(t.x-this.gameObject.position.x),this.vertices[this.selectedVerticesIndex].y=parseInt(t.y-this.gameObject.position.y))},this.mouseUp=function(t,e){this.selectedVerticesIndex=-1},this.graphics=new PIXI.Graphics}else{if(this.isLiquid&&(this.liquidContainer=new PIXI.ParticleContainer,this.liquidContainer.zOrder=999,gameContainer.addChild(this.liquidContainer)),world.IsLocked()&&(world.m_flag_locked=!1),!this.isLiquid){var e=this;this.gameObject.position.scaleXFunctions.Physics=function(){e.reloadME++},this.gameObject.position.scaleYFunctions.Physics=function(){e.reloadME++};var t=new box2d.b2BodyDef;this.body=world.CreateBody(t),this.body.SetPosition(new box2d.b2Vec2(this.gameObject.position.getX(),this.gameObject.position.getY())),this.preX=this.gameObject.position.getX(),this.preY=this.gameObject.position.getY(),this.body.SetAngle(this.gameObject.position.rotation*Math.PI/180)}if(this.createBody(),this.isLiquid||this.changeAttributes(),this.graphics=new PIXI.Graphics,this.debugDraw){var i=parseInt("0x"+this.fillColor),s=parseInt("0x"+this.lineColor);this.graphics.beginFill(i,1),"box"==this.colliderType&&(DrawBox(0,0,this.width,this.height,0,this.graphics,.5,.5,s,1,!0,this.gameObject.position.container,!0),this.gameObject.position.container.addChild(this.graphics)),"circle"==this.colliderType&&DrawCircle(0,0,this.radius,0,this.graphics,.5,.5,s,1,this.gameObject.position.container,!0),"polygon"!=this.colliderType&&"concave"!=this.colliderType||DrawPolygon(0,0,this.vertices,0,this.graphics,s,1,!1,this.gameObject.position.container),this.graphics.endFill()}}},gm.Physics.prototype.update=function(t){if(!INEDITOR)if(this.isLiquid)for(var e=0,i=this.m_particleSystem.m_positionBuffer.data,s=0;s<this.m_particleSystem.m_count;s++)if(1<this.particleImageShadow){var o=this.particleImageShadows[s];null==o&&(this.particleImageShadows[s]=new Array,o=this.particleImageShadows[s]);for(var a=0;a<o.length;a++)o[a].g.width=this.particleImageWidth*(.3*a),o[a].g.height=this.particleImageWidth*(.3*a);var r={},h=!1;if(o.length>this.particleImageShadow){r=o.splice(0,1)[0];o.push(r)}else if((r={g:new PIXI.Sprite(resources[this.particleImage].texture)}).g.anchor.x=.5,r.g.anchor.y=.5,o.push(r),h=!0,++e>=this.maxParticleInOneFrame)return;r.g.x=i[s].x,r.g.y=i[s].y,r.g.width=this.particleImageWidth,r.g.height=this.particleImageWidth,h&&this.liquidContainer.addChild(r.g)}else{var c=this.liquidContainer.children[s];null==c&&((c=new PIXI.Sprite(resources[this.particleImage].texture)).width=this.particleImageWidth,c.height=this.particleImageWidth,this.liquidContainer.addChild(c)),c.x=i[s].x,c.y=i[s].y}else{var n=this.gameObject.position.getParentScaleX(),l=this.gameObject.position.getParentScaleY(),d=0,p=0;this.gameObject.position.parent&&(d=objects[this.gameObject.position.parent].position.getX()),this.gameObject.position.parent&&(p=objects[this.gameObject.position.parent].position.getY());var b=this.body.GetPosition(),g=this.body.GetAngle(),m=!1;if(this.gameObject.position.getX()==this.preX)this.gameObject.position.x=b.x/n-d;else{m=!0;var y=this.gameObject.position.getX();this.body.SetPosition(new box2d.b2Vec2(y,b.y)),b.x=y}this.gameObject.position.getY()==this.preY?this.gameObject.position.y=b.y/l-p:(this.body.SetPosition(new box2d.b2Vec2(b.x,this.gameObject.position.getY())),m=!0),this.gameObject.position.rotation==this.preRot?this.gameObject.position.rotation=180*g/Math.PI:(this.body.SetAngle(this.gameObject.position.rotation*Math.PI/180),m=!0),this.preX=this.gameObject.position.getX(),this.preY=this.gameObject.position.getY(),this.preRot=this.gameObject.position.rotation,m&&this.body.SetAwake(!0)}if(INEDITOR){if(this.gameObject.position.container.removeChild(this.graphics),delete this.graphics,this.graphics=new PIXI.Graphics,this.graphics.beginFill(16724736,.01),"box"==this.colliderType&&DrawBox(0,0,this.width,this.height,0,this.graphics,.5,.5,16711680,.6,!1,this.gameObject.position.container),"circle"==this.colliderType&&DrawCircle(0,0,this.radius,0,this.graphics,.5,.5,16711680,.6,this.gameObject.position.container),("polygon"==this.colliderType||"concave"==this.colliderType)&&(DrawPolygon(0,0,this.vertices,0,this.graphics,16711680,.6,!0,this.gameObject.position.container),this.Editing&&null!=lastKey&&46==lastKey.keyCode)){lastKey=void 0;var v=new Array;for(s=0;s<this.vertices.length;s++)null==this.vertices[s].c&&v.push(this.vertices[s]);this.vertices=v}this.graphics.endFill()}},gm.Physics.prototype.dispose=function(){world.IsLocked()&&(world.m_flag_locked=!1),this.body&&world.DestroyBody(this.body),this.isLiquid&&(gameContainer.removeChild(this.liquidContainer),world.DestroyParticleSystem(this.m_particleSystem)),this.graphics&&(this.gameObject.position.container.removeChild(this.graphics),delete this.graphics)},gm.revoluteConstraint=function(){this.requires="Physics",this.reloadInEditor={otherGameObjectName:!0,AnchorX:!0,AnchorY:!0,motorSpeed:!0},this.otherGameObjectName="",this.AnchorX=0,this.AnchorY=0},gm.revoluteConstraint.prototype.afterCreate=function(){world.IsLocked()&&(world.m_flag_locked=!1);var t=new box2d.b2RevoluteJointDef;other=objects[this.otherGameObjectName].Physics.body,t.Initialize(this.gameObject.Physics.body,other,new box2d.b2Vec2(this.AnchorX+objects[this.otherGameObjectName].position.x,this.AnchorY+objects[this.otherGameObjectName].position.y)),t.collideConnected=!1,this.revolute=world.CreateJoint(t)},gm.revoluteConstraint.prototype.dispose=function(){try{world.IsLocked()&&(world.m_flag_locked=!1),world.DestroyJoint(this.revolute)}catch(t){}};