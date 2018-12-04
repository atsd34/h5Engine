gm.PauseGame = function () {
    //this.worksInEditor=false;
    this.priorty = 99;
    this.paused = false;
}
gm.PauseGame.prototype.create = function () {

}
gm.PauseGame.prototype.update = function (dt) {

}
gm.PauseGame.prototype.dispose = function () {

}

gm.PauseGame.prototype.mouseDownOnMe = function () {
    if (this.paused)
        return;
    objects.Director.Achievments.save();
    var w = game.renderer.width;
    var h = game.renderer.height;
    this.paused = true;
    pausedUpdate = true;
    this.box = new PIXI.Graphics();
    this.box.zOrder = -1;
    this.box.beginFill(0x000000, 0.8);
    this.box.lineStyle(1, 0xaaaaaa);
    this.box.drawRect(-5000, -3000, 10000, 6000);
    this.gameObject.position.container.addChild(this.box);
    createGameObject({
        name: {
            value: "ResumeGame"
        },
        position: {
            x: -296,
            y: 100,
            zOrder: 9999,
            isGuiElement: true,
            centerAligned: true
        },
        MetroButton: {
            color: 0x8abb25,
            text: "Resume game",
            function: "ResumeGame()",
            sizeX: 512,
            sizeY: 512,
            icon: "play.png"
        }
    });
    createGameObject({
        name: {
            value: "GoMenu"
        },
        position: {
            x: -296 + 512 + 64,
            y: 100,
            zOrder: 9999,
            isGuiElement: true,
            centerAligned: true
        },
        MetroButton: {
            color: 0xbb258a,
            text: "Go To Menu",
            function: "GoMenu()",
            sizeX: 512,
            sizeY: 512,
            icon: "menu.png"
        }
    });
    var cont = new PIXI.Container();

    for (var i = 0; i < objects.Director.Achievments.current.length; i++) {
        var cc = objects.Director.Achievments.current[i];
        ListItem(64, 128 + i * 128, 960, 112, cc.description
            + (cc.progress ? " (Current:" + parseInt(cc.progress) + ")" : "")
                , 0xffbb75, cont, (cc.done ? "ok.png" : undefined));
    }
    cont.rotatable = false;
    createGameObject({
        name: {
            value: "MainLogoPause"
        },
        position: {
            x: -872,
            y: 100,
            zOrder: 9999,
            isGuiElement: true,
            centerAligned: true
        },
        MetroButton: {
            color: 0x999999,
            alpha: 0,
            text: "Logo",
            function: "",
            sizeX: 512,
            sizeY: 512,
            icon: "logo.png",
            onlyImage: true
        }
    });
    createGameObject({
        name: {
            value: "YourLogoPause"
        },
        position: {
            x: -872,
            y: 676,
            zOrder: 9999,
            isGuiElement: true,
            centerAligned: true
        },
        MetroButton: {
            color: 0x258aff,
            text: "Your Logo Here",
            function: "",
            sizeX: 512,
            sizeY: 512,
            icon: ""
        }
    });
    createGameObject({
        name: {
            value: "AchievementsPause"
        },
        position: {
            x: -296,
            y: 676,
            zOrder: 9999,
            isGuiElement: true,
            centerAligned: true
        },
        MetroButton: {
            color: 0xe89b25,
            text: "Missions" + objects.Director.Achievments.getText(),
            function: "",
            sizeX: 1088,
            sizeY: 512,
            icon: undefined,
            sprite:cont
        }
    });
    return true;
}
function ResumeGame() {
    var mn = GetComponents("PauseGame")[0];
    mn.box.clear();
    mn.paused = false;
    pausedUpdate = false;
    var btns = GetComponents("MetroButton");
    if (btns)
        for (var i = 0; i < btns.length; i++) {
            btns[i].gameObject.remove();
        }
}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
