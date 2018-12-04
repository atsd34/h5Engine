gm.trap = function(){ 
	//this.worksInEditor=false;
}
gm.trap.prototype.create = function () {
    var $this = this;
    this.gameObject.Physics.onCollision = {
        main: function (other, me) {
            if (other.life && other.life.remaining > 0 && other.life.invulnerable <= 0) {
                other.life.decreaseBy(me.name.value);
                $this.gameObject.sprite.playOnceAnim("go");
                $this.gameObject.removeComponent("trap");
                $this.gameObject.removeComponent("Physics");
            }
        }
    }
}
gm.trap.prototype.update=function (dt) {

}
gm.trap.prototype.dispose=function () {

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
