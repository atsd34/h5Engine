gm.life = function () {
    //this.worksInEditor=false;
    this.remaining = 6;
    this.sprites = [];
    this.invulnerable = 0;
    this.decreasedBy = [];
    this.activated = false;
}
gm.life.prototype.create = function () {
    if (this.gameObject.name.tagName == "enemy")
        monsterActivation(this);
}

gm.life.prototype.decreaseBy = function (byName, cnt) {
    if (this.remaining > 0 && this.decreasedBy.indexOf(byName) == -1) {
        if (!cnt)
            cnt = 1;
        this.remaining -= cnt;
        this.decreasedBy.push(byName);
        return true;
    }
    return false;
}
gm.life.prototype.update = function (dt) {
    if (this.invulnerable > 0)
        this.invulnerable -= dt / 1000;
    var spritecount = Math.ceil(this.remaining / 2);
    if (spritecount > this.sprites.length) {
        for (var i = 0; i < spritecount - this.sprites.length; i++) {
            var s = createGameObject({
                name: {
                    value: getGOName("life")
                },
                position: {
                    x: 0,
                    y: 0,
                    width: 33,
                    height: 33
                },
                sprite: {
                    path: "test.png",
                    spriteSheet: true,
                    sheetTileWidth: 34,
                    sheetTileHeight: 34,
                    animationData: [{ seq: [37], FPS: 6, name: "double" }, { seq: [38], FPS: 6, name: "single" }]
                }
            });
            s.sprite.playOnceAnim("double");
            this.sprites.push(s);
        }
    } else if (spritecount < this.sprites.length) {

        for (var i = this.sprites.length - spritecount - 1; i >= 0; i--) {
            this.sprites[i].remove();
            this.sprites.splice(i, 1);

        }
    }
    for (var i = this.sprites.length - 1; i >= 0; i--) {
        if (objects[this.sprites[i].name.value] == undefined) {
            this.sprites.splice(i, 1);
        }
    }
    var len = parseInt(this.gameObject.position.width / spritecount);
    var len = Math.min(8, len);
    var offset = (this.gameObject.position.width - len * (spritecount - 1)) / 2
    for (var i = 0; i < spritecount; i++) {
        this.sprites[i].position.x = this.gameObject.position.x - this.gameObject.position.width / 2 + i * len + offset;
        this.sprites[i].position.y = this.gameObject.position.y - this.gameObject.position.height / 2 - 3;
    }

    for (var i = 0; i < spritecount - 1; i++) {
        var spr = this.sprites[i].sprite;
        if (spr.currentAnim.name != "double") {
            spr.playOnceAnim("double");
        }
    }
    if ((this.remaining / 2) < spritecount) {
        var spr = this.sprites[this.sprites.length - 1].sprite;
        if (spr.currentAnim.name != "single") {
            spr.playOnceAnim("single");
        }
    } else {
        var spr = this.sprites[this.sprites.length - 1].sprite;
        if (spr.currentAnim.name != "double") {
            spr.playOnceAnim("double");
        }
    }
}
gm.life.prototype.dispose = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        try {
            this.sprites[i].remove();
        } catch (e) {

        }
    }
}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
