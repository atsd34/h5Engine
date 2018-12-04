gm.treant = function(){ 
	//this.worksInEditor=false;
    this.nextAction = "idle";
    this.requires = "stun";
}
gm.treant.prototype.create = function () {
    var g = this.gameObject;
    g.sprite.playOnceAnim("idle");

}
gm.treant.prototype.update = function (dt) {
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
                $this.gameObject.remove();
            
        });
    }
    if (this.gameObject.sprite.currentAnim.name == "die")
        return;
    var m = objects.main.position;
    var dist = Math.sqrt((p.x - m.x) * (p.x - m.x) + (p.y - m.y) * (p.y - m.y));
    if (dist < 320) {
        if (g.sprite.sprite.playing == false) {
            if (this.gameObject.sprite.currentAnim.name == "idle") {
                if (p.x > m.x) {
                    p.scaleX = -1;
                }
                else
                    p.scaleX = 1;
                if ($this.gameObject.stun.stunned == 0) {
                    g.sprite.playOnceAnim("attack", function () {
                        var o = objects[addPrefab("LaserBeam.prefab", {
                            position: {
                                x: 0,
                                y: -3,
                                parent: g.name.value,
                                zOrder: 2
                            },
                            Physics: {
                                vx: 600
                            }
                        })[0]];
                    });
                }
            }
            else
                g.sprite.playOnceAnim("idle");
        }
    } else {
        g.sprite.playOnceAnim("idle");
    }
}
gm.treant.prototype.dispose=function () {

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
