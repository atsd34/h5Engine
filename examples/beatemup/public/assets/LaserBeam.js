gm.LaserBeam = function () {
    //this.worksInEditor=false;
    this.created = 0;
    this.kill = false;
}
gm.LaserBeam.prototype.create = function () {
    this.startx = this.gameObject.position.x;
    this.created++;
    setTimeout(function () {
        $this.gameObject.remove();
    }, 3000);
}
gm.LaserBeam.prototype.update = function (dt) {
    if (this.o == undefined && Math.abs(this.startx - this.gameObject.position.x) > 8)
        this.o = createDestroyer(this.gameObject.name.value, 0, 0, 16, 8);

}
gm.LaserBeam.prototype.dispose = function () {
    try {
        if (this.o)
            this.o.remove();
    } catch (e) {

    }
}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
