gm.Main = function () {
    this.grounded = 0;
    this.onRope = false;
    this.ropePosition = {};
    this.flySpeed = 0;
    this.landing = false;
    this.prex = 0;
    this.vSpeed = 6;
    this.preSwingSpeed = 0;
    this.ay = -54;
    this.ax = 0;
    this.ropeLen = 20;
    this.priorty = 1;
}
gm.Main.prototype.dispose = function () {
    gameContainer.removeChild(this.graphics);
    if (this.graphics.destroy)
        this.graphics.destroy();
    gameContainer.removeChild(this.graphics2);
    if (this.graphics2.destroy)
        this.graphics2.destroy();
}
gm.Main.prototype.create = function () {
    $("canvas").trigger("mousedown");
    $("canvas").trigger("touchstart");
    this.graphics = new PIXI.Graphics();
    this.graphics.zOrder = -1;
    this.graphics2 = new PIXI.Graphics();
    this.graphics2.zOrder = 99;
    objects.MainSprite0.position.zOrder = 1;
    gameContainer.addChild(this.graphics);
    gameContainer.addChild(this.graphics2);
}
gm.Main.prototype.update = function (dt) {
    this.prex = this.gameObject.position.x;
    this.graphics.clear();
    this.graphics2.clear();
    if (this.onRope) {
        {
            if (this.gameObject.position.x < 3100 && this.gameObject.position.x > 3000) {
                pausedUpdate = true;
                objects.Tip1.text.text = "";
                objects.Tip2.text.text = "";
                objects.Tip3.text.text = "Click/Touch again to release";
            }
            var dx = this.ropePosition.x - objects.Torso.position.getX();
            var dy = this.ropePosition.y - objects.Torso.position.getY();
            var rx = this.ropePosition.x;
            var ry = this.ropePosition.y;
            var len = Math.sqrt(dx * dx + dy * dy);
            if (this.ropeLen < len) {
                rx = dx * this.ropeLen / len + objects.Torso.position.getX();
                ry = dy * this.ropeLen / len + objects.Torso.position.getY();
                this.ropeLen += 80;
            }
            else {
                if (this.rope.sprite.path == "hook.png")
                    this.rope.sprite.path = "hook2.png";
            }
            this.graphics.moveTo(objects.Torso.position.getX(), objects.Torso.position.getY() - 40);
            this.graphics.lineStyle(12, 0xFFCC99, 1);
            var d = {
                x: rx,
                y: ry
            };
            this.graphics.lineTo(d.x, d.y);

            this.graphics.moveTo(objects.Torso.position.getX() + 6, objects.Torso.position.getY() - 40);
            this.graphics.lineStyle(4, 0x663300, 1);
            var d = {
                x: rx + 6,
                y: ry
            };
            this.graphics.lineTo(d.x, d.y);

            this.graphics.moveTo(objects.Torso.position.getX() - 6, objects.Torso.position.getY() - 40);
            this.graphics.lineStyle(4, 0x663300, 1);
            var d = {
                x: rx - 6,
                y: ry
            };
            this.graphics.lineTo(d.x, d.y);


            this.graphics2.moveTo(objects.Torso.position.getX() - 23, objects.Torso.position.getY() - 12);
            this.graphics2.lineStyle(12, 0xFFCC99, 1);
            var d = {
                x: rx,
                y: ry
            };
            this.graphics2.lineTo(d.x, d.y);

            this.graphics2.moveTo(objects.Torso.position.getX() - 17, objects.Torso.position.getY() - 12);
            this.graphics2.lineStyle(4, 0x663300, 1);
            var d = {
                x: rx + 6,
                y: ry
            };
            this.graphics2.lineTo(d.x, d.y);

            this.graphics2.moveTo(objects.Torso.position.getX() - 30, objects.Torso.position.getY() - 12);
            this.graphics2.lineStyle(4, 0x663300, 1);
            var d = {
                x: rx - 6,
                y: ry
            };
            this.graphics2.lineTo(d.x, d.y);


        }
        var vspeedNow = this.gameObject.Physics.body.GetLinearVelocity().x;
        if (Math.sign(vspeedNow) == 1 && Math.sign(this.preSwingSpeed) == -1) {
            if (objects.MainSprite0.objectAnimator.playing != "swingforward")
                objects.MainSprite0.objectAnimator.playXTimes("swingforward", 1);
        }
        if (Math.sign(vspeedNow) == -1 && Math.sign(this.preSwingSpeed) == 1) {
            if (objects.MainSprite0.objectAnimator.playing != "swingback")
                objects.MainSprite0.objectAnimator.playXTimes("swingback", 1);
        }
        if (vspeedNow != 0)
            this.preSwingSpeed = vspeedNow;
    } else if (this.grounded &&
        (objects.Main.position.y) > (objects.Director.Director.floorY - 132)
    ) {
        this.landing = false;
        verticalSpeed(this.gameObject.Physics.body, this.vSpeed);
        if (this.gameObject.position.x < 1300 && this.gameObject.position.x > 1200) {
            pausedUpdate = true;
            objects.Tip1.text.text = "Click/Touch to jump through";
        }
        if (this.gameObject.position.x < 2300 && this.gameObject.position.x > 2200) {
            pausedUpdate = true;
            objects.Tip1.text.text = "";
            objects.TipJump.text.text = ""
            objects.TipJump.text.text = "Jump again!"
        }
        if (objects.MainSprite0.objectAnimator.playing != "walk") {
            objects.MainSprite0.objectAnimator.loop("walk");
            objects.MainSprite0.objectAnimator.fun = function () {
                objects.Main.Sound.volume = 2;
                objects.Main.Sound.path = "step2.mp3";
                objects.Main.Sound.Play();
            }
        }
    } else if (this.flySpeed > 0) {
        if (objects.MainSprite0.objectAnimator.playing != "jump")
            objects.MainSprite0.objectAnimator.playXTimes("jump", 1);
        verticalSpeed(this.gameObject.Physics.body, this.flySpeed);

    } else {

        if (this.gameObject.position.x < 2600 && this.gameObject.position.x > 2500) {
            pausedUpdate = true;

            objects.Tip1.text.text = "";
            objects.TipJump.text.text = ""
            objects.Tip2.text.text = "Click/Touch again midair to hang";
        }
    }
}
gm.Main.prototype.mouseDown = function (m, e) {
    if (objects["Menu"] || (objects.Pause && objects.Pause.PauseGame.paused == true))
        return;
    pausedUpdate = false;
    if (this.onRope) {
        this.ropeLen = 20;
        this.gameObject.removeComponent("revoluteConstraint");
        objects.Director.Sound.path = "oof.mp3";
        objects.Director.Sound.Play();
        this.rope.sprite.path = "hook.png"
        this.rope = null;
        this.onRope = false;
        this.gameObject.Physics.velocityY = -300;
        this.landing = true;
        objects.Torso.sprite.path = "mainsprites\\torso.png";
        if (objects.MainSprite0.objectAnimator.playing != "swingback")
            objects.MainSprite0.objectAnimator.playXTimes("swingback", 1);
    } else if (this.grounded > 0 &&
        (objects.Main.position.y) > (objects.Director.Director.floorY - 192)) {
        objects.Director.Sound.path = "hop.mp3";
        objects.Director.Sound.Play();
        this.grounded = 0;
        this.gameObject.Physics.body
            .SetLinearVelocity(new box2d.b2Vec2(this.vSpeed, -800));
        this.landing = false;
        objects.MainSprite0.objectAnimator.playXTimes("jump", 1);
    } else if (!this.landing && this.gameObject.position.y < (objects.Director.Director.floorY - 120)) {
        var closest = this.findClosest();
        if (closest != undefined) {
            var dx = closest.obj.position.x - this.gameObject.position.x;
            var dy = closest.obj.position.y - this.gameObject.position.y;
            var len = Math.sqrt(dx * dx + dy * dy) + 128;
            if (len < (objects.Director.Director.floorY -
                closest.obj.position.y)) {
                this.gameObject.addComponent("revoluteConstraint", {
                    AnchorX: this.ax,
                    AnchorY: this.ay,
                    otherGameObjectName: closest.obj.name.value
                });
                objects.Torso.sprite.path = "mainsprites\\torsohang.png";
                if (objects.MainSprite0.objectAnimator.playing != "swingforward")
                    objects.MainSprite0.objectAnimator.playXTimes("swingforward", 1);
                this.ropePosition = {
                    x: closest.obj.position.x,
                    y: closest.obj.position.y
                };
                this.rope = closest.obj;
                verticalSpeed(this.gameObject.Physics.body, this.gameObject.Physics.body
                    .GetLinearVelocity().x * 3 / 2);
                this.onRope = true;
                this.flySpeed = 0;
                this.landing = false;
            }
        }
    }
}
gm.Main.prototype.beginContact = function (other) {
    if (other.name.tagName == "ground") {
        this.grounded++;
        if (this.grounded > 0) {
            verticalSpeed(this.gameObject.Physics.body, this.vSpeed);
            this.flySpeed = 0;
            if (this.onRope) {

                this.gameObject.Physics.velocityY = -300;

            }
        }
    } 
    if (other.name.tagName == "Vial") {
        other.sprite.path = "lightoff.png";
    }
    if (other.name.tagName == "obstacle") {
        var obj = objects[addPrefab("Explode.prefab", {
            position: { x: this.gameObject.position.x, y: this.gameObject.position.y }
        })[0]];
        obj.position.other = other;
        this.gameObject.remove();
        if (localStorage.highestEscapeEvilCorpScore == undefined)
            localStorage.highestEscapeEvilCorpScore = 0;
        if (localStorage.highestEscapeEvilCorpScore < objects.Director.Director.score)
            localStorage.highestEscapeEvilCorpScore = objects.Director.Director.score;
        objects.Director.Sound.volume = 40;
        objects.Director.Sound.path = "saw.mp3";
        objects.Director.Sound.onFinish = [function () {
            objects.Director.Director.canRestart = true;
            objects.Director.Sound.onFinish = [];
        }];
        objects.Director.Sound.Play();
        GetComponents("PauseGame")[0].gameObject.position.x = -5000;
        setTimeout(function () {
            objects.Director.Achievments.save();
            var w = game.renderer.width;
            createGameObject({
                name: {
                    value: "PlayAgain"
                },
                position: {
                    x: -496,
                    y: 100,
                    zOrder: 9999,
                    isGuiElement: true,
                    centerAligned: true
                },
                MetroButton: {
                    color: 0x8abb25,
                    text: "Play Again",
                    function: "PlayAgain()",
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
                    x: -496 + 512 + 64,
                    y: 100,
                    zOrder: 9999,
                    isGuiElement: true,
                    centerAligned: true
                },
                MetroButton: {
                    color: 0xfbbb25,
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
                    , 0xffbb75, cont, (cc.done ? "ok.png" : undefined),true);
            }
            cont.rotatable = false;
            setTimeout(function () {
               
                    objects.Director.Achievments.dispose();
                    objects.Director.Achievments.create();
                    for (var i = cont.children.length - 1; i >= 0; i--) {
                        cont.removeChild(cont.children[i]);
                    }
                    for (var i = 0; i < objects.Director.Achievments.current.length; i++) {
                        var cc = objects.Director.Achievments.current[i];
                        ListItem(64, 128 + i * 128, 960, 112, cc.description
                            + (cc.progress ? " (Current:" + parseInt(cc.progress) + ")" : "")
                            , 0xffbb75, cont, (cc.done ? "ok.png" : undefined), true);
                    }
                
            }, 2000);
            createGameObject({
                name: {
                    value: "AchievementsDead"
                },
                position: {
                    x: -496,
                    y: 676,
                    zOrder: 9999,
                    isGuiElement: true,
                    centerAligned: true
                },
                MetroButton: {
                    color: 0xe89b25,
                    text: "Missions" + objects.Director.Achievments.getText(),

                    alpha: 0.5,
                    function: "",
                    sizeX: 1088,
                    sizeY: 512,
                    icon: undefined,
                    sprite: cont
                }
            });
        }, 1800);
    }
}
function PlayAgain() {
    loadScene(currentSceneName);
    camera.x = 0;
    PlayGame();
}
function GoMenu() {
    loadScene(currentSceneName);
    camera.x = 0;
}
gm.Main.prototype.findClosest = function (name) {
    if (name == undefined)
        name = "ropePoint";
    var closest = undefined;
    var nodes = getByTagName(name);
    for (var i = 0; i < nodes.length; i++) {
        var item = nodes[i];
        if (item.position.x > objects.Main.position.x) {
            var dx = objects.Main.position.x - item.position.x;
            var dy = objects.Main.position.y - item.position.y;
            var len = Math.sqrt(dx * dx + dy * dy);
            if (closest == undefined || len < closest.len) {
                closest = {
                    len: len,
                    obj: item
                }
            }
        }
    }
    return closest;
}
//other events are : 
//Secondary Create : afterCreate 
//Physics : beginContact,endContact,impact 
//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove

function verticalSpeed(body, num) {
    var v = body.GetLinearVelocity();
    body.SetLinearVelocity(new box2d.b2Vec2(num, v.y));
}