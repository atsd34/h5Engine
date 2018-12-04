gm.Menu = function () {
    //this.worksInEditor=false;
}
gm.Menu.prototype.create = function () {
    var w = game.renderer.width;
    var h = game.renderer.height;
    this.box = new PIXI.Graphics();
    this.box.zOrder = 1;
    this.box.beginFill(0x000000, 0.8);
    this.box.lineStyle(1, 0xaaaaaa);
    this.box.drawRect(-5000, -3000, 10000, 6000);
    this.gameObject.position.container.addChild(this.box);

    createGameObject({
        name: {
            value: "MainLogo"
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
            alpha:0,
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
            value: "YourLogo"
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
            value: "PlayGame"
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
            text: "Play the game!",
            function: "PlayGame()",
            sizeX: 800,
            sizeY: 512,
            icon: "play.png"
        }
    });

    createGameObject({
        name: {
            value: "FaceBook"
        },
        position: {
            x: 568,
            y: 100,
            zOrder: 9999,
            isGuiElement: true,
            centerAligned: true
        },
        MetroButton: {
            color: 0x8abb25,
            text: "FB",
            function: "Facebook()",
            sizeX: 224,
            sizeY: 224,
            icon: "fb.png",
            onlyImage: true
        }
    });
    createGameObject({
        name: {
            value: "Twitter"
        },
        position: {
            x: 568,
            y: 388,
            zOrder: 9999,
            isGuiElement: true,
            centerAligned: true
        },
        MetroButton: {
            color: 0x8abb25,
            text: "Twitter",
            function: "Tweet()",
            sizeX: 224,
            sizeY: 224,
            icon: "tw.png",
            onlyImage: true
        }
    });
    createGameObject({
        name: {
            value: "Achievements"
        },
        position: {
            x: 280,
            y: 676,
            zOrder: 10000,
            isGuiElement: true,
            centerAligned: true
        },
        MetroButton: {
            color: 0xe89b25,
            text: "Missions" + objects.Director.Achievments.getText(),
            function: "Achievements()",
            sizeX: 512,
            sizeY: 512,
            icon: "trophy.png",
            priorty: 100
        }
    });

    createGameObject({
        name: {
            value: "MoreGames"
        },
        position: {
            x: -296,
            y: 676,
            zOrder: 9999,
            isGuiElement: true,
            centerAligned: true
        },
        MetroButton: {
            color: 0xbb258a,
            text: "More Games",
            function: "",
            sizeX: 512,
            sizeY: 512,
            icon: "more.png"
        }
    });
   
}
gm.Menu.prototype.update = function (dt) {

}
gm.Menu.prototype.dispose = function () {
    this.box.clear();
}
function PlayGame() {
    GetComponents("PauseGame")[0].gameObject.position.x = -128;
    objects.Menu.remove();
    pausedUpdate = false;
    var btns = GetComponents("MetroButton");
    if (btns)
        for (var i = 0; i < btns.length; i++) {
            btns[i].gameObject.remove();
        }
}
function Tweet() {
    if (localStorage.highestEscapeEvilCorpScore == undefined)
        localStorage.highestEscapeEvilCorpScore = 0;
    var url = "https://twitter.com/intent/tweet?text=" + "I made " + localStorage.highestEscapeEvilCorpScore + " score on 'Escape From Evil Corp.' Can you beat me? " +
        window.location.href;
    var win = window.open(url, '_blank');
    win.focus();
}
function Facebook() {
    var url = "https://www.facebook.com/sharer.php?u=" + window.location.href;
    var win = window.open(url, '_blank');
    win.focus();
}
function Achievements() {

    if (objects.Achievements.MetroButton.sizeX == 512) {
        var cont = new PIXI.Container();
        for (var i = 0; i < objects.Director.Achievments.current.length; i++) {
            var cc = objects.Director.Achievments.current[i];
            ListItem(64, 128 + i * 320, 960, 256, cc.description
                + (cc.progress ? " (Current:" + parseInt(cc.progress)+")":"")
                , 0xffbb75, cont, (cc.done ? "ok.png" : undefined));
        }
        cont.rotatable = false;
        objects.Achievements.MetroButton.open({
            x: -296,
            y: 100,
            width: 1088,
            height: 1088,
            sprite: cont
        });
    } else {
        var sprite = new PIXI.Sprite(resources["trophy.png"].texture);
        sprite.zOrder = 2;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.position.x = 256;
        sprite.position.y = 256 + sprite.height / 2 - 64;
        objects.Achievements.MetroButton.open({
            x: 280,
            y: 676,
            width: 512,
            height: 512,
            sprite:sprite
        });

    }
}
function ListItem(x, y, w, h, txt, color,cont,path,animated) {
    var box = new PIXI.Graphics();
    box.zOrder = 1;
    box.beginFill(color,0.5);
    box.lineStyle(0);
    box.zOrder = 0;
    box.drawRect(x, y, w, h);
    box.txt = txt;
    cont.addChild(box);

    var style = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 48,
        fill: [0xffffff], // gradient
        strokeThickness: 0,
        dropShadow: false,
        wordWrap: true,
        wordWrapWidth: w-160
    });
    var text = new PIXI.Text(txt, style);
    text.position.x = x+128;
    text.position.y = y+h/2;
    text.anchor.x = 0;
    text.anchor.y = 0.5;
    text.zOrder = 2;
    text.txt = txt;
    cont.addChild(text);
    if (path) {
        var sprite = new PIXI.Sprite(resources[path].texture);
        sprite.anchor.x = 0;
        sprite.anchor.y = 0.5;
        sprite.position.x = x + 32;
        sprite.position.y = y + h / 2;
        sprite.txt = txt;
        sprite.path = path;
        cont.addChild(sprite);
        if (animated) {
            var w = sprite.width;
            var h = sprite.height;
            sprite.width = sprite.width / 16;
            sprite.height = sprite.height / 16;
            var si = setInterval(function () {
                if (sprite.width * 2 >= w) {
                    sprite.width = w;
                    sprite.height = h;
                    clearInterval(si);
                    return;
                }
                sprite.width *= 2;
                sprite.height *= 2;

            },100);
        }
    }
}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
