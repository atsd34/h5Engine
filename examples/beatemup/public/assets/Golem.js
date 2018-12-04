gm.Golem = function () {
    //this.worksInEditor=false;
    this.vx = 50;
}
function smoke(x, y) {
    addPrefab("smoke.prefab", {
        position: {
            x: x,
            y: y
        }
    });
}
gm.Golem.prototype.create = function () {
    this.vx = 40 + Math.random() * 40;
    this.gameObject.Physics.onCollision = {
        main: function (other, me) {

            if (me.sprite.currentAnim.name == "run" && Math.abs(me.position.x - other.position.x) < 10) {
                if (other.life && other.life.remaining > 0 && other.life.invulnerable <= 0) {
                    other.life.remaining -= 2;
                    me.life.remaining = 0;
                    smoke(me.position.x + 8, me.position.y);
                    smoke(me.position.x - 8, me.position.y);
                    smoke(me.position.x, me.position.y - 8);
                    smoke(me.position.x, me.position.y + 8);
                }
            }
        }
    }
}
gm.Golem.prototype.update = function (dt) {
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
        this.gameObject.sprite.playOnceAnim("die", function () {
            $this.gameObject.remove();

        });
    }
    if (this.gameObject.sprite.currentAnim.name == "die") {
        this.gameObject.Physics.vx = 0;
        return;
    }
    var m = objects.main.position;
    this.gameObject.position.scaleX = Math.sign(this.gameObject.Physics.vx);
    var dist = Math.sqrt((p.x - m.x) * (p.x - m.x) + (p.y - m.y) * (p.y - m.y));
    if (dist < 150 && objects.main.Physics.grounded
        && (this.gameObject.sprite.currentAnim.name == "run" || dist > 80)) {
        if (this.gameObject.sprite.currentAnim.name != "run") {
            this.gameObject.sprite.loopAnim("run");
            this.gameObject.Physics.vx = Math.sign(m.x - p.x) * 3 * this.vx;
        }
        if (dist > 80)
            this.gameObject.Physics.vx = Math.sign(m.x - p.x) * 3 * this.vx;
    }
    else {
        if (this.gameObject.sprite.currentAnim.name != "walk") {
            this.gameObject.sprite.loopAnim("walk");
            this.gameObject.Physics.vx = Math.sign(this.gameObject.Physics.vx) * this.vx;
        }
        if (dist < 150) {
            this.gameObject.Physics.vx = Math.sign(m.x - p.x) * -1 * this.vx;
        }
        else if (this.gameObject.Physics.vx == 0)
            this.gameObject.Physics.vx = 1 * this.vx;
        else if (!(this.gameObject.Physics.checkWalls(this.gameObject.position.x + 16 * this.gameObject.position.scaleX, this.gameObject.position.y + 16)
            && (this.gameObject.position.x + 16 * this.gameObject.position.scaleX) > (objects.Director.Director.left)
            && (this.gameObject.position.x + 16 * this.gameObject.position.scaleX) < (objects.Director.Director.right))
        )
            if (this.gameObject.position.x > objects.Director.Director.left
                || (this.gameObject.position.x) < objects.Director.Director.right)
                this.gameObject.Physics.vx = Math.sign(m.x - p.x) * this.vx;
            else
                this.gameObject.Physics.vx = Math.sign(this.gameObject.Physics.vx) * -1 * this.vx;
    }
}
gm.Golem.prototype.dispose = function () {

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
