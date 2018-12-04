gm.backgroundMove = function () {
    //this.worksInEditor=false;
    this.relativePositionX = 0.5;
    this.relativePositionY = 0.5;
    this.startPosition = {};
    this.serializeObject = {
        startPosition: true
    };
}
gm.backgroundMove.prototype.afterCreate = function () {
    if (this.startPosition.x == undefined)
        this.startPosition = {
            x: this.gameObject.position.x,
            y: this.gameObject.position.y,
        }
}
gm.backgroundMove.prototype.update = function (dt) {
    this.gameObject.position.x = this.startPosition.x + camera.x * (1 - this.relativePositionX);
    this.gameObject.position.y = this.startPosition.y + camera.y * (1 - this.relativePositionY);
}
gm.backgroundMove.prototype.dispose = function () {

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
