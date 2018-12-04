gm.sound = function(){ 
	//this.worksInEditor=false;
    this.priorty = 99;
}
gm.sound.prototype.create=function () {
    if (soundoff) {
        this.gameObject.sprite.path = "soundoff.png";
    } else {
        this.gameObject.sprite.path = "soundon.png";
    }
}
gm.sound.prototype.update=function (dt) {

}
gm.sound.prototype.mouseDownOnMe=function () {
    if (soundoff) {
        this.gameObject.sprite.path = "soundon.png";
        soundOn();
    } else {
        this.gameObject.sprite.path = "soundoff.png";
        soundOff();
    }
    return true;
}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
