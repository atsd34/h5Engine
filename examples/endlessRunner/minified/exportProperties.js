var currentSceneName="cave2.scene",data={GO:{Director:{name:{value:"Director"},sprite:{path:""},position:{x:0,y:0,parent:""},Director:{score:0},Sound:{path:"hop.mp3",autoPlay:!1,Loop:!1,volume:100},Achievments:{}},Main:{name:{value:"Main",tagName:"",__initialized:!0},position:{isGuiElement:!1,parent:"",x:-74,y:209,zOrder:0,width:64,height:64,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,worksInEditor:!0,dragging:!1,prefabName:"Main",__isDragging:!1,__initialized:!0},Main:{grounded:0,vSpeed:600},Physics:{debugDraw:!1,fillColor:"FFFFFF",lineColor:"000000",colliderType:"circle",radius:64,width:128,height:128,damping:.2,friction:0,restitution:0,physicsMaterial:"default",density:5,preX:0,preY:0,preRot:0,static:!1,isSensor:!1,isBullet:!1,fixedRotation:!1,angle:0,vertices:[{x:-8,y:-45},{x:16,y:-45},{x:60,y:-45},{x:42,y:-28},{x:52,y:3},{x:59,y:29},{x:35,y:39},{x:51,y:71},{x:-39,y:70},{x:-25,y:45},{x:-49,y:21,c:65280},{x:-47,y:-4},{x:-38,y:-25},{x:-51,y:-39},{x:-35,y:-51},{x:-31,y:-32}]},Sound:{path:"step1.mp3",autoPlay:!1,Loop:!1,volume:20}},FrontLeg:{name:{value:"FrontLeg"},sprite:{path:"mainsprites\\leg.png"},position:{x:-16.25,y:37,parent:"MainSprite0",width:29,height:29,zOrder:1,rotation:0,centerx:.35,centery:.1}},BackLeg:{name:{value:"BackLeg"},sprite:{path:"mainsprites\\leg.png"},position:{x:20.92728163984465,y:32.83396793684838,parent:"MainSprite0",width:32,height:36,zOrder:-1,rotation:0,centerx:.35,centery:.1}},Torso:{name:{value:"Torso"},sprite:{path:"mainsprites\\torso.png"},position:{x:-.018179590038836957,y:-1.0415080157879077,parent:"MainSprite0",width:129,height:130,zOrder:0,rotation:0}},MainSprite0:{name:{value:"MainSprite0"},position:{x:0,y:0,parent:"Main",scaleX:1,scaleY:1,width:128,height:128,rotation:1},objectAnimator:{timeLine:{walk:{Name:"walk","Number Of Frames":10,FPS:30,Animation:[{FrontLeg:{position:{rotation:"1",y:"37"}},BackLeg:{position:{rotation:"1",y:"37"}}},null,null,{BackLeg:{position:{rotation:"-30"}},FrontLeg:{position:{rotation:"30"}}},null,null,{FrontLeg:{position:{rotation:"-30"}},BackLeg:{position:{rotation:"30"}}},null,null,{BackLeg:{position:{rotation:"5"}},FrontLeg:{position:{rotation:"-5"}}}],calculatedAnimation:[{FrontLeg:{position:{rotation:1,y:37}},BackLeg:{position:{rotation:1,y:37}}},{BackLeg:{position:{rotation:-9.333333333333332}},FrontLeg:{position:{rotation:10.666666666666666}}},{BackLeg:{position:{rotation:-19.666666666666664}},FrontLeg:{position:{rotation:20.333333333333332}}},{BackLeg:{position:{rotation:-30}},FrontLeg:{position:{rotation:30}}},{FrontLeg:{position:{rotation:10}},BackLeg:{position:{rotation:-10}}},{FrontLeg:{position:{rotation:-10}},BackLeg:{position:{rotation:10}}},{FrontLeg:{position:{rotation:-30}},BackLeg:{position:{rotation:30}}},{BackLeg:{position:{rotation:21.666666666666668}},FrontLeg:{position:{rotation:-21.666666666666668}}},{BackLeg:{position:{rotation:13.333333333333336}},FrontLeg:{position:{rotation:-13.333333333333336}}},{BackLeg:{position:{rotation:5}},FrontLeg:{position:{rotation:-5}}},{FrontLeg:{position:{rotation:-5,y:37}},BackLeg:{position:{rotation:5,y:37}}}]},jump:{Name:"jump","Number Of Frames":10,FPS:60,Animation:[{FrontLeg:{position:{y:"37",rotation:"0"}},BackLeg:{position:{y:"37",rotation:"0"}}},null,null,null,null,null,null,null,null,{BackLeg:{position:{rotation:"40",y:"27"}},FrontLeg:{position:{rotation:"40",y:"27"}}}],calculatedAnimation:[{FrontLeg:{position:{y:37,rotation:0}},BackLeg:{position:{y:37,rotation:0}}},{BackLeg:{position:{rotation:4.444444444444445,y:35.888888888888886}},FrontLeg:{position:{rotation:4.444444444444445,y:35.888888888888886}}},{BackLeg:{position:{rotation:8.88888888888889,y:34.77777777777778}},FrontLeg:{position:{rotation:8.88888888888889,y:34.77777777777778}}},{BackLeg:{position:{rotation:13.333333333333332,y:33.666666666666664}},FrontLeg:{position:{rotation:13.333333333333332,y:33.666666666666664}}},{BackLeg:{position:{rotation:17.77777777777778,y:32.55555555555556}},FrontLeg:{position:{rotation:17.77777777777778,y:32.55555555555556}}},{BackLeg:{position:{rotation:22.22222222222222,y:31.444444444444443}},FrontLeg:{position:{rotation:22.22222222222222,y:31.444444444444443}}},{BackLeg:{position:{rotation:26.666666666666664,y:30.333333333333336}},FrontLeg:{position:{rotation:26.666666666666664,y:30.333333333333336}}},{BackLeg:{position:{rotation:31.11111111111111,y:29.22222222222222}},FrontLeg:{position:{rotation:31.11111111111111,y:29.22222222222222}}},{BackLeg:{position:{rotation:35.55555555555556,y:28.11111111111111}},FrontLeg:{position:{rotation:35.55555555555556,y:28.11111111111111}}},{BackLeg:{position:{rotation:40,y:27}},FrontLeg:{position:{rotation:40,y:27}}},{FrontLeg:{position:{y:27,rotation:40}},BackLeg:{position:{y:27,rotation:40}}}]},swingback:{Name:"swingback","Number Of Frames":10,FPS:60,Animation:[{MainSprite0:{position:{}},BackLeg:{position:{y:"36"}},FrontLeg:{position:{y:"36"}}},null,null,{FrontLeg:{position:{rotation:"-30"}},BackLeg:{position:{rotation:"-30"}}},null,null,null,null,null,{BackLeg:{position:{rotation:"40"}},FrontLeg:{position:{rotation:"40"}}}],calculatedAnimation:[{BackLeg:{position:{y:36,rotation:-30}},FrontLeg:{position:{y:36,rotation:-30}}},{FrontLeg:{position:{rotation:-30}},BackLeg:{position:{rotation:-30}}},{FrontLeg:{position:{rotation:-30}},BackLeg:{position:{rotation:-30}}},{FrontLeg:{position:{rotation:-30}},BackLeg:{position:{rotation:-30}}},{BackLeg:{position:{rotation:-18.333333333333336}},FrontLeg:{position:{rotation:-18.333333333333336}}},{BackLeg:{position:{rotation:-6.666666666666668}},FrontLeg:{position:{rotation:-6.666666666666668}}},{BackLeg:{position:{rotation:5}},FrontLeg:{position:{rotation:5}}},{BackLeg:{position:{rotation:16.666666666666664}},FrontLeg:{position:{rotation:16.666666666666664}}},{BackLeg:{position:{rotation:28.333333333333336}},FrontLeg:{position:{rotation:28.333333333333336}}},{BackLeg:{position:{rotation:40}},FrontLeg:{position:{rotation:40}}},{BackLeg:{position:{y:36,rotation:40}},FrontLeg:{position:{y:36,rotation:40}}}]},swingforward:{Name:"swingforward","Number Of Frames":10,FPS:60,Animation:[{FrontLeg:{position:{y:"37"}},BackLeg:{position:{y:"37"}}},null,null,{FrontLeg:{position:{rotation:"30"}},BackLeg:{position:{rotation:"30"}}},null,null,null,null,null,{BackLeg:{position:{rotation:"-40"}},FrontLeg:{position:{rotation:"-40"}}}],calculatedAnimation:[{FrontLeg:{position:{y:37,rotation:30}},BackLeg:{position:{y:37,rotation:30}}},{FrontLeg:{position:{rotation:30}},BackLeg:{position:{rotation:30}}},{FrontLeg:{position:{rotation:30}},BackLeg:{position:{rotation:30}}},{FrontLeg:{position:{rotation:30}},BackLeg:{position:{rotation:30}}},{BackLeg:{position:{rotation:18.333333333333336}},FrontLeg:{position:{rotation:18.333333333333336}}},{BackLeg:{position:{rotation:6.666666666666668}},FrontLeg:{position:{rotation:6.666666666666668}}},{BackLeg:{position:{rotation:-5}},FrontLeg:{position:{rotation:-5}}},{BackLeg:{position:{rotation:-16.666666666666664}},FrontLeg:{position:{rotation:-16.666666666666664}}},{BackLeg:{position:{rotation:-28.333333333333336}},FrontLeg:{position:{rotation:-28.333333333333336}}},{BackLeg:{position:{rotation:-40}},FrontLeg:{position:{rotation:-40}}},{FrontLeg:{position:{y:37,rotation:-40}},BackLeg:{position:{y:37,rotation:-40}}}]}},playedLoop:0,currentFrame:5,loopCount:-1,playOnStart:"",extraTime:30.999999999997677},MainSprite:{}},GUI:{name:{value:"GUI"},sprite:{path:""},position:{x:0,y:0,parent:"",isGuiElement:!0,width:172,height:74,centerx:0,centery:0,prefabName:"GUI"},text:{text:"score",fontSize:"64",fontFamily:"Arial",fontStyle:"italic",fontWeight:"bold",fill:"['#ffffff']",stroke:"#000000",strokeThickness:1,dropShadows:!1,ShadowColor:"#666666",dropShadowBlur:50,dropShadowAngle:90,dropShadowDistance:7,wordWrap:!0,wordWrapWidth:440,worksInEditor:!0}},Tip2:{name:{value:"Tip2",tagName:""},position:{isGuiElement:!1,parent:"",x:2157.857142857143,y:219.82142857142873,zOrder:-1,width:378,height:222,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:"Tip1"},text:{text:"",fontSize:"64",fontFamily:"Arial",fontStyle:"italic",fontWeight:"bold",fill:"['#ffffff']",stroke:"#000000",strokeThickness:1,dropShadows:!1,ShadowColor:"#000000",dropShadowBlur:6,dropShadowAngle:90,dropShadowDistance:7,wordWrap:!0,wordWrapWidth:440}},Tip3:{name:{value:"Tip3"},position:{x:3467.857142857143,y:222.32142857142867,parent:"",width:362,height:222,prefabName:"Tip1",zOrder:-1},text:{text:"",fontSize:"64",fontFamily:"Arial",fontStyle:"italic",fontWeight:"bold",fill:"['#ffffff']",stroke:"#000000",strokeThickness:1,dropShadows:!1,ShadowColor:"#000000",dropShadowBlur:6,dropShadowAngle:90,dropShadowDistance:7,wordWrap:!0,wordWrapWidth:440}},Tip1:{name:{value:"Tip1",tagName:""},position:{isGuiElement:!1,parent:"",x:917.8571428571433,y:466.0714285714287,zOrder:-1,width:440,height:148,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:"Tip1"},text:{text:"",fontSize:"64",fontFamily:"Arial",fontStyle:"italic",fontWeight:"bold",fill:"['#ffffff']",stroke:"#000000",strokeThickness:1,dropShadows:!1,ShadowColor:"#000000",dropShadowBlur:6,dropShadowAngle:90,dropShadowDistance:7,wordWrap:!0,wordWrapWidth:440}},Tip4:{name:{value:"Tip4",tagName:""},position:{isGuiElement:!1,parent:"",x:3967.857142857143,y:416.07142857142867,zOrder:-1,width:272,height:148,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:"Tip1"},text:{text:"Now try yourself!",fontSize:"64",fontFamily:"Arial",fontStyle:"italic",fontWeight:"bold",fill:"['#ffffff']",stroke:"#000000",strokeThickness:1,dropShadows:!1,ShadowColor:"#000000",dropShadowBlur:6,dropShadowAngle:90,dropShadowDistance:7,wordWrap:!0,wordWrapWidth:440}},TipJump:{name:{value:"TipJump",tagName:""},position:{isGuiElement:!1,parent:"",x:2157.857142857143,y:219.82142857142873,zOrder:-1,width:378,height:74,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:"Tip1"},text:{text:"",fontSize:"64",fontFamily:"Arial",fontStyle:"italic",fontWeight:"bold",fill:"['#ffffff']",stroke:"#000000",strokeThickness:1,dropShadows:!1,ShadowColor:"#000000",dropShadowBlur:6,dropShadowAngle:90,dropShadowDistance:7,wordWrap:!0,wordWrapWidth:440}},Sound:{name:{value:"Sound",tagName:""},sprite:{path:"soundoff.png"},position:{x:0,y:0,parent:"",width:100,height:100,isGuiElement:!0,centerx:1,centery:0,rightAligned:!0},sound:{}},Menu:{name:{value:"Menu"},sprite:{path:""},position:{x:0,y:0,parent:"",zOrder:999},Menu:{}},Pause:{name:{value:"Pause"},sprite:{path:"pause.png"},position:{x:-5e3,y:0,parent:"",width:100,height:100,isGuiElement:!0,rightAligned:!0,centerx:1,centery:0},PauseGame:{priorty:99}},HighScore:{name:{value:"HighScore",tagName:""},sprite:{path:"",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!0,rightAligned:!1,centerAligned:!1,parent:"",x:0,y:60,zOrder:0,width:106,height:56,scaleX:1,scaleY:1,rotation:0,centerx:0,centery:0,dragging:!1,prefabName:"GUI"},text:{text:"Best",fontSize:"48",fontFamily:"Arial",fontStyle:"italic",fontWeight:"bold",fill:"['#cccccc']",stroke:"#000000",strokeThickness:1,dropShadows:!1,ShadowColor:"#666666",dropShadowBlur:50,dropShadowAngle:90,dropShadowDistance:7,wordWrap:!0,wordWrapWidth:440}}},assetList:[{name:"public\\assets\\_standartAssets\\pixi\\01_pixi.min.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\_standartAssets\\pixi",onlyName:"01_pixi.min.js"},{name:"public\\assets\\_standartAssets\\general\\03_helpers.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\_standartAssets\\general",onlyName:"03_helpers.js"},{name:"public\\assets\\_standartAssets\\general\\04_generalFunctions.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\_standartAssets\\general",onlyName:"04_generalFunctions.js"},{name:"public\\assets\\_standartAssets\\general\\05_GameObject.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\_standartAssets\\general",onlyName:"05_GameObject.js"},{name:"public\\assets\\_standartAssets\\1.json",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\_standartAssets",onlyName:"1.json"},{name:"public\\assets\\_standartAssets\\box2d\\box2d.min.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\_standartAssets\\box2d",onlyName:"box2d.min.js"},{name:"public\\assets\\_standartAssets\\box2d\\box2dHelpers.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\_standartAssets\\box2d",onlyName:"box2dHelpers.js"},{name:"public\\assets\\_standartAssets\\box2d\\box2dUtil.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\_standartAssets\\box2d",onlyName:"box2dUtil.js"},{name:"public\\assets\\_standartAssets\\box2d\\decomp.min.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\_standartAssets\\box2d",onlyName:"decomp.min.js"},{name:"public\\assets\\_standartAssets\\objectAnimator\\null.anim",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\_standartAssets\\objectAnimator",onlyName:"null.anim"},{name:"public\\assets\\_standartAssets\\objectAnimator\\objectAnimator.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\_standartAssets\\objectAnimator",onlyName:"objectAnimator.js"},{name:"public\\assets\\_standartAssets\\pixi\\pixiParticle.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\_standartAssets\\pixi",onlyName:"pixiParticle.js"},{name:"public\\assets\\_standartAssets\\pixi\\pixiUtil.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\_standartAssets\\pixi",onlyName:"pixiUtil.js"},{name:"public\\assets\\_standartAssets\\sound\\soundUtil.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\_standartAssets\\sound",onlyName:"soundUtil.js"},{name:"public\\assets\\Achievments.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"Achievments.js"},{name:"public\\assets\\Director.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"Director.js"},{name:"public\\assets\\Game.scene",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"Game.scene"},{name:"public\\assets\\Main.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"Main.js"},{name:"public\\assets\\MainSprite.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"MainSprite.js"},{name:"public\\assets\\Menu.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"Menu.js"},{name:"public\\assets\\MetroButton.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"MetroButton.js"},{name:"public\\assets\\PauseGame.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"PauseGame.js"},{name:"public\\assets\\Untitled-1.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"Untitled-1.png"},{name:"public\\assets\\mainsprites\\blood.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\mainsprites",onlyName:"blood.png"},{name:"public\\assets\\cutter.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"cutter.js"},{name:"public\\assets\\exclamation.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"exclamation.png"},{name:"public\\assets\\FLOOR\\f1.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\FLOOR",onlyName:"f1.png"},{name:"public\\assets\\FLOOR\\f2.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\FLOOR",onlyName:"f2.png"},{name:"public\\assets\\FLOOR\\f3.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\FLOOR",onlyName:"f3.png"},{name:"public\\assets\\FLOOR\\f4.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\FLOOR",onlyName:"f4.png"},{name:"public\\assets\\factory0.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"factory0.png"},{name:"public\\assets\\factory1.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"factory1.png"},{name:"public\\assets\\factory2.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"factory2.png"},{name:"public\\assets\\factory3.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"factory3.png"},{name:"public\\assets\\factory4.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"factory4.png"},{name:"public\\assets\\fb.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"fb.png"},{name:"public\\assets\\hook.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"hook.png"},{name:"public\\assets\\hook2.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"hook2.png"},{name:"public\\assets\\hop.mp3",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"hop.mp3"},{name:"public\\assets\\mainsprites\\leg.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\mainsprites",onlyName:"leg.png"},{name:"public\\assets\\mainsprites\\legpiece.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\mainsprites",onlyName:"legpiece.png"},{name:"public\\assets\\light.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"light.png"},{name:"public\\assets\\lightoff.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"lightoff.png"},{name:"public\\assets\\logo.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"logo.png"},{name:"public\\assets\\menu.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"menu.png"},{name:"public\\assets\\more.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"more.png"},{name:"public\\assets\\ok.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"ok.png"},{name:"public\\assets\\oof.mp3",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"oof.mp3"},{name:"public\\assets\\pause.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"pause.png"},{name:"public\\assets\\mainsprites\\piece1.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\mainsprites",onlyName:"piece1.png"},{name:"public\\assets\\mainsprites\\piece2.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\mainsprites",onlyName:"piece2.png"},{name:"public\\assets\\mainsprites\\piece3.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\mainsprites",onlyName:"piece3.png"},{name:"public\\assets\\mainsprites\\piece4.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\mainsprites",onlyName:"piece4.png"},{name:"public\\assets\\play.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"play.png"},{name:"public\\assets\\saw.mp3",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"saw.mp3"},{name:"public\\assets\\sound.js",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"sound.js"},{name:"public\\assets\\soundoff.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"soundoff.png"},{name:"public\\assets\\soundon.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"soundon.png"},{name:"public\\assets\\step2.mp3",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"step2.mp3"},{name:"public\\assets\\mainsprites\\torso.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\mainsprites",onlyName:"torso.png"},{name:"public\\assets\\mainsprites\\torsohang.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets\\mainsprites",onlyName:"torsohang.png"},{name:"public\\assets\\trophy.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"trophy.png"},{name:"public\\assets\\tw.png",isFolder:!1,folder:"..\\examples\\endlessRunner\\public\\assets",onlyName:"tw.png"}],prefabs:{"Brick.prefab":[{name:{value:"PrefabGameObject0",tagName:"ground"},sprite:{path:"FLOOR\\f4.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,parent:"",x:-185.04166666666688,y:-203.62499999999977,zOrder:0,width:256,height:252,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.25,dragging:!1,prefabName:"Brick"},Physics:{isLiquid:!1,maxParticleInOneFrame:50,particleRadius:5,particleType:0,particleImage:"",particleImageShadow:6,particleImageWidth:16,debugDraw:!1,fillColor:"FFFFFF",lineColor:"000000",colliderType:"box",radius:1,width:256,height:128,damping:.1,friction:0,restitution:0,density:5,preX:0,preY:0,preRot:0,static:!0,isSensor:!1,isBullet:!1,fixedRotation:!1,angle:0,vertices:[{x:-50,y:-50},{x:50,y:-50,c:65280},{x:0,y:50}],physicsMaterial:"default",mass:5,fixedX:!1,fixedY:!1,velocityX:0,velocityY:0}}],"Cutter.prefab":[{name:{value:"PrefabGameObject0",tagName:"obstacle"},sprite:{path:"Untitled-1.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,parent:"",x:0,y:0,zOrder:1,width:256,height:256,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:"Cutter"},Physics:{isLiquid:!1,maxParticleInOneFrame:50,particleRadius:5,particleType:0,particleImage:"",particleImageShadow:6,particleImageWidth:16,debugDraw:!1,fillColor:"FFFFFF",lineColor:"000000",colliderType:"circle",radius:128,width:256,height:256,damping:0,friction:0,restitution:0,density:500,preX:0,preY:0,preRot:0,static:!0,isSensor:!1,isBullet:!1,fixedRotation:!1,angle:0,vertices:[{x:-63,y:7},{x:-107,y:-63},{x:-57,y:-19},{x:-60,y:-109},{x:-40,y:-44},{x:2,y:-124},{x:-12,y:-58},{x:65,y:-109},{x:20,y:-57},{x:111,y:-62},{x:47,y:-38},{x:126,y:4},{x:59,y:-9},{x:109,y:64},{x:56,y:19},{x:60,y:111},{x:44,y:54},{x:-3,y:126},{x:11,y:67},{x:-64,y:107},{x:-22,y:60},{x:-110,y:62},{x:-46,y:37},{x:-125,y:-2}]},cutter:{}}],"Explode.prefab":[{name:{value:"PrefabGameObject0",tagName:"Explode"},sprite:{path:"",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,rightAligned:!1,centerAligned:!1,parent:"",x:0,y:0,zOrder:0,width:32,height:32,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:"Explode"}},{name:{value:"PrefabGameObject1",tagName:""},sprite:{path:"mainsprites\\piece1.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,rightAligned:!1,centerAligned:!1,parent:"PrefabGameObject0",x:-29.302536231884105,y:-21.2862318840579,zOrder:0,width:79,height:84,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:""},Physics:{isLiquid:!1,maxParticleInOneFrame:50,particleRadius:5,particleType:0,particleImage:"",particleImageShadow:5,particleImageWidth:16,debugDraw:!1,fillColor:"FFFFFF",lineColor:"000000",colliderType:"concave",radius:1,width:79,height:84,damping:.1,friction:0,restitution:0,density:5,preX:0,preY:0,preRot:0,static:!1,isSensor:!1,isBullet:!1,fixedRotation:!1,angle:0,vertices:[{x:-42,y:-20},{x:-18,y:-36},{x:-10,y:-12},{x:13,y:-24},{x:5,y:-42},{x:28,y:-41},{x:24,y:-26},{x:27,y:4},{x:38,y:7},{x:26,y:28},{x:12,y:35},{x:1,y:42,c:65280},{x:-3,y:30},{x:-27,y:19},{x:-18,y:-6},{x:-24,y:-18}]}},{name:{value:"PrefabGameObject2",tagName:""},sprite:{path:"mainsprites\\piece2.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,rightAligned:!1,centerAligned:!1,parent:"PrefabGameObject0",x:27.626811594202927,y:-16.123188405797084,zOrder:0,width:73,height:81,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:""},Physics:{isLiquid:!1,maxParticleInOneFrame:50,particleRadius:5,particleType:0,particleImage:"",particleImageShadow:5,particleImageWidth:16,debugDraw:!1,fillColor:"FFFFFF",lineColor:"000000",colliderType:"concave",radius:1,width:73,height:81,damping:.1,friction:0,restitution:0,density:5,preX:0,preY:0,preRot:0,static:!1,isSensor:!1,isBullet:!1,fixedRotation:!1,angle:0,vertices:[{x:-16,y:-35},{x:0,y:-32},{x:36,y:-37},{x:19,y:-18},{x:16,y:12},{x:4,y:34},{x:-21,y:31},{x:-36,y:17},{x:-30,y:-5},{x:-34,y:-18,c:65280}]}},{name:{value:"PrefabGameObject3",tagName:""},sprite:{path:"mainsprites\\piece3.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,rightAligned:!1,centerAligned:!1,parent:"PrefabGameObject0",x:23.777173913043413,y:27.717391304347732,zOrder:0,width:69,height:69,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:""},Physics:{isLiquid:!1,maxParticleInOneFrame:50,particleRadius:5,particleType:0,particleImage:"",particleImageShadow:5,particleImageWidth:16,debugDraw:!1,fillColor:"FFFFFF",lineColor:"000000",colliderType:"polygon",radius:1,width:69,height:69,damping:.1,friction:0,restitution:0,density:5,preX:0,preY:0,preRot:0,static:!1,isSensor:!1,isBullet:!1,fixedRotation:!1,angle:0,vertices:[{x:-13,y:-32},{x:-4,y:-33},{x:-3,y:-13},{x:26,y:-19},{x:33,y:9},{x:-4,y:32},{x:-29,y:31},{x:-32,y:0},{x:-13,y:-11,c:65280}]}},{name:{value:"PrefabGameObject4",tagName:""},sprite:{path:"mainsprites\\piece4.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,rightAligned:!1,centerAligned:!1,parent:"PrefabGameObject0",x:-36.096014492753525,y:29.80072463768125,zOrder:0,width:84,height:71,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:""},Physics:{isLiquid:!1,maxParticleInOneFrame:50,particleRadius:5,particleType:0,particleImage:"",particleImageShadow:5,particleImageWidth:16,debugDraw:!1,fillColor:"FFFFFF",lineColor:"000000",colliderType:"concave",radius:1,width:84,height:71,damping:.1,friction:0,restitution:0,density:5,preX:0,preY:0,preRot:0,static:!1,isSensor:!1,isBullet:!1,fixedRotation:!1,angle:0,vertices:[{x:-23,y:-22},{x:29,y:-33},{x:39,y:2},{x:25,y:35},{x:0,y:25,c:65280},{x:-21,y:-3},{x:-38,y:7},{x:-40,y:-3}]}},{name:{value:"PrefabGameObject5",tagName:""},sprite:{path:"mainsprites\\legpiece.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,rightAligned:!1,centerAligned:!1,parent:"PrefabGameObject0",x:-23.55072463768118,y:53.80434782608693,zOrder:0,width:33,height:52,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:""},Physics:{isLiquid:!1,maxParticleInOneFrame:50,particleRadius:5,particleType:0,particleImage:"",particleImageShadow:5,particleImageWidth:16,debugDraw:!1,fillColor:"FFFFFF",lineColor:"000000",colliderType:"concave",radius:1,width:33,height:52,damping:.1,friction:0,restitution:0,density:5,preX:0,preY:0,preRot:0,static:!1,isSensor:!1,isBullet:!1,fixedRotation:!1,angle:0,vertices:[{x:-13,y:-6,c:65280},{x:-6,y:-11},{x:-8,y:-24},{x:3,y:-23},{x:2,y:-8},{x:3,y:5},{x:14,y:24},{x:-15,y:25}]}},{name:{value:"PrefabGameObject6",tagName:""},sprite:{path:"mainsprites\\legpiece.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,rightAligned:!1,centerAligned:!1,parent:"PrefabGameObject0",x:22.826086956521717,y:54.66485507246372,zOrder:0,width:33,height:52,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:""},Physics:{isLiquid:!1,maxParticleInOneFrame:50,particleRadius:5,particleType:0,particleImage:"",particleImageShadow:5,particleImageWidth:16,debugDraw:!1,fillColor:"FFFFFF",lineColor:"000000",colliderType:"concave",radius:1,width:33,height:52,damping:.1,friction:0,restitution:0,density:5,preX:0,preY:0,preRot:0,static:!1,isSensor:!1,isBullet:!1,fixedRotation:!1,angle:0,vertices:[{x:-11,y:-7},{x:-6,y:-24},{x:1,y:-22},{x:1,y:-10},{x:6,y:12,c:65280},{x:13,y:25},{x:-14,y:23}]}},{name:{value:"PrefabGameObject7",tagName:""},sprite:{path:"",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,rightAligned:!1,centerAligned:!1,parent:"PrefabGameObject0",x:-2.1739130434782594,y:3.9855072463768093,zOrder:0,width:32,height:32,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:""},Physics:{isLiquid:!0,maxParticleInOneFrame:50,particleRadius:4,particleType:0,particleImage:"mainsprites\\blood.png",particleImageShadow:5,particleImageWidth:12,debugDraw:!1,fillColor:"FFFFFF",lineColor:"000000",colliderType:"circle",radius:54,width:32,height:32,damping:.1,friction:0,restitution:0,density:5,preX:0,preY:0,preRot:0,static:!1,isSensor:!1,isBullet:!1,fixedRotation:!1,angle:0,vertices:[{x:-50,y:-50},{x:50,y:-50,c:65280},{x:0,y:50}]}}],"GUI.prefab":[{name:{value:"GUI",tagName:""},sprite:{path:"",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!0,rightAligned:!1,centerAligned:!1,parent:"",x:0,y:0,zOrder:0,width:172,height:74,scaleX:1,scaleY:1,rotation:0,centerx:0,centery:0,dragging:!1,prefabName:"GUI"},text:{text:"score",fontSize:"64",fontFamily:"Arial",fontStyle:"italic",fontWeight:"bold",fill:"['#ffffff']",stroke:"#000000",strokeThickness:1,dropShadows:!1,ShadowColor:"#666666",dropShadowBlur:50,dropShadowAngle:90,dropShadowDistance:7,wordWrap:!0,wordWrapWidth:440}}],"Main.prefab":[{name:{value:"Main",tagName:""},position:{isGuiElement:!1,parent:"",x:-74,y:209,zOrder:0,width:64,height:64,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:"Main"},Main:{grounded:0,onRope:!1,flySpeed:0,landing:!1,prex:0,vSpeed:1,preSwingSpeed:0,ay:-54,ax:0},Physics:{isLiquid:!1,maxParticleInOneFrame:50,particleRadius:5,particleType:0,particleImage:"",particleImageShadow:5,particleImageWidth:16,debugDraw:!1,fillColor:"FFFFFF",lineColor:"000000",colliderType:"circle",radius:64,width:128,height:128,damping:.2,friction:0,restitution:0,density:5,preX:0,preY:0,preRot:0,static:!1,isSensor:!1,isBullet:!1,fixedRotation:!1,angle:0,vertices:[{x:-8,y:-45},{x:16,y:-45},{x:60,y:-45},{x:42,y:-28},{x:52,y:3},{x:59,y:29},{x:35,y:39},{x:51,y:71},{x:-39,y:70},{x:-25,y:45},{x:-49,y:21,c:65280},{x:-47,y:-4},{x:-38,y:-25},{x:-51,y:-39},{x:-35,y:-51},{x:-31,y:-32}],physicsMaterial:"default"}},{name:{value:"MainSprite0",tagName:""},position:{isGuiElement:!1,parent:"Main",x:0,y:0,zOrder:0,width:128,height:128,scaleX:1,scaleY:1,rotation:1,centerx:.5,centery:.5,dragging:!1,prefabName:""},objectAnimator:{timeLine:{walk:{Name:"walk","Number Of Frames":10,FPS:30,Animation:[{FrontLeg:{position:{rotation:"1",y:"37"}},BackLeg:{position:{rotation:"1",y:"37"}}},null,null,{BackLeg:{position:{rotation:"-30"}},FrontLeg:{position:{rotation:"30"}}},null,null,{FrontLeg:{position:{rotation:"-30"}},BackLeg:{position:{rotation:"30"}}},null,null,{BackLeg:{position:{rotation:"5"}},FrontLeg:{position:{rotation:"-5"}}}],calculatedAnimation:[{FrontLeg:{position:{rotation:1,y:37}},BackLeg:{position:{rotation:1,y:37}}},{BackLeg:{position:{rotation:-9.333333333333332}},FrontLeg:{position:{rotation:10.666666666666666}}},{BackLeg:{position:{rotation:-19.666666666666664}},FrontLeg:{position:{rotation:20.333333333333332}}},{BackLeg:{position:{rotation:-30}},FrontLeg:{position:{rotation:30}}},{FrontLeg:{position:{rotation:10}},BackLeg:{position:{rotation:-10}}},{FrontLeg:{position:{rotation:-10}},BackLeg:{position:{rotation:10}}},{FrontLeg:{position:{rotation:-30}},BackLeg:{position:{rotation:30}}},{BackLeg:{position:{rotation:21.666666666666668}},FrontLeg:{position:{rotation:-21.666666666666668}}},{BackLeg:{position:{rotation:13.333333333333336}},FrontLeg:{position:{rotation:-13.333333333333336}}},{BackLeg:{position:{rotation:5}},FrontLeg:{position:{rotation:-5}}},{FrontLeg:{position:{rotation:-5,y:37}},BackLeg:{position:{rotation:5,y:37}}}]},jump:{Name:"jump","Number Of Frames":10,FPS:60,Animation:[{FrontLeg:{position:{y:"37",rotation:"0"}},BackLeg:{position:{y:"37",rotation:"0"}}},null,null,null,null,null,null,null,null,{BackLeg:{position:{rotation:"40",y:"27"}},FrontLeg:{position:{rotation:"40",y:"27"}}}],calculatedAnimation:[{FrontLeg:{position:{y:37,rotation:0}},BackLeg:{position:{y:37,rotation:0}}},{BackLeg:{position:{rotation:4.444444444444445,y:35.888888888888886}},FrontLeg:{position:{rotation:4.444444444444445,y:35.888888888888886}}},{BackLeg:{position:{rotation:8.88888888888889,y:34.77777777777778}},FrontLeg:{position:{rotation:8.88888888888889,y:34.77777777777778}}},{BackLeg:{position:{rotation:13.333333333333332,y:33.666666666666664}},FrontLeg:{position:{rotation:13.333333333333332,y:33.666666666666664}}},{BackLeg:{position:{rotation:17.77777777777778,y:32.55555555555556}},FrontLeg:{position:{rotation:17.77777777777778,y:32.55555555555556}}},{BackLeg:{position:{rotation:22.22222222222222,y:31.444444444444443}},FrontLeg:{position:{rotation:22.22222222222222,y:31.444444444444443}}},{BackLeg:{position:{rotation:26.666666666666664,y:30.333333333333336}},FrontLeg:{position:{rotation:26.666666666666664,y:30.333333333333336}}},{BackLeg:{position:{rotation:31.11111111111111,y:29.22222222222222}},FrontLeg:{position:{rotation:31.11111111111111,y:29.22222222222222}}},{BackLeg:{position:{rotation:35.55555555555556,y:28.11111111111111}},FrontLeg:{position:{rotation:35.55555555555556,y:28.11111111111111}}},{BackLeg:{position:{rotation:40,y:27}},FrontLeg:{position:{rotation:40,y:27}}},{FrontLeg:{position:{y:27,rotation:40}},BackLeg:{position:{y:27,rotation:40}}}]},swingback:{Name:"swingback","Number Of Frames":10,FPS:60,Animation:[{MainSprite0:{position:{}},BackLeg:{position:{y:"36"}},FrontLeg:{position:{y:"36"}}},null,null,{FrontLeg:{position:{rotation:"-30"}},BackLeg:{position:{rotation:"-30"}}},null,null,null,null,null,{BackLeg:{position:{rotation:"40"}},FrontLeg:{position:{rotation:"40"}}}],calculatedAnimation:[{BackLeg:{position:{y:36,rotation:-30}},FrontLeg:{position:{y:36,rotation:-30}}},{FrontLeg:{position:{rotation:-30}},BackLeg:{position:{rotation:-30}}},{FrontLeg:{position:{rotation:-30}},BackLeg:{position:{rotation:-30}}},{FrontLeg:{position:{rotation:-30}},BackLeg:{position:{rotation:-30}}},{BackLeg:{position:{rotation:-18.333333333333336}},FrontLeg:{position:{rotation:-18.333333333333336}}},{BackLeg:{position:{rotation:-6.666666666666668}},FrontLeg:{position:{rotation:-6.666666666666668}}},{BackLeg:{position:{rotation:5}},FrontLeg:{position:{rotation:5}}},{BackLeg:{position:{rotation:16.666666666666664}},FrontLeg:{position:{rotation:16.666666666666664}}},{BackLeg:{position:{rotation:28.333333333333336}},FrontLeg:{position:{rotation:28.333333333333336}}},{BackLeg:{position:{rotation:40}},FrontLeg:{position:{rotation:40}}},{BackLeg:{position:{y:36,rotation:40}},FrontLeg:{position:{y:36,rotation:40}}}]},swingforward:{Name:"swingforward","Number Of Frames":10,FPS:60,Animation:[{FrontLeg:{position:{y:"37"}},BackLeg:{position:{y:"37"}}},null,null,{FrontLeg:{position:{rotation:"30"}},BackLeg:{position:{rotation:"30"}}},null,null,null,null,null,{BackLeg:{position:{rotation:"-40"}},FrontLeg:{position:{rotation:"-40"}}}],calculatedAnimation:[{FrontLeg:{position:{y:37,rotation:30}},BackLeg:{position:{y:37,rotation:30}}},{FrontLeg:{position:{rotation:30}},BackLeg:{position:{rotation:30}}},{FrontLeg:{position:{rotation:30}},BackLeg:{position:{rotation:30}}},{FrontLeg:{position:{rotation:30}},BackLeg:{position:{rotation:30}}},{BackLeg:{position:{rotation:18.333333333333336}},FrontLeg:{position:{rotation:18.333333333333336}}},{BackLeg:{position:{rotation:6.666666666666668}},FrontLeg:{position:{rotation:6.666666666666668}}},{BackLeg:{position:{rotation:-5}},FrontLeg:{position:{rotation:-5}}},{BackLeg:{position:{rotation:-16.666666666666664}},FrontLeg:{position:{rotation:-16.666666666666664}}},{BackLeg:{position:{rotation:-28.333333333333336}},FrontLeg:{position:{rotation:-28.333333333333336}}},{BackLeg:{position:{rotation:-40}},FrontLeg:{position:{rotation:-40}}},{FrontLeg:{position:{y:37,rotation:-40}},BackLeg:{position:{y:37,rotation:-40}}}]}},playedLoop:0,currentFrame:5,loopCount:-1,playOnStart:"",extraTime:30.999999999997677},MainSprite:{}},{name:{value:"FrontLeg",tagName:""},sprite:{path:"mainsprites\\leg.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,parent:"MainSprite0",x:-16.25,y:37,zOrder:1,width:29,height:29,scaleX:1,scaleY:1,rotation:0,centerx:.35,centery:.1,dragging:!1,prefabName:""}},{name:{value:"BackLeg",tagName:""},sprite:{path:"mainsprites\\leg.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,parent:"MainSprite0",x:20.92728163984465,y:32.83396793684838,zOrder:-1,width:32,height:36,scaleX:1,scaleY:1,rotation:0,centerx:.35,centery:.1,dragging:!1,prefabName:""}},{name:{value:"Torso",tagName:""},sprite:{path:"mainsprites\\torso.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,parent:"MainSprite0",x:-.018179590038836957,y:-1.0415080157879077,zOrder:0,width:129,height:130,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:""}}],"Vial.prefab":[{name:{value:"PrefabGameObject0",tagName:"Vial"},sprite:{path:"light.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,rightAligned:!1,centerAligned:!1,parent:"",x:0,y:0,zOrder:0,width:320,height:320,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:"Vial"},Physics:{isLiquid:!1,maxParticleInOneFrame:50,particleRadius:5,particleType:0,particleImage:"",particleImageShadow:5,particleImageWidth:16,debugDraw:!1,fillColor:"FFFFFF",lineColor:"000000",colliderType:"polygon",radius:1,width:64,height:80,damping:.1,friction:0,restitution:0,density:5,preX:0,preY:0,preRot:0,static:!0,isSensor:!0,isBullet:!1,fixedRotation:!1,angle:0,vertices:[{x:-8,y:-34},{x:9,y:-35},{x:33,y:32},{x:-30,y:32}]}}],"back.prefab":[{name:{value:"PrefabGameObject0",tagName:""},sprite:{path:"factory.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,parent:"",x:0,y:0,zOrder:-999,width:1600,height:1600,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:"back"},tint:{tint:"0xffffff"}}],"exclamation.prefab":[{name:{value:"PrefabGameObject0",tagName:"exclamation"},sprite:{path:"exclamation.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,rightAligned:!1,centerAligned:!1,parent:"",x:0,y:0,zOrder:9999,width:64,height:64,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.5,dragging:!1,prefabName:"exclamation"},tint:{tint:"0xffffff"}}],"ropeNode.prefab":[{name:{value:"PrefabGameObject0",tagName:"ropePoint"},sprite:{path:"hook.png",AnimationSpeed:.5,isTileMap:!1,tileWidth:32,tileHeight:32,tilesNum:[]},position:{isGuiElement:!1,parent:"",x:-82,y:-137,zOrder:0,width:67,height:67,scaleX:1,scaleY:1,rotation:0,centerx:.5,centery:.9,dragging:!1,prefabName:"ropeNode"},Physics:{isLiquid:!1,maxParticleInOneFrame:50,particleRadius:5,particleType:0,particleImage:"",particleImageShadow:5,particleImageWidth:16,debugDraw:!1,fillColor:"FFFFFF",lineColor:"000000",colliderType:"circle",radius:5,width:32,height:32,damping:.1,friction:0,restitution:0,density:5,preX:0,preY:0,preRot:0,static:!0,isSensor:!0,isBullet:!1,fixedRotation:!1,angle:0,vertices:[{x:-50,y:-50},{x:50,y:-50,c:65280},{x:0,y:50}],physicsMaterial:"default",mass:5,fixedX:!1,fixedY:!1,velocityX:0,velocityY:0}}]},settings:{AutoWidth:!0,Width:800,AutoHeight:!0,Height:600,Header:"Runner",BackgroundColor:"FFFFFF",connectedVisualStudio:!0,MinWidthHeightRatio:1.5,MaxWidthHeightRatio:3},sceneOrder:["Game.scene"]};