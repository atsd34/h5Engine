gm.imp = function () {
    //this.worksInEditor=false;
    this.MonsterType = "Imp";
    this.running = false;
    this.closeness = 0;
    this.vx = 20;
    this.iswalking = true;
    this.left = 0;
    this.right = 0;
}
gm.imp.prototype.create = function () {
    var $this = this;
    $this.gameObject.sprite.playOnceAnim("walk", function () {
        $this.iswalking = false;
    });
    this.vx = this.vx + Math.random() * 20;
    this.gameObject.Physics.vx = this.vx;
}
function monsterActivation($this) {
    var p = $this.gameObject.position;
    if ($this.gameObject.life.activated == false) {
        if (p.x > objects.Director.Director.maxVisibleX ||
            p.x < objects.Director.Director.minVisibleX ||
            p.y > objects.Director.Director.maxVisibleY ||
            p.y < objects.Director.Director.minVisibleY
        ) {
            if ($this.gameObject.Physics)
                $this.gameObject.Physics.vx = 0;
            return true;
        }
        else {
            $this.gameObject.life.activated = true;
        }
    }
}
gm.imp.prototype.update = function (dt) {
    var $this = this;
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
        if ($this.MonsterType == "Vampire") {
            if ($this.gameObject.Physics)
                removeComponent($this.gameObject, "Physics");
            addPrefab("smallbat.prefab", {
                position: {
                    x: $this.gameObject.position.x,
                    y: $this.gameObject.position.y

                }
            });
        }
        this.gameObject.sprite.playOnceAnim("die", function () {
            if ($this.MonsterType == "Vampire") {
                $this.gameObject.remove();
            }
        });
        this.gameObject.Physics.vx = 0;
    }
    if (this.gameObject.sprite.currentAnim.name == "die")
        return;
    if (this.gameObject.Physics.grounded == false)
        return;
    var p = this.gameObject.position;
    if (monsterActivation(this))
        return;

    var m = objects.main.position;
    var dist = Math.sqrt((p.x - m.x) * (p.x - m.x) + (p.y - m.y) * (p.y - m.y));
    if ($this.MonsterType == "Vampire") {
        if (dist < 24 && this.gameObject.sprite.currentAnim.name == "attack") {
            this.gameObject.Physics.vx += 24 * Math.sign(p.x - m.x);
        } else if (this.gameObject.sprite.currentAnim.name == "attack") {
            this.gameObject.Physics.vx = 0;
        }
    }
    if (this.running && dist > 150) {
        this.running = false;
    }
    if (dist < (24) && this.iswalking == false && this.gameObject.sprite.currentAnim.name != "prepare" && this.gameObject.sprite.currentAnim.name != "attack" && this.running == false) {
        this.gameObject.position.scaleX = Math.sign((m.x - p.x));
        this.gameObject.Physics.vx = 0
        this.gameObject.sprite.playOnceAnim("prepare", function () {
                var o = undefined;
                if ($this.MonsterType == "Vampire")
                    o = createDestroyer($this.gameObject.name.value, 4, -8, 16, 8);
                else
                    o = createDestroyer($this.gameObject.name.value, 16, 0, 8, 8);
                $this.gameObject.sprite.playOnceAnim("attack", function () {
                    if ($this.MonsterType == "Vampire") {
                        $this.gameObject.Physics.vx = 0;
                        $this.gameObject.sprite.playOnceAnim("idle", function () {
                            $this.gameObject.sprite.playOnceAnim("walk", function () {
                                $this.iswalking = false;
                            });
                        });
                    } else {
                        $this.running = true;
                        $this.gameObject.sprite.loopAnim("walk");
                        $this.gameObject.position.scaleX = Math.sign((p.x - m.x));
                    }
                    o.remove();
                });
            
        });
    } else if (this.gameObject.sprite.currentAnim.name != "attack" && this.gameObject.sprite.currentAnim.name != "prepare" && this.gameObject.sprite.currentAnim.name != "idle" && this.iswalking == true) {

        if (this.gameObject.Physics.wall == objects.main.Physics.wall && !this.running) {

            this.gameObject.position.scaleX = Math.sign((m.x - p.x));
            this.gameObject.Physics.vx = this.vx * this.gameObject.position.scaleX;
        } else {
            var w = game.renderer.width;
            if (this.gameObject.Physics.checkWalls(this.gameObject.position.x + 16 * this.gameObject.position.scaleX, this.gameObject.position.y + 16)
                && (this.gameObject.position.x + 16 * this.gameObject.position.scaleX) > (objects.Director.Director.left)
                && (this.gameObject.position.x + 16 * this.gameObject.position.scaleX) < (objects.Director.Director.right)
            ) {
                this.gameObject.Physics.vx = this.gameObject.position.scaleX * this.vx * (this.running ? 2 : 1);
            } else {
                this.running = false;
                this.gameObject.position.scaleX *= -1;
                this.gameObject.Physics.vx = this.gameObject.position.scaleX * this.vx;
            }

        }

    }
    if (this.gameObject.sprite.currentAnim.name == "walk" && this.iswalking == false) {
        var prevx = this.gameObject.Physics.vx;
        this.gameObject.Physics.vx = 0;
        if (this.MonsterType == "Vampire") {
            $this.gameObject.sprite.playOnceAnim("walk", function () {
                $this.iswalking = false;
            });
            $this.iswalking = true;
            $this.gameObject.Physics.vx = prevx;
        } else {
            $this.gameObject.sprite.playOnceAnim(($this.running ? "smallidle" : "idle"), function () {
                if ($this.gameObject.sprite.currentAnim.name == "idle")
                    $this.gameObject.Physics.vx = prevx;
                $this.gameObject.sprite.playOnceAnim("walk", function () {
                    $this.iswalking = false;
                });
            });
            $this.iswalking = true;
        }
    }
}
gm.imp.prototype.dispose = function () {

}

function createDestroyer(parent, x, y, w, h, func, name) {

    var o = objects[addPrefab(name ? name : "HeroDestroyer.prefab", {
        position: {
            x: x,
            y: y,
            width: w,
            height: h,
            parent: parent,
            zOrder: -1
        },

    })[0]];
    o.Physics.onCollision = {
        main: function (other, me) {
            if (other.life && other.life.remaining > 0 && other.life.invulnerable <= 0) {
                other.life.decreaseBy(me.name.value);
                if (func) {
                    func();
                }
            }
        }
    }
    return o;
}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
