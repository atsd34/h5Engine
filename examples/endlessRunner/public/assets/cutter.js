gm.cutter = function () {
    //this.worksInEditor=false;
    this.verticalMove = false;
    this.movingUp = true;
    this.horizantalMove = false;
    this.movingLeft = true;
    this.startX = 0;
    this.startY = 0;
}
gm.cutter.prototype.create = function () {
}
gm.cutter.prototype.update = function (dt) {
    this.gameObject.position.rotation--;
    if (this.movingUp)
        this.gameObject.position.y += 1;
    else
        this.gameObject.position.y -= 1;
    if (this.gameObject.position.y >= this.startY + 50)
        this.movingUp = false;
    if (this.gameObject.position.y < this.startY - 10)
        this.movingUp = true;


    if (this.horizantalMove) {
        if (this.movingLeft)
            this.gameObject.position.x -= 5;
        else
            this.gameObject.position.x += 5;
        if (this.gameObject.position.x < this.startX)
            this.movingLeft = false;
        if (this.gameObject.position.x > this.startX + 500)
            this.movingLeft = true;

    }
}
gm.cutter.prototype.dispose = function () {
}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
