gm.Pumpkin = function(){ 
	//this.worksInEditor=false;
    this.pulsing = 0;
}
gm.Pumpkin.prototype.create = function () {
    var $this = this;
    this.gameObject.Physics.onCollision = {
        main: function (other, me) {
            if (objects.main.main.stunned != true) {
                other.life.remaining--;
                $this.pulsing = -100;
            }
        }
    }
}
gm.Pumpkin.prototype.update = function (dt) {
    if (this.pulsing != 0) {
        this.pulsing++;
        if (this.pulsing > -94) {
            this.pulsing = 0;
            objects.main.main.stunned = false;
            objects.main.Physics.vx = 0;
        } else {
            objects.main.Physics.vx = this.pulsing * 4;
            objects.main.main.stunned = true;
        }
    }
}
gm.Pumpkin.prototype.dispose=function () {

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
