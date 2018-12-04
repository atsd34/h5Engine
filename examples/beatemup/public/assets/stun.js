gm.stun = function () {
    //this.worksInEditor=false;
    this.stunned = 0;
    this.preLife = 0;
    this.requires = "tint";
    this.normaltint = "0xffffff";
}
gm.stun.prototype.create = function () {
    this.preLife = this.gameObject.life.remaining;
}
gm.stun.prototype.update = function (dt) {
    if (this.preLife != this.gameObject.life.remaining && this.gameObject.life.remaining != 0)
        this.stunned = 400;
    this.preLife = this.gameObject.life.remaining;
    if (this.stunned > 0 && this.gameObject.life.remaining > 0) {
        this.stunned -= dt;
        this.gameObject.tint.tint = Math.random() > 0.5 ? 0 : this.normaltint;
    } else {
        if (this.gameObject.tint.tint != this.normaltint)
            this.gameObject.tint.tint = this.normaltint;
        this.stunned = 0;
    }
}
gm.stun.prototype.dispose = function () {

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
