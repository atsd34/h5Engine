gm.backgroundMove=function(){this.relativePositionX=.5,this.relativePositionY=.5,this.startPosition={},this.serializeObject={startPosition:!0}},gm.backgroundMove.prototype.afterCreate=function(){void 0==this.startPosition.x&&(this.startPosition={x:this.gameObject.position.x,y:this.gameObject.position.y})},gm.backgroundMove.prototype.update=function(t){this.gameObject.position.x=this.startPosition.x+camera.x*(1-this.relativePositionX),this.gameObject.position.y=this.startPosition.y+camera.y*(1-this.relativePositionY)},gm.backgroundMove.prototype.dispose=function(){};