gm.Headless = function () {
    //this.worksInEditor=false;
    this.preLife = 4;
    this.pulsing = 0;
    this.haveWalls = false;
    this.walls = new Array();
    this.interval = 0;
}
gm.Headless.prototype.create = function () {
    this.gameObject.sprite.loopAnim("default");
    this.preLife = this.gameObject.life.remaining;
}
gm.Headless.prototype.update = function (dt) {
    if (monsterActivation(this))
        return;

    var m = objects.main;
    var p = this.gameObject.position;

    if (this.haveWalls) {
        var maxp = objects.Director.Director.minVisibleX;
        var pumpkins = getByTagName("pumpkin");

        for (var j = 0; j < pumpkins.length; j++) {

            if (pumpkins[j].position.x < maxp) {
                pumpkins[j].remove();
            }

        }
        if (pumpkins.length == 0) {
            for (var i = 0; i < this.walls.length; i++) {
                this.walls[i].remove();
            }
            this.walls = new Array();
            this.haveWalls = false;

        }
    }
    if (this.gameObject.sprite.currentAnim.name == "die")
        return;

    if (this.gameObject.life.remaining <= 0) {
        var pumpkins = getByTagName("pumpkin");
        if (pumpkins)
            for (var j = 0; j < pumpkins.length; j++) {
                pumpkins[j].remove();
            }
        this.gameObject.sprite.playOnceAnim("die");
        return;
    }
    if (this.gameObject.sprite.currentAnim.name == "default") {
        if (this.interval < 0) {
            this.interval = 2000;
            addPrefab("Golem.prefab", {
                position: {
                    x: p.x,
                    y: p.y
                },
                life: {
                    remaining: 1
                }
            });
        }
        this.interval -= dt;

    }
    if (this.pulsing != 0) {
        if (!this.haveWalls && m.Physics.grounded) {
            this.haveWalls = true;

            for (var i = p.x - 96; i > objects.Director.Director.minVisibleX + 63; i -= 63) {
                var o = objects[addPrefab("caveWall.prefab", {
                    position: {
                        x: i,
                        y: 10
                    }
                })[0]];
                this.walls.push(o);
            }
        }
        if (Math.abs(m.position.x - p.x + 150) < 10) {
            m.position.x = p.x - 150;
            if (m.Physics.grounded) {
                this.pulsing = 0;
                m.main.stunned = false;
                m.Physics.gravityFactor = 1;
                m.Physics.maxvy = 500;
            }
            m.Physics.vx = 0;
        }
        else {
            m.Physics.vx = this.pulsing * 6;
            m.main.stunned = true;
            m.Physics.gravityFactor = 10;
            m.Physics.maxvy = 2000;
        }
    }
    if (this.preLife != this.gameObject.life.remaining) {

        this.preLife = this.gameObject.life.remaining;
        this.gameObject.sprite.playOnceAnim("sah");
        this.pulsing = p.x - 150 - m.position.x;
        addPrefab("Pumpkin.prefab", {
            position: {
                x: p.x - 10,
                y: p.y - 17
            }
        });
    }
    if (this.gameObject.sprite.sprite.playing == false) {
        this.gameObject.sprite.loopAnim("default");
    }
}
gm.Headless.prototype.dispose = function () {

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
