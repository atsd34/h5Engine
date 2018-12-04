gm.main = function () {
    //this.worksInEditor=false;
    this.currentE = new Array();
    this.combo = 0;
    this.notgrounded = 0;
    this.prea = "";
    this.stunned = false;
}
gm.main.prototype.create = function () {
    var $this = this;
    //(function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = 'http://rawgit.com/mrdoob/stats.js/master/build/stats.min.js'; document.head.appendChild(script); })()
    this.gameObject.Physics.onCollision.NewLife = function (other, me) {
        other.remove();
        me.life.remaining += 2;
        if (me.life.remaining > 8)
            me.life.remaining = 8; //test
    }
}
gm.main.prototype.removeChilds = function () {
    if (childrenGameObject["main"] && childrenGameObject["main"].length > 0) {
        for (var i = 0; i < childrenGameObject["main"].length; i++) {
            try {
                objects[childrenGameObject["main"][i]].remove();
            } catch (e) {

            }
        }
    }
}
gm.main.prototype.update = function (dt) {
    if (this.gameObject.position.x < objects.Director.Director.minVisibleX)
        this.gameObject.position.x = objects.Director.Director.minVisibleX;
    else if (this.gameObject.position.x > objects.Director.Director.maxVisibleX)
        this.gameObject.position.x = objects.Director.Director.maxVisibleX;

    if ((this.gameObject.position.y - 16) < objects.Director.Director.minVisibleY && this.gameObject.Physics.vy < 0)
        this.gameObject.Physics.vy = 0;

    if (this.gameObject.Physics.grounded == false && (mainanim() == "idle" || mainanim() == "walk")) {
        this.notgrounded++;
        if (this.notgrounded > 4) {
            mainanim("jumpfinish");
            this.jumping = true;
        }
    } else {
        this.notgrounded = 0;
    }
    if (objects.main.life.remaining <= 0 && mainanim() != "die")
        mainanim("die");
    if (mainanim() == "die") {
        this.gameObject.Physics.vx = 0;
        return;
    }
    if (this.stunned) {
        this.gameObject.tint.tint = Math.random() > 0.5 ? 0 : 0xffffff;
        return;
    }
    else {
        if (this.gameObject.tint.tint != 0xffffff)
            this.gameObject.tint.tint = 0xffffff;

    }
    if (this.combo == 4)
        this.gameObject.Physics.vy = -30;
    if ((this.jumping || this.combo == 9) && this.gameObject.Physics.grounded == true) {
        this.gameObject.position.rotation = 0;
        mainanim("idle", true);
        this.jumping = false;
        this.combo = 0;
        this.comboing = false;
        this.gameObject.Physics.vx = 0;
        this.removeChilds();
    }
    if (this.jumping && this.gameObject.Physics.vy > 0)
        mainanim("jumpfinish");
    if (this.combo == 9 && this.gameObject.Physics.vy > 0)
        this.gameObject.position.rotation = 0;
    if (this.combo == 0 && this.jumping != true) {
        if (this.currentE.indexOf(37) != -1 || this.currentE.indexOf(39) != -1) {
            mainanim("walk", true)
            this.removeChilds();
        }
        else
            mainanim("idle", true)
        this.removeChilds();
        this.gameObject.Physics.vx = 0;

    }
    for (var i = 0; i < this.currentE.length; i++) {
        if (this.currentE[i] == 37) { //left
            if ([3, 4].indexOf(this.combo) == -1) {
                objects.main.position.scaleX = -1;
                if (this.gameObject.Physics.vx > 0)
                    this.gameObject.Physics.vx *= -1;
            }
            if (this.jumping) {
                this.gameObject.Physics.vx = -100;
            }
            else if (this.combo == 0)
                this.gameObject.Physics.vx = -80;
        }
        else if (this.currentE[i] == 39) { //right
            if ([3, 4].indexOf(this.combo) == -1) {
                objects.main.position.scaleX = 1;
                if (this.gameObject.Physics.vx < 0)
                    this.gameObject.Physics.vx *= -1;
            }

            if (this.jumping) {
                this.gameObject.Physics.vx = 100;
            }
            else if (this.combo == 0)
                this.gameObject.Physics.vx = 80;
        }


    }
}
var mainanim = function (name, loop) {
    if (!name)
        return objects.main.sprite.currentAnim.name;
    else {
        if (mainanim() == "die" || mainanim() == name) {
            return;
        }
        if (typeof (loop) == "function" || loop == undefined) {
            objects.main.sprite.playOnceAnim(name, loop ? loop : function () { });
        }
        else {
            objects.main.sprite.loopAnim(name);
        }
    }

}
gm.main.prototype.dispose = function () {

}
gm.main.prototype.keyPress = function (e) {
    if (mainanim() == "die")
        return;
    var $this = this;
    if (e.keyCode == 81) { //cheat
        var ms = getByTagName("enemy")
        for (var i = 0; i < ms.length; i++) {

            if (ms[i].life && ms[i].life.activated) {
                ms[i].life.remaining = 0;
            }
        }
    }

    if (e.keyCode == 88 || e.keyCode == 120) {
        if ($this.gameObject.Physics.grounded) {
            $this.jumping = true;
            $this.gameObject.Physics.grounded = false;
            $this.gameObject.Physics.vy = -500;
            mainanim("jump", function () { });
            $this.removeChilds();
        }
    }
    if (e.keyCode == 90 || e.keyCode == 122) {
        if (!this.jumping) {
            switch ($this.combo) {
                case 0:
                    if (this.gameObject.mana.remaining == 0)
                        return;
                    else
                        this.gameObject.mana.remaining--;
                    generalCombo(
                        function () {
                            $this.gameObject.Physics.vx = 150 * objects.main.position.scaleX;
                            setTimeout(function () {
                                $this.gameObject.Physics.vx = 0;
                            }, 30);

                        }, function () {


                        },
                        $this.combo, $this, 1000, { x: 8, y: 4, width: 10, height: 10 }, false, function (other) {
                            other.position.x += 5 * Math.sign(other.position.x - objects.main.position.x);
                        });
                    break;
                case 1:
                    generalCombo(function () {
                        $this.gameObject.Physics.vx = -200 * objects.main.position.scaleX;
                        setTimeout(function () {
                            $this.gameObject.Physics.vx = 0;
                        }, 30);
                    }, function () {
                    }, $this.combo, $this, 1000, { x: 8, y: 0, width: 24, height: 24 }, false, function (other) {
                        other.position.x += 5 * Math.sign(other.position.x - objects.main.position.x);
                    });
                    break;
                case 2:
                    generalCombo(function () {
                        $this.gameObject.Physics.vx = 0;

                    }, function () {
                    }, $this.combo, $this, 1000, { x: 0, y: 0, width: 40, height: 40 }, false, function (other) {
                        other.position.x += 5 * Math.sign(other.position.x - objects.main.position.x);
                        other.Physics.vy = -150;

                    });
                    break;
                case 3:
                    generalCombo(function () {
                        $this.gameObject.Physics.vx = 150 * objects.main.position.scaleX;
                    }, function () {
                    }, $this.combo, $this, 1000, { x: 8, y: 0, width: 12, height: 12 }, false, function (other) {

                    });
                    break;
                case 4:
                    generalCombo(function () {
                        $this.gameObject.Physics.vx = 0;
                    }, function () {
                    }, $this.combo, $this, 1000, { x: 8, y: 0, width: 12, height: 12 }, false, function (other) {
                        other.position.x += 5 * Math.sign(other.position.x - objects.main.position.x);
                        other.Physics.vy = -300;
                    });
                    break;
                case 5:
                    generalCombo(function () {
                        $this.gameObject.Physics.vx = 0;
                    }, function () {
                    }, $this.combo, $this, 1000, { x: 0, y: 0, width: 42, height: 12 }, false, function (other) {
                        other.position.x += 5 * Math.sign(other.position.x - objects.main.position.x);
                        other.Physics.vy = -200;
                    });
                    break;
                case 6:
                    generalCombo(function () {
                        $this.gameObject.Physics.vx = 0;
                    }, function () {
                    }, $this.combo, $this, 1000, { x: 8, y: 0, width: 12, height: 24 }, false, function (other) {
                        other.position.x += 5 * Math.sign(other.position.x - objects.main.position.x);
                        other.Physics.vy = -300;
                    });
                    break;
                case 7:
                    generalCombo(function () {
                        $this.gameObject.Physics.vx = 0;
                    }, function () {
                    }, $this.combo, $this, 1000, { x: 8, y: 0, width: 12, height: 24 }, false, function (other) {
                        other.position.x += 5 * Math.sign(other.position.x - objects.main.position.x);
                    });
                    break;
                case 8:
                    generalCombo(function () {
                        $this.gameObject.Physics.grounded = false;
                        $this.gameObject.Physics.vx = 166 * objects.main.position.scaleX;
                        $this.gameObject.Physics.vy = -500;
                        $this.gameObject.position.rotation = -90 * objects.main.position.scaleX;
                    }, function () {
                    }, $this.combo, $this, 10000, { x: 8, y: 16, width: 16, height: 16 }, true, function (other) {
                        other.position.x += 5 * Math.sign(other.position.x - objects.main.position.x);
                    });
                    break;
                default:
            }
        } else {
            if (this.gameObject.mana.remaining == 0 || this.gameObject.mana.remaining == 1)
                return;
            else
                this.gameObject.mana.remaining -= 2;
            this.comboing = false;
            this.combo = 8;
            this.jumping = false;
            generalCombo(function () {
                $this.gameObject.Physics.grounded = false;
                $this.gameObject.Physics.vx = 166 * objects.main.position.scaleX;
                $this.gameObject.Physics.vy = Math.abs($this.gameObject.Physics.vy);
            }, function () {
            }, $this.combo, $this, 10000, { x: 16, y: 16, width: 16, height: 16 }, true);

        }
    }
}
gm.main.prototype.keyDown = function (e) {
    if (this.currentE.indexOf(e.keyCode) == -1)
        this.currentE.push(e.keyCode);

}
gm.main.prototype.keyUp = function (e) {

    if (mainanim() == "die")
        return;
    var $this = this;
    for (var i = this.currentE.length - 1; i >= 0; i--) {
        if (this.currentE[i] == e.keyCode) {
            this.currentE.splice(i, 1);
        }
    }

}
function generalCombo(before, after, i, $this, timeOut, antimonster, loop, func) {
    if ($this.comboing && i !=0) {
        if ($this.next == undefined) {
            $this.next = function () {
                generalCombo(before, after, i, $this, timeOut, antimonster, loop);
            }
        }
        return;
    }
    $this.removeChilds();
    var o = undefined;
    if (antimonster) {
        o = objects[addPrefab("Antimonster.prefab", {
            position: {
                x: antimonster.x,
                y: antimonster.y,
                width: antimonster.width,
                height: antimonster.height,
                parent: "main"
            },

        })[0]];
        o.Physics.onCollision = {
            enemy: function (other) {
                if (other.life && other.life.remaining > 0 && other.life.invulnerable <= 0) {
                    if (func) {
                        if (other.life.decreaseBy(o.name.value)) {
                            func(other);
                        }
                    } else {

                        other.life.decreaseBy(o.name.value);
                    }
                }
            }
        }

    }
    before();
    $this.comboing = true;

    if (timeOut == undefined)
        timeOut = 1000;
    $this.combo = i + 1;
    var check = $this.combo;
    if (loop) {
        mainanim("a" + $this.combo, true);
    } else {
        mainanim("a" + $this.combo, function () {
            $this.comboing = false;
            after();
            if ($this.next) {
                $this.next();
                $this.next = undefined;
            }
        });
    }
    setTimeout(function () {
        if ($this.combo == check) {
            $this.combo = 0;
            $this.gameObject.Physics.vx = 0;
            mainanim("idle", true)
            $this.gameObject.position.rotation = 0;
            $this.comboing = false;
            $this.next = undefined; 
            $this.combo = 0;

        }
    }, timeOut);
}


	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
