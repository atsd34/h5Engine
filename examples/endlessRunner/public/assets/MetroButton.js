gm.MetroButton = function () {
    //this.worksInEditor=false;
    this.color = 0x8abb25;
    this.text = "";
    this.function = "";
    this.icon = "trophy.png";
    this.sizeX = 256;
    this.sizeY = 256;
    this.action = "";
    this.priorty = 99;
    this.onlyImage = false;
    this.turning = undefined;
}
gm.MetroButton.prototype.open = function (turn) {
    this.turning = turn;
    this.turning.stepH = (this.turning.height - this.sizeY) / 20;
    this.turning.stepW = (this.turning.width - this.sizeX) / 20;
    this.turning.stepX = (this.turning.x - this.gameObject.position.x) / 20;
    this.turning.stepY = (this.turning.y - this.gameObject.position.y) / 20;
    if (this.sprite) {
        this.turning.stepIW = (this.sprite.width) / 20;
        this.turning.stepIH = (this.sprite.height) / 20;
    }
    if (this.turning.sprite) {
        this.turning.imageW = this.turning.sprite.width;
        this.turning.imageH = this.turning.sprite.height;
        this.turning.imageWS = this.turning.sprite.width / 20;
        this.turning.imageHS = this.turning.sprite.height / 20;
        this.turning.sprite.width = 0;
        this.turning.sprite.height = 0;
        this.gameObject.position.container.addChild(this.turning.sprite);
    }
}

gm.MetroButton.prototype.turnStep = function () {
    if (Math.abs(this.turning.width - this.sizeX) <= Math.abs(this.turning.stepW)) {
        this.sizeX = this.turning.width;
        this.sizeY = this.turning.height;
        this.box.clear();
        this.box.beginFill(this.color);
        this.box.lineStyle(0);
        this.box.zOrder = 0;
        this.box.drawRect(0, 0, this.sizeX, this.sizeY);
        this.gameObject.position.x = this.turning.x;
        this.gameObject.position.y = this.turning.y;
        if (this.sprite) {
            this.gameObject.position.container.removeChild(this.sprite);
            delete this.sprite;
        }
        if (this.turning.sprite) {
            this.turning.sprite.width = this.turning.imageW;
            this.turning.sprite.height = this.turning.imageH;
            this.sprite = this.turning.sprite;

        }
        this.turning = undefined;
        return true;
    } else {
        this.sizeX += this.turning.stepW;
        this.sizeY += this.turning.stepH;
        this.box.clear();
        this.box.beginFill(this.color);
        this.box.lineStyle(0);
        this.box.zOrder = 0;
        this.box.drawRect(0, 0, this.sizeX, this.sizeY);
        this.gameObject.position.x += this.turning.stepX;
        this.gameObject.position.y += this.turning.stepY;
        if (this.sprite) {
            this.sprite.width -= this.turning.stepIW;
            this.sprite.height -= this.turning.stepIH;
        }

        if (this.turning.sprite) {
            this.turning.sprite.width += this.turning.imageWS;
            this.turning.sprite.height += this.turning.imageHS;

        }
    }
}
gm.MetroButton.prototype.create = function () {
    this.box = new PIXI.Graphics();
    this.mouseLeft = true;
    this.box.zOrder = -1;
    if ("alpha" in this)
        this.box.beginFill(this.color, this.alpha);
    else
        this.box.beginFill(this.color);
    this.box.lineStyle(0);
    this.box.zOrder = 0;
    this.box.drawRect(0, 0, this.sizeX, this.sizeY);
    this.gameObject.position.container.addChild(this.box);
    var style = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 64,
        fill: [0xffffff], // gradient
        strokeThickness: 0,
        dropShadow: false,
        dropShadowColor: this.dropShadowColor,
        dropShadowBlur: this.dropShadowBlur,
        dropShadowAngle: parseFloat(this.dropShadowAngle) * Math.PI / 180,
        dropShadowDistance: parseInt(this.dropShadowDistance)
    });
    if (!this.onlyImage) {
        this.text = new PIXI.Text(this.text, style);
        this.text.position.x = this.sizeX / 2;
        this.text.position.y = 32;
        this.text.anchor.x = 0.5;
        this.text.anchor.y = 0;
        this.text.zOrder = 1;
        this.gameObject.position.container.addChild(this.text);
    }
    if (this.icon) {
        this.sprite = new PIXI.Sprite(resources[this.icon].texture);
        this.sprite.zOrder = 2;
        if (!this.onlyImage) {
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
            this.sprite.position.x = this.sizeX / 2;
            this.sprite.position.y = this.sizeY / 2 + this.sprite.height / 2 - 64;
        } else {
            this.sprite.anchor.x = 0;
            this.sprite.anchor.y = 0;
            this.sprite.position.x = 0;
            this.sprite.position.y = 0;
            this.sprite.width = this.sizeX;
            this.sprite.height = this.sizeY;

        }

    }
    if (this.sprite)
        this.gameObject.position.container.addChild(this.sprite);
}
gm.MetroButton.prototype.render = function (dt) {
    if (this.turning) {
        this.turnStep();
    }
    if (!this.onlyImage && this.sprite && this.sprite.rotatable == undefined) {
        switch (this.action) {
            case "rotate":
                if (this.sprite.rotation > Math.PI * 2) {
                    this.sprite.rotation = 0;
                    this.action = "";
                } else {
                    this.sprite.rotation += 0.2;
                    this.sprite.scale.x += 0.015;
                    this.sprite.scale.y += 0.015;
                }
                break;
            case "downrotate":
                if (this.sprite.rotation < -Math.PI * 2) {
                    this.sprite.rotation = 0;
                    this.action = "";
                } else {
                    this.sprite.rotation -= 0.2;
                }
            default:
        }
    }
}
gm.MetroButton.prototype.dispose = function () {
    if (this.box) {
        this.box.clear();
        this.gameObject.position.container.removeChild(this.box);
    }
    if (this.text)
        this.gameObject.position.container.removeChild(this.text);
    if (this.sprite)
        this.gameObject.position.container.removeChild(this.sprite);
}
gm.MetroButton.prototype.mouseMoveOnMe = function () {
    if (this.mouseLeft) {
        this.action = "rotate";
        this.mouseLeft = false;
    }
}
gm.MetroButton.prototype.mouseMove = function (m, e) {
    if (this.mouseLeft == false) {
        if (!this.gameObject.position.isCollidingScreen(e.offsetX, e.offsetY)) {
            this.mouseLeft = true;
            if (!this.onlyImage && this.sprite && this.sprite.rotatable == undefined) {
                this.sprite.rotation = 0;
                this.sprite.scale.x = 1;
                this.sprite.scale.y = 1;
                this.gameObject.position.scaleX = 1;
                this.gameObject.position.scaleY = 1;
            }
            if (this.action == "rotate")
                this.action = "";
        }
    }
}
gm.MetroButton.prototype.mouseDownOnMe = function (m, e) {
    this.isDown = true;
    if (this.sprite) {
        if (this.sprite.scale.x == 1)

            this.action = "rotate";
        else
            this.action = "downrotate";
    }
    return true;
}
gm.MetroButton.prototype.mouseUp = function (m, e) {
    if (this.isDown) {
        this.isDown = false;

        if (!this.onlyImage && this.sprite && this.sprite.rotatable == undefined) {
            this.sprite.rotation = 0;
            this.action = "";
            this.gameObject.position.scaleX = 1;
            this.gameObject.position.scaleY = 1;
        }
        if (this.gameObject.position.isCollidingScreen(e.offsetX, e.offsetY)) {
            if (this.function) {
                eval(this.function);
            }
        }
    }

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
