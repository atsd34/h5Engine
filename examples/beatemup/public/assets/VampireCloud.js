gm.VampireCloud = function(){ 
	//this.worksInEditor=false;
}
gm.VampireCloud.prototype.create = function () {
    var $this = this;

    this.gameObject.sprite.playOnceAnim("default", function () {
        $this.gameObject.remove();
    });
}
gm.VampireCloud.prototype.update=function (dt) {

}
gm.VampireCloud.prototype.dispose=function () {

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
