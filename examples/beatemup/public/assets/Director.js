gm.Director = function () {
    //this.worksInEditor=false;
    this.minVisibleX = -400;
    this.maxVisibleX = 450;
    this.minVisibleY = 0;
    this.maxVisibleY = 0;
    this.minimumHeight = 250;
    this.maximumHeight = 320;
    this.showTopAlways = false;
    this.yOffset = 0;
}
gm.Director.prototype.drawBox = function (i, x1, x2, y1, y2) {
    this["b" + i].clear();
    this["b" + i].beginFill(0, 1);
    this["b" + i].lineStyle(0);
    this["b" + i].moveTo(x1, y1);
    this["b" + i].lineTo(x2, y1);
    this["b" + i].lineTo(x2, y2);
    this["b" + i].lineTo(x1, y2);
    this["b" + i].lineTo(x1, y1);
}
gm.Director.prototype.create = function () {
    this.b1 = new PIXI.Graphics();
    this.b2 = new PIXI.Graphics();
    this.b3 = new PIXI.Graphics();
    this.b4 = new PIXI.Graphics();
    this.gameObject.position.container.addChild(this.b1);
    this.gameObject.position.container.addChild(this.b2);
    this.gameObject.position.container.addChild(this.b3);
    this.gameObject.position.container.addChild(this.b4);

}
gm.Director.prototype.update = function (dt) {
    var cx = 0;
    var cy = 0;
    var p = objects.main.position;
    var h = game.renderer.height;
    var w = game.renderer.width;
    var scale = Math.max(1, Math.ceil(h / (this.maximumHeight)));
    var ox = 0;
    if (w / scale > 640)
        ox = (w / scale - 640) / 2;
    if ((w / h) < 1) {
        scale = Math.max(1, Math.ceil(w / (this.maximumHeight)));
        this.yOffset = Math.floor(((h - w) / 2) / scale);
    } else {
        this.yOffset = 0;

    }
    camera.scale = scale;
    if ((p.x + ox - w / (scale * 2)) < this.minVisibleX) {
        cx = this.minVisibleX - ox + w / (scale * 2);
    }

    else if ((p.x - ox + w / (scale * 2)) > this.maxVisibleX) {
        cx = (this.maxVisibleX + ox - w / (scale * 2));
    }
    else {
        cx = p.x;
    }

    if ((p.y - h / (scale * 2)) < this.minVisibleY) {
        cy = this.minVisibleY + h / (scale * 2);
    }

    else if ((p.y + h / (scale * 2)) > this.maxVisibleY) {
        cy = (this.maxVisibleY - h / (scale * 2));
    }
    else {
        cy = p.y;
    }
    this.cameraX(cx);
    this.cameraY(cy);
    var con = parseInt(w / (camera.scale * 2));
    this.left = Math.max(this.gameObject.LevelProgression.minVisibleX, camera.x - con); // Math.max(camera.x - 250, this.minVisibleX);
    this.right = Math.min(this.gameObject.LevelProgression.maxVisibleX, camera.x + con);; // Math.min(camera.x + 250, this.maxVisibleX);
    this.drawBox(1, this.minVisibleX - w, this.left, camera.y - h, camera.y + h);
    this.drawBox(2, this.maxVisibleX + w, this.right, camera.y - h, camera.y + h);
    this.drawBox(4, camera.x - w, camera.x + w, this.maxVisibleY + w, this.maxVisibleY);
}
gm.Director.prototype.dispose = function () {

}

gm.Director.prototype.cameraX = function (x) {
    if (Math.abs(camera.x - x) < 5)
        camera.x = x;
    else if (Math.abs(camera.x - x) < 100)
        camera.x += Math.sign(x - camera.x) * 4;
    else
        camera.x += Math.sign(x - camera.x) * 20;
}
gm.Director.prototype.cameraY = function (y) {
    var h = game.renderer.height / camera.scale;

    var maxY = this.maxVisibleY - h / 2;
    if (this.showTopAlways) {
        var yy = objects.Director.LevelProgression.minVisibleY;
        camera.y = yy + h / 2;
        return;
    }
    if (Math.abs(camera.y -  this.yOffset - y) < 5)
        camera.y =Math.min(maxY, y + this.yOffset);
    else
        camera.y = Math.min(maxY, camera.y +Math.sign(y - camera.y + this.yOffset) * 4);
}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
