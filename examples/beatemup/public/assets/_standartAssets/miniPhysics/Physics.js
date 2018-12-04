var gravity = 1;
gm.Physics = function () {
    //this.worksInEditor=false;
    this.maxvy = 500;
    this.vx = 0;
    this.vy = 0;
    this.static = false;
    this.collidesWith = "wall";
    this.onCollision = { default: function () { } }
    this.grounded = false;
    this.wall = undefined;
    this.lastPosition = { x: 0, y: 0 };
    this.walllastPosition = { x: 0, y: 0 };
    this.walls = undefined;
    this.actualWidth = -1;
    this.actualHeight = -1;
    this.xOffset = 0;
    this.yOffset = 0;
    this.gravityFactor = 1;
}
gm.Physics.prototype.create = function () {
    this.sleeping = false;
    this.lastPosition = { x: this.gameObject.position.x, y: this.gameObject.position.y };
}
gm.Physics.prototype.calcVy = function (dt) {
    var ey = this.gameObject.position.y + this.vy * dt / 1000;
    if (this.vy != 0 && !this.checkWalls(this.gameObject.position.x, ey)) {
        this.gameObject.position.y = ey;
        this.grounded = false;
    } else {
        if (this.vy > dt * gravity) {
            this.vy = Math.max(dt * gravity, this.vy / 2);
            this.calcVy(dt);
            return;
        }
        this.vy = 0;
        if (!this.sleeping && this.wall && this.wall.y > this.gameObject.position.y) {
            this.sleeping = true;
            this.lastPosition = { x: this.gameObject.position.x, y: this.gameObject.position.y };
            this.walllastPosition = { x: this.wall.x, y: this.wall.y };
        }
        this.grounded = true;
    }
}
gm.Physics.prototype.update = function (dt) {
    var d1 = new Date();
    if (this.sleeping && (
        this.lastPosition.x != this.gameObject.position.x ||
        this.lastPosition.y != this.gameObject.position.y ||
        this.walllastPosition.x != this.wall.x ||
        this.walllastPosition.y != this.wall.y ||
        (this.wall && this.wall.gameObject && this.wall.gameObject.name && this.wall.gameObject.name.value && objects[this.wall.gameObject.name.value] == undefined)
    ))
        this.sleeping = false;
    if (!this.static) {
        if (this.vy < this.maxvy && !this.sleeping && this.gravityFactor != 0)
            this.vy += dt * gravity * this.gravityFactor;
        var ex = this.gameObject.position.x + this.vx * dt / 1000;
        if (this.vx != 0) {
            if (!this.checkWalls(ex, this.gameObject.position.y)) {
                this.gameObject.position.x = ex;
            } else {
                this.vx = 0;
            }
        }
        this.calcVy(dt);

    }
    for (var i in this.onCollision) {
        var os = getByTagName(i);
        if (os) {
            var w2 = (this.actualWidth == -1 ? this.gameObject.position.width : this.actualWidth) / 2;
            var h2 = (this.actualHeight == -1 ? this.gameObject.position.height : this.actualHeight) / 2;
            for (var j = 0; j < os.length; j++) {
                var w = os[j].position;
                var ox = 0;
                var oy = 0;
                if (os[j].Physics) {
                    ox = os[j].Physics.xOffset;
                    oy = os[j].Physics.yOffset;
                }
                var w3 = (os[j].Physics == undefined || os[j].Physics.actualWidth == -1 ? os[j].position.width : os[j].Physics.actualWidth) / 2;
                var h3 = (os[j].Physics == undefined || os[j].Physics.actualHeight == -1 ? os[j].position.height : os[j].Physics.actualHeight) / 2;
                if (RectangleRectangleCollision(this.gameObject.position.getX() + this.xOffset, this.gameObject.position.getY() + this.yOffset,
                    w2, h2, w.getX() + ox, w.getY() + oy, w3, h3)) {
                    this.onCollision[i](w.gameObject, this.gameObject);
                }
            }
        }
    }
    var d2 = new Date();
}
gm.Physics.prototype.checkWalls = function (ex, ey, walls) {
    if (!this.collidesWith)
        return;
    this.walls = getByTagsName(this.collidesWith.split(','));

    walls = this.walls;
    var w2 = (this.actualWidth == -1 ? this.gameObject.position.width : this.actualWidth) / 2;
    var h2 = (this.actualHeight == -1 ? this.gameObject.position.height : this.actualHeight) / 2;

    for (var i = 0; i < walls.length; i++) {
        var w = walls[i].position;
        var ox = 0;
        var oy = 0;
        if (walls[i].Physics) {
            ox = walls[i].Physics.xOffset;
            oy = walls[i].Physics.yOffset;
        }
        var w3 = (walls[i].Physics == undefined || walls[i].Physics.actualWidth == -1 ? walls[i].position.width : walls[i].Physics.actualWidth) / 2;
        var h3 = (walls[i].Physics == undefined || walls[i].Physics.actualHeight == -1 ? walls[i].position.height : walls[i].Physics.actualHeight) / 2;
        if (RectangleRectangleCollision(ex + this.xOffset, ey + this.yOffset, w2, h2, w.x + ox, w.y + oy, w3, h3)) {
            this.wall = w;
            return true;
        }
    }
    return false;
}
gm.Physics.prototype.dispose = function () {

}
//other events are : 
//Secondary Create : afterCreate 
//Physics : beginContact,endContact,impact 
//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 

function RectangleRectangleCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (
        !((x1 + w1) < (x2 - w2) ||
            (x1 - w1) > (x2 + w2) ||
            (y1 + h1) < (y2 - h2) ||
            (y1 - h1) > (y2 + h2)))
        return true;

}
function CircleRectangleCollision(x1, y1, r, x2, y2, w2, h2) {

    var ang = Math.atan2(-y1 + y2, -x1 + x2);
    var dx = x1 + r * Math.cos(ang);
    var dy = y1 + r * Math.sin(ang);
    if ((dx) > (x2 - w2) && (dx) < (x2 + w2) &&
        (dy) > (y2 - h2) && (dy) < (y2 + h2)
    ) {
        var a0 = Math.abs(dx - x2 + w2); //left
        var a1 = Math.abs(dx - x2 - w2); //right
        var a2 = Math.abs(dy - y2 + h2); //top
        var a3 = Math.abs(dy - y2 - h2); //bottom
        if (a0 < a1 && a0 < a2 && a0 < a3) {
            return 0;
        }
        else if (a1 < a2 && a1 < a3) {
            return 1;
        }
        else if (a2 < a3) {
            return 2;
        }
        else
            return 3;
    }
    return -1;
}