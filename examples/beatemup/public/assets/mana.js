gm.mana = function () {
    //this.worksInEditor=false;
    this.remaining = 10;
    this.sprites = [];
    this.updateInterval = 1;
    this.lastupdate = 0;
    this.maxMana = 12;
}
gm.mana.prototype.create = function () {
    
}
gm.mana.prototype.update = function (dt) {
    if (this.gameObject.sprite.currentAnim.name == "idle")
        this.updateInterval = 1;
    else
        this.updateInterval = 6;
        
    this.lastupdate += dt / 1000;
    if (this.lastupdate > this.updateInterval) {
        this.lastupdate = 0;
        if (this.remaining < this.maxMana)
            this.remaining++;
    }
    var spritecount = this.remaining;
    if (spritecount > this.sprites.length) {
        for (var i = 0; i < spritecount - this.sprites.length; i++) {
            var s = createGameObject({
                name: {
                    value: getGOName("mana")
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
                    animationData: [{ seq: [39], FPS: 6, name: "default" }]
                }
            });
            this.sprites.push(s);
        }
    } else if (spritecount < this.sprites.length) {

        for (var i = this.sprites.length - spritecount-1; i >= 0; i--) {
            this.sprites[i].remove();
            this.sprites.splice(i, 1);

        }
    }
    var offset = (this.gameObject.position.width - 2 * (spritecount - 1)) / 2
    for (var i = 0; i < spritecount; i++) {
        this.sprites[i].position.x = this.gameObject.position.x - (this.gameObject.position.width) / 2 + i * 2 + offset;
        this.sprites[i].position.y = this.gameObject.position.y - this.gameObject.position.height / 2 - 10;
    }
}
gm.mana.prototype.dispose = function () {
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
