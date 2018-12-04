gm.smallbat = function () {
    //this.worksInEditor=false;
    this.vx = 0;
    this.vy = -80;
}
gm.smallbat.prototype.create = function () {
    this.vx = Math.random() * 40 - 20;
}
gm.smallbat.prototype.update = function (dt) {
    var h = game.renderer.height / 2;
    var w = game.renderer.width / 2;
    var p = this.gameObject.position;
    p.x += this.vx * dt / 1000;
    p.y += this.vy * dt / 1000;
    var c = {
        x1: camera.x - w,
        x2: camera.x + w,
        y1: camera.y - h,
        y2: camera.y + h
    }
    if (p.x < c.x1 || p.x > c.x2 || p.y < c.y1 || p.y > c.y2)
        this.gameObject.remove();
}
gm.smallbat.prototype.dispose = function () {

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
