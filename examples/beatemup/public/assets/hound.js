gm.hound = function () {
    //this.worksInEditor=false;
    this.requires = "stun";
    this.type = "far";

}
gm.hound.prototype.create = function () {
    this.gameObject.sprite.playOnceAnim("default");
    if (this.type == "far")
        this.gameObject.sprite.path = "houndbrown.png";
}
gm.hound.prototype.update = function (dt) {
    var $this = this;
    var p = this.gameObject.position;
    var g = this.gameObject;
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
        this.gameObject.tint.tint = 0xffffff;
        this.gameObject.sprite.playOnceAnim("die", function () {

        });
    }
    if (this.gameObject.sprite.currentAnim.name == "die") {
        this.gameObject.Physics.vx = 0;
        if (this.gameObject.position.rotation != 0)
            this.gameObject.position.rotation = 0;
        return;
    }
    if (this.gameObject.stun.stunned == 0) {
        if (this.gameObject.sprite.currentAnim.name == "walk" && $this.gameObject.Physics.vx == 0) {
            $this.gameObject.sprite.loopAnim("attack");
            $this.gameObject.Physics.vy = -500;
            $this.gameObject.Physics.vx = $this.gameObject.position.scaleX * -200;
            $this.o = createDestroyer($this.gameObject.name.value, 0, 0, 32, 24);
        }
    }

    if (this.gameObject.sprite.currentAnim.name == "attack") {
        if (this.gameObject.Physics.vy == 0) {
            this.gameObject.Physics.vx = 0;
            this.gameObject.sprite.playOnceAnim("default");
            this.gameObject.position.rotation = 0;
            $this.o.remove();
            return;
        }
        else if (this.gameObject.Physics.vy > 0) {
            this.gameObject.position.rotation = -90 * $this.gameObject.position.scaleX;
            $this.gameObject.Physics.vx = $this.gameObject.position.scaleX * -100;
        }
        else {
            this.gameObject.position.rotation = 0;
        }
    }
    if (this.gameObject.sprite.sprite.playing == true)
        return;
    var m = objects.main.position;
    if (this.gameObject.Physics.vx != 0)
        this.gameObject.position.scaleX = Math.sign(this.gameObject.Physics.vx);
    var dist = Math.sqrt((p.x - m.x) * (p.x - m.x) + (p.y - m.y) * (p.y - m.y));
    if (dist < (this.type == "far" ? 150 : 40)) {
        this.gameObject.Physics.vx = 0;
        this.gameObject.position.scaleX = Math.sign(p.x - m.x);
        this.gameObject.sprite.playOnceAnim("default", function () {
            if ($this.gameObject.stun.stunned == 0 && $this.gameObject.life.remaining > 0) {
                $this.gameObject.sprite.loopAnim("attack");
                $this.gameObject.Physics.vy = -500;
                $this.gameObject.Physics.vx = $this.gameObject.position.scaleX * -200;
                $this.o = createDestroyer($this.gameObject.name.value, 0, 0, 32, 24);
            }
        });

    } else if (dist < 350) {
        this.gameObject.position.scaleX = Math.sign(p.x - m.x);
        this.gameObject.sprite.playOnceAnim("walk", function () {
        });
        $this.gameObject.Physics.vx = $this.gameObject.position.scaleX * -50;

    } else {
        this.gameObject.sprite.playOnceAnim("default");
        this.gameObject.Physics.vx = 0;
    }

}
gm.hound.prototype.dispose = function () {

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
