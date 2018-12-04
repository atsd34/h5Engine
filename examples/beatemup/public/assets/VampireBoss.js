gm.VampireBoss = function () {
    //this.worksInEditor=false
    this.preLife = 0;
    this.attacking = false;
    this.idle = false;
    this.vampires = {};
}
gm.VampireBoss.prototype.create = function () {
    this.preLife = this.gameObject.life.remaining;
}
gm.VampireBoss.prototype.update = function (dt) {
    var $this = this;
    var p = this.gameObject.position;
    if (this.preLife != this.gameObject.life.remaining) {
        this.gameObject.life.invulnerable = 1;
    }
    if (this.gameObject.life.remaining == 0) {
        if (this.gameObject.sprite.currentAnim.name != "die") {
            addPrefab("VampireCloud.prefab", {
                position: {
                    x: p.x,
                    y: p.y
                }

            });
            this.gameObject.sprite.playOnceAnim("die", function () {


            });
            this.gameObject.Physics.gravityFactor = 1;
            this.gameObject.Physics.vx = 0;
            return;
        }
        else {
            return;
        }
    }
    if (monsterActivation(this))
        return;
    if (this.attacking)
        return;
    if (this.preLife != this.gameObject.life.remaining) {
        //next action
        if (this.preLife == 8 || this.preLife == 6 || this.preLife == 4 || this.preLife == 2) {
            addPrefab("VampireCloud.prefab", {
                position: {
                    x: p.x,
                    y: p.y
                }

            });
            p.x = 124;
            p.scaleX = -1;

        } else  {
            this.gameObject.Physics.gravityFactor = 0;
            this.gameObject.Physics.vx = -120;
            addPrefab("VampireCloud.prefab", {
                position: {
                    x: p.x,
                    y: p.y
                }

            });
            addPrefab("VampireCloud.prefab", {
                position: {
                    x: -300,
                    y: -283
                }
            });
            this.vampires.v1 = addPrefab("Vampire.prefab", {
                position: {
                    x: -300,
                    y: -283
                }

            })[0];
            addPrefab("VampireCloud.prefab", {
                position: {
                    x: 220,
                    y: -283
                }
            });
            this.vampires.v2 = addPrefab("Vampire.prefab", {
                position: {
                    x: 220,
                    y: -283
                }

            })[0];
            addPrefab("VampireCloud.prefab", {
                position: {
                    x: -43,
                    y: -283
                }
            });
            this.vampires.v3 = addPrefab("Vampire.prefab", {
                position: {
                    x: -43,
                    y: -283
                }

            })[0];

            this.gameObject.sprite.loopAnim("fly");
        }

    } else {
        if (this.gameObject.sprite.currentAnim.name == "a1") {
            $this.idle = true;
            this.gameObject.sprite.playOnceAnim("idle1", function () {
                $this.idle = false;

            });
        }
        else if (this.gameObject.sprite.currentAnim.name == "a2") {
            $this.idle = true;
            this.gameObject.sprite.playOnceAnim("idle2", function () {
                $this.idle = false;

            });
        }
        else if (this.gameObject.sprite.currentAnim.name == "idle1" && $this.idle == false) {
            this.attacking = true;
            this.gameObject.sprite.playOnceAnim("a2", function () {
                var o = createDestroyer("", p.x + p.scaleX * 20, p.y, 32, 32, undefined, "batWeapon.prefab");
                o.Physics.vx = p.scaleX * 150;
                o.Physics.vy = -80;
                $this.attacking = false;
            });

        } else if (this.gameObject.sprite.currentAnim.name == "idle2" && $this.idle == false) {
            this.attacking = true;
            this.gameObject.sprite.playOnceAnim("a1", function () {
                var o = createDestroyer("", p.x + p.scaleX * 20, p.y, 32, 32, undefined, "batWeapon.prefab");
                o.Physics.vx = p.scaleX * 180;
                $this.attacking = false;
            });

        } else if (this.gameObject.sprite.currentAnim.name == "fly") {
            if (objects[this.vampires.v1] == undefined &&
                objects[this.vampires.v2] == undefined &&
                objects[this.vampires.v3] == undefined) {
                addPrefab("VampireCloud.prefab", {
                    position: {
                        x: p.x,
                        y: p.y
                    }

                });
                p.x = -190;
                p.y = -200;
                this.gameObject.Physics.gravityFactor = 1;
                this.gameObject.Physics.vx = 0;
                p.scaleX = 1;
                $this.idle = true;
                this.gameObject.sprite.playOnceAnim("idle1", function () {
                    $this.idle = false;

                });
                return;

            }
            this.gameObject.life.invulnerable = 0.1;
            if (this.gameObject.position.y > -375) {
                this.gameObject.Physics.vy = -150;
            } else {
                this.gameObject.Physics.vy = 0;

                var dx = Math.abs(this.gameObject.position.x - objects.main.position.x);
                if (dx < 10) {
                    var bb = getByTagName("BloodBall");
                    if (bb == undefined || bb.length == 0) {
                        var nb =objects[ addPrefab("BloodBall.prefab", {
                            position: {
                                x: p.x,
                                y: p.y
                            }
                        })[0]];
                        nb.sprite.playOnceAnim("default", function () {
                            nb.sprite.loopAnim("rotate");
                        });
                        var o = createDestroyer(nb.name.value, 0, 0, 32, 32, function () {
                            o.remove();
                        });
                        setTimeout(function () {
                            o.remove();
                            nb.remove();
                        }, 1800);
                    }
                }

            }

            if (this.gameObject.position.x > 260) {
                this.gameObject.Physics.vx = -90;
            } else if (this.gameObject.position.x < -335) {
                this.gameObject.Physics.vx = 90;
            }
        }


    }
    this.preLife = this.gameObject.life.remaining;

}
gm.VampireBoss.prototype.dispose = function () {

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
