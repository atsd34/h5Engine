gm.sound=function(){this.priorty=99},gm.sound.prototype.create=function(){soundoff?this.gameObject.sprite.path="soundoff.png":this.gameObject.sprite.path="soundon.png"},gm.sound.prototype.update=function(o){},gm.sound.prototype.mouseDownOnMe=function(){return soundoff?(this.gameObject.sprite.path="soundon.png",soundOn()):(this.gameObject.sprite.path="soundoff.png",soundOff()),!0};