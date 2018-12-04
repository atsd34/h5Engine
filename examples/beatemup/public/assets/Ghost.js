gm.Ghost = function () {
    //this.worksInEditor=false;
    this.MonsterType = "Imp";
    this.running = false;
    this.closeness = 0;
    this.vx = 20;
    this.iswalking = true;
    this.left = 0;
    this.right = 0;
}
gm.Ghost.prototype.create = function () {

}
gm.Ghost.prototype.update = function (dt) {
    if (monsterActivation(this))
        return;

    if (this.gameObject.life.remaining <= 0 && this.gameObject.sprite.currentAnim.name != "die") {
        try {
            var chldrn = childrenGameObject[this.gameObject.name.value];
            for (var i = 0; i < chldrn.length; i++) {
                try {
                    var c = objects[chldrn[i]];
                    c.remove();
                } catch (e) {

                }
            }
        } catch (e) {

        }
        this.gameObject.sprite.loopAnim("die");
        if (this.MonsterType == "banshee") {
            this.gameObject.Physics.gravityFactor = 1;
            this.gameObject.Physics.sleeping = false;
        } else {
            this.gameObject.Physics.vy = -10;
        }
        this.gameObject.Physics.vx = 0;
    }
    if (this.gameObject.sprite.currentAnim.name == "die") {
        if (this.MonsterType == "banshee") {
            this.gameObject.Physics.gravityFactor = 1;
        } else {
            this.gameObject.Physics.vy = -4 * this.vx;
        }
        this.gameObject.Physics.vx = 0;
        if (this.gameObject.position.y < objects.Director.Director.minVisibleY)
            this.gameObject.remove();
        return;
    }

    var $this = this;
    var p = this.gameObject.position;
    var m = objects.main.position;
    var dist = Math.sqrt((p.x - m.x) * (p.x - m.x) + (p.y - m.y) * (p.y - m.y));
    if ((dist > 100 || Math.abs(m.y - p.y) > 10) && this.gameObject.sprite.currentAnim.name == "default") {
        this.gameObject.position.scaleX = Math.sign(m.x - p.x);
        this.gameObject.Physics.vx = Math.abs(m.x - p.x) > 50 ? this.vx * (m.x - p.x) / dist : 0;
        this.gameObject.Physics.vy = Math.abs(m.y - p.y) > 5 ? this.vx * 8 * (m.y - p.y) / dist : this.vx * (m.y - p.y) / dist;
    } else if (this.gameObject.sprite.currentAnim.name == "default") {
        this.gameObject.Physics.vx = 0;
        this.gameObject.Physics.vy = 0;
        if (this.MonsterType == "banshee") {
            var sgn = Math.sign(objects.main.position.x - $this.gameObject.position.x);
            $this.gameObject.sprite.playOnceAnim("prepare", function () {
                var o = undefined;
                o = createDestroyer("", $this.gameObject.position.x, $this.gameObject.position.y - 5, 32, 32, undefined, "Scream.prefab");
                o.position.scaleX = sgn;
                o.Physics.vx = sgn * 100;
                setTimeout(function () {
                    o.remove();
                }, 1000);
                $this.gameObject.sprite.loopAnim("default");
            });
        } else {
            var nextx = this.vx * 15 * Math.sign(m.x - p.x);
            var nexty = this.vx * (m.y - p.y) / dist;
            this.gameObject.position.scaleX = Math.sign(m.x - p.x);
            $this.gameObject.sprite.playOnceAnim("prepare", function () {
                var o = undefined;
                o = createDestroyer($this.gameObject.name.value, 4, -4, 16, 24);
                $this.gameObject.Physics.vx = nextx;
                $this.gameObject.Physics.vy = 0;
                $this.gameObject.sprite.playOnceAnim("attack", function () {
                    setTimeout(function () {
                        $this.gameObject.Physics.vx = 0;
                        $this.gameObject.Physics.vy = 0;
                        o.remove();
                        $this.gameObject.sprite.playOnceAnim("rest", function () {
                            $this.gameObject.sprite.loopAnim("default");
                        });
                    }, 500);
                });

            });
        }
    }
    else {

    }
}
gm.Ghost.prototype.dispose = function () {

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
