gm.LaserBeam=function(){this.created=0,this.kill=!1},gm.LaserBeam.prototype.create=function(){this.startx=this.gameObject.position.x,this.created++,setTimeout(function(){$this.gameObject.remove()},3e3)},gm.LaserBeam.prototype.update=function(t){void 0==this.o&&Math.abs(this.startx-this.gameObject.position.x)>8&&(this.o=createDestroyer(this.gameObject.name.value,0,0,16,8))},gm.LaserBeam.prototype.dispose=function(){try{this.o&&this.o.remove()}catch(t){}};