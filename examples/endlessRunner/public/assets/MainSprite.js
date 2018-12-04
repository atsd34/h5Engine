gm.MainSprite = function(){ 
	//this.worksInEditor=false;
}
gm.MainSprite.prototype.create=function () {

}
gm.MainSprite.prototype.update=function (dt) {

    this.gameObject.position.rotation=-objects.Main.position.rotation;
}
gm.MainSprite.prototype.dispose=function () {

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
