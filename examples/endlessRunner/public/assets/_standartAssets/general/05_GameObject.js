//h5Engine 's core object type "gameObject" presents an objects that has behaviours 
//Most important and required in every gameObject components (Plugins) defined here
//manual component Type creating object
var gm = {};
var parents = {};
var childrenGameObject = {};
var selectedSprite = undefined;
var lockedSelection = false;
var positions = new Array();
//Camera objects acts like gameObject but not in objects list
camera = {

    x: 0,
    y: 0,
    scale: 1,
    followX: true,
    followY: true,
    followingTransform: undefined,
    followPercent: 100,
    follow: function (go, percent) {
        if (percent)
            this.followPercent = percent;
        if (typeof (go) == "string" && objects[go]) {
            this.followingTransform = objects[go].position;
        }
        else if (go.position)
            this.followingTransform = go.position;
        else if (go.x != undefined && go.y != undefined) {
            this.followingTransform = go;
        }

    },
    update: function (paused) {

        var w = game.renderer.width;
        var h = game.renderer.height;
        gameContainer.scale.x = camera.scale;
        gameContainer.scale.y = camera.scale;
        gameContainer.x = (w / 2) - camera.x * camera.scale;
        gameContainer.y = (h / 2) - camera.y * camera.scale;
        if (!paused) {
            if (this.followingTransform) {
                if (this.followX)
                    if ((camera.followingTransform.getX() - camera.x) != 0) {
                        this.x += ((this.followingTransform.getX() - camera.x)) * this.followPercent / 100;
                    }
                if (this.followY)
                    if ((camera.followingTransform.getY() - camera.y) != 0) {
                        this.y += ((this.followingTransform.getY() - camera.y)) * this.followPercent / 100;
                    }
            }
        }
    }
}
//Position component is mandatory for all gameObjects that holds crucial information (Not just position) such as;
// position, scale, rotation , parent , is IT GUI elemnt,zOrder prefab connection
//For more info look to API documentation
gm.position = function () {
    this.scaleXFunctions = {};
    this.scaleYFunctions = {};
    this.container = new PIXI.Container();
    this.isGuiElement = false;
    this.rightAligned = false;
    this.centerAligned = false;
    this.drawAtInteger = false;
    this.getZorder = function () {
        var prefix = "1";
        if (this.isGuiElement)
            prefix = "2";

        return prefix + this.zOrder.padLeft(10) + this.gameObject.name.value;
    }
    this.parent = "";
    var $this = this;
    newObservable(this, "parent", undefined, function () {
        $this.x = $this.x;
        $this.y = $this.y;
        $this.rotation = $this.rotation;

    }, function (oldval, newval) {
        parents[$this.gameObject.name.value] = newval;
        if (newval) {
            if (!childrenGameObject[newval])
                childrenGameObject[newval] = new Array();
            childrenGameObject[newval].push($this.gameObject.name.value);
        }
        if (oldval) {
            if (childrenGameObject[oldval]) {
                var ind = childrenGameObject[oldval].indexOf($this.gameObject.name.value);
                if (ind != -1)
                    childrenGameObject[oldval].splice(ind, 1);
            }

        }
        $this.isGuiElement = $this.isGuiElement; //reload;
    });
    this.childrenGameObject = new Array();
    this.x = 0;
    this.y = 0;
    this.zOrder = 0;
    this.width = 32;
    this.height = 32;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.centerx = 0.5;
    this.centery = 0.5;
    this.worksInEditor = true;
    this.dragging = false;
    this.prefabName = "";
    this.prePosition = undefined;
    this.parentContainer = undefined;
    this.private = { dragging: true, parent: true, prefabName: true, prePosition: true };
    this.reloadInEditor = { isGuiElement: true }
    this.isCollidingScreen = function (x, y) {
        var hasgraphic = false;
        for (var i = 0; i < this.container.children.length; i++) {
            if (this.container.children[i].containsPoint != undefined) {
                hasgraphic = true;
                if (this.container.children[i].containsPoint({ x: x, y: y }))
                    return true;
            }
        }
        if (hasgraphic)
            return false;
        x = x - camera.x;
        y = y - camera.y;
        return (this.getScreenX() + this.width * (1 - this.centerx)) * camera.scale > x && (this.getScreenX() - this.width * (this.centerx)) * camera.scale < x &&
            (this.getScreenY() + this.height * (1 - this.centery)) * camera.scale > y && (this.getScreenY() - this.height * this.centery) * camera.scale < y;
    }
    this.init = function (j) {
        this.centerx = this.centerx;
        this.centery = this.centery;
        this.width = this.width;
        this.height = this.height;
    }
    this.customDiv = {
        centerMe: function (container) {
            var $this = this;
            addMenu("Zero", function () {
                $this.x = 0;
                $this.y = 0;
                socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "position", newval: { x: $this.x, y: $this.y } });
            }, "", container, "");
            addMenu("Center", function () {
                $this.x = game.renderer.width / 2;
                $this.y = game.renderer.height / 2;
                socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "position", newval: { x: $this.x, y: $this.y } });
            }, "", container, "");
        }
    }
    this.create = function () {

        if (this.parent != undefined && this.parent != "") {
            this.parentContainer = objects[this.parent].position.container;
        } else {
            if (this.isGuiElement) {
                this.parentContainer = guiContainer;
                this.private.rightAligned = false;
                this.private.centerAligned = false;
            }
            else {
                this.parentContainer = gameContainer;
                this.private.rightAligned = true;
                this.private.centerAligned = true;
            }
        }
        this.parentContainer.addChild(this.container);
        var $this = this;
        newObservable(this, "x", undefined, function () {
            if ($this.isGuiElement && ($this.rightAligned || $this.centerAligned))
                return;
            $this.container.x = $this.x;

            if ($this.drawAtInteger == true) {
                $this.container.x = parseInt( $this.x);
            } else {
                $this.container.x = $this.x;
            }
        })();
        newObservable(this, "y", undefined, function () {
            if ($this.drawAtInteger == true) {
                $this.container.y =parseInt( $this.y);
            } else {
                $this.container.y = $this.y;
            }
        })();
        newObservable(this, "scaleX", undefined, function () {
            $this.container.scale.x = $this.scaleX;
            for (var i in $this.scaleXFunctions) {
                $this.scaleXFunctions[i]();
            }
        })();
        newObservable(this, "scaleY", undefined, function () {
            $this.container.scale.y = $this.scaleY;
            for (var i in $this.scaleYFunctions) {
                $this.scaleYFunctions[i]();
            }
        })();
        newObservable(this, "width", undefined, function () {
            for (var i = 0; i < $this.container.children.length; i++) {
                if ($this.container.children[i].children.length == 0)
                    $this.container.children[i].width = $this.width;
            }
        })();
        newObservable(this, "height", undefined, function () {
            for (var i = 0; i < $this.container.children.length; i++) {
                if ($this.container.children[i].children.length == 0)
                    $this.container.children[i].height = $this.height;
            }

        })();
        newObservable(this, "rotation", undefined, function () {
            $this.container.rotation = $this.rotation * Math.PI / 180;
        })();
        newObservable(this, "zOrder", undefined, function () {
            $this.container.zOrder = parseFloat($this.zOrder);

            $this.parentContainer.children = $this.parentContainer.children.sort(function (a, b) {

                if (b.zOrder < a.zOrder) {
                    return 1;
                } else
                    return -1;
            });
        })();
        newObservable(this, "centerx", undefined, function () {
            for (var i = 0; i < $this.container.children.length; i++) {
                if ($this.container.children[i].anchor != undefined)
                    $this.container.children[i].anchor.x = $this.centerx;
            }
        })();
        newObservable(this, "centery", undefined, function () {
            for (var i = 0; i < $this.container.children.length; i++) {
                if ($this.container.children[i].anchor != undefined)
                    $this.container.children[i].anchor.y = $this.centery;
            }
        })();

        if (INEDITOR) {
            newObservable(this, "prefabName", undefined, function () {
                if (selectedSprite == this.gameObject)
                    reDrawPanel(selectedSprite);
            });
            this.clickMe = function () {
                if (gameMouseAction == 0 && !lockedSelection && selectedPrefab() == undefined) {
                    selectedSprite = this.gameObject;
                    var JSONReadyGO = goBack(selectedSprite);
                    socketemit("selectgameobject", JSONReadyGO);
                }
            }
            this.dragDisabled = function () {

                return gameMouseAction != 0 || lockedSelection || selectedSprite != this.gameObject;
            }
            this.dragStart = function (m, e) {
                var JSONReadyGO = goBack(selectedSprite);
                socketemit("selectgameobject", JSONReadyGO);
            }
            this.drag = function (m, e) {

            }
            this.dragStop = function (m, e) {
                var JSONReadyGO = goBack(selectedSprite);
                socketemit("gameobject", { action: "change", name: JSONReadyGO.name.value, plugin: "position", newval: { x: JSONReadyGO.position.x, y: JSONReadyGO.position.y } });
            }
            this.graphics = new PIXI.Graphics();
        }

        this.rightAlignedGUI();
    }
    this.dispose = function () {
        this.parentContainer.removeChild(this.container);
        if (INEDITOR) {
            if (selectedSprite == this.gameObject) {
                this.container.removeChild(this.graphics);
                delete this.graphics;
                selectedSprite = undefined;
                $("#gameproperties").html('');

            }
        }
    }
    this.render = function () {

        this.rightAlignedGUI();
        if (INEDITOR) {
            this.container.removeChild(this.graphics);
            delete this.graphics;
            this.graphics = new PIXI.Graphics();

            if (selectedSprite == this.gameObject) {
                DrawBox(0, 0, this.width, this.height, 0, this.graphics, this.centerx, this.centery, 0xffd900, 1, false, this.container);
            }

        }
    }
    this.move = function () {

    }
    this.rightAlignedGUI = function () {
        if (this.isGuiElement && this.rightAligned) {
            var w = game.renderer.width / (guiContainer.scale.x * this.getScaleX());
            if (this.container.x != this.x + w)
                this.container.x = this.x + w;
        }
        if (this.isGuiElement && this.centerAligned) {
            var w = game.renderer.width / (guiContainer.scale.x * this.getScaleX() * 2);
            if (this.container.x != this.x + w)
                this.container.x = this.x + w;
        }
    }
    this.update = function () {

    }
    this.getScaleX = function () {
        if (this.parent) {

            return parseFloat(this.scaleX) * objects[this.parent].position.getScaleX();
        }
        else
            return parseFloat(this.scaleX);
    }
    this.getScaleY = function () {
        if (this.parent)
            return parseFloat(this.scaleY) * objects[this.parent].position.getScaleY();
        else
            return parseFloat(this.scaleY);
    }
    this.getParentScaleX = function () {
        if (this.parent)
            return objects[this.parent].position.getScaleX();
        else
            return 1;
    }
    this.getParentScaleY = function () {
        if (this.parent)
            return objects[this.parent].position.getScaleY();
        else
            return 1;
    }
    this.getRotation = function () {
        if (this.parent)
            return parseFloat(this.rotation) * Math.PI / 180 + objects[this.parent].position.getRotation();
        else
            return parseFloat(this.rotation) * Math.PI / 180;
    }
    this.getUnrotationalX = function () {
        if (this.parent) {
            var thisX = parseFloat(this.x);
            var parentX = objects[this.parent].position.getX();
            return thisX + rotationalX;
        }
        else
            return parseFloat(this.x);
    }
    this.getUnrotationalY = function () {

        if (this.parent) {
            var thisY = parseFloat(this.y);
            var parentY = objects[this.parent].position.getY();
            return thisY + rotationalY;
        }
        else
            return parseFloat(this.y);
    }
    this.getX = function () {
        if (this.parent) {
            var thisX = parseFloat(this.x) * this.getParentScaleX();
            var parentX = objects[this.parent].position.getX();
            var rotationalX = thisX;
            var prntR = objects[this.parent].position.getRotation();
            if (prntR != 0) {
                var thisY = parseFloat(this.y)
                var len = Math.sqrt(thisX * thisX + thisY * thisY);
                var currAngle = Math.atan2(thisY, thisX);
                rotationalX = (len) * Math.cos(currAngle + prntR);
            }
            return parentX + rotationalX;
        }
        else
            return parseFloat(this.x);
    }
    this.getY = function () {

        if (this.parent) {
            var thisY = parseFloat(this.y) * this.getParentScaleY();
            var parentY = objects[this.parent].position.getY();
            var rotationalY = thisY;
            var prntR = objects[this.parent].position.getRotation();
            if (prntR != 0) {

                var thisX = parseFloat(this.x);
                var len = Math.sqrt(thisX * thisX + thisY * thisY);
                var currAngle = Math.atan2(thisY, thisX);
                rotationalY = (len) * Math.sin(currAngle + prntR);
            }

            return parentY + rotationalY;
        }

        else
            return parseFloat(this.y);
    }

    this.getScreenX = function () {

        return this.getX();
    }
    this.getScreenY = function () {
        return this.getY();
    }
    return this;
}
var tags = {};
//Name component is mandatory for all gameObjects that holds name and tagName information

gm.name = function () {
    this.value = "";
    this.tagName = "";
    var $this = this;
    newObservable(this, "tagName", undefined, function () {
        
    }, function (oldval, newval) {
        if (tags[oldval] != undefined) {
            var ind = tags[oldval].indexOf($this.gameObject);
            if (ind != -1) {
                tags[oldval].splice(ind, 1);
            }
        }
        if (tags[newval] == undefined)
            tags[newval] = new Array();
        tags[newval].push($this.gameObject);
        });
    this.dispose = function () {
        var oldval = this.tagName;
        if (tags[oldval] != undefined) {
            var ind = tags[oldval].indexOf($this.gameObject);
            if (ind != -1) {
                tags[oldval].splice(ind, 1);
            }
        }
    }
    return this;
}

//Draw box for editor
function DrawBox(x, y, w, h, r, g, cx, cy, c, a, dontadd, container, f) {

    if (!a)
        a = 1;
    var p1 = {
        x: x - cx * w,
        y: y - cy * h
    };
    var p3 = {
        x: x + (1 - cx) * w,
        y: y + (1 - cy) * h
    };
    var p2 = { x: p1.x, y: p3.y };
    var p4 = { x: p3.x, y: p1.y };
    var center = {
        x: x,
        y: y
    };
    // var circle = new Phaser.Circle(center.x, center.y, 5);
    var rotation = r;
    p1 = rotateAround(p1, center, rotation);
    p2 = rotateAround(p2, center, rotation);
    p3 = rotateAround(p3, center, rotation);
    p4 = rotateAround(p4, center, rotation);
    if (f == undefined)
        g.beginFill(0xFF3300, 0.01);
    g.lineStyle(2, c, a);
    g.moveTo(p1.x, p1.y);
    g.lineTo(p2.x, p2.y);
    g.lineTo(p3.x, p3.y);
    g.lineTo(p4.x, p4.y);
    g.lineTo(p1.x, p1.y);

    g.endFill();
    if (dontadd != true) {
        g.moveTo(center.x - 2, center.y + 2);
        g.lineTo(center.x + 2, center.y - 2);
        g.moveTo(center.x + 2, center.y + 2);
        g.lineTo(center.x - 2, center.y - 2);
    }
    g.lineStyle(0);
    if (dontadd != true) {
        container.addChild(g);

    }

}


//Draw circle for editor
function DrawCircle(x, y, R, r, g, cx, cy, c, a, container, dontadd) {

    var center = {
        x: x,
        y: y
    };
    var rotation = r;
    g.lineStyle(2, c, a);
    g.drawCircle(x, y, R);
    if (dontadd != true) {
        g.moveTo(center.x - 2, center.y + 2);
        g.lineTo(center.x + 2, center.y - 2);
        g.moveTo(center.x + 2, center.y + 2);
        g.lineTo(center.x - 2, center.y - 2);
    }
    g.lineStyle(0);


    container.addChild(g);

}
//Draw polygon for editor
function DrawPolygon(x, y, v2, r, g, c, a, wc, container) {
    if (v2.length < 2)
        return;

    g.lineStyle(2, c, a);

    var center = {
        x: x,
        y: y
    };
    var v = [];
    for (var i = 0; i < v2.length; i++) {
        v[i] = { x: v2[i].x + x, y: v2[i].y + y }
        v[i] = rotateAround(v[i], center, r);
    }
    g.moveTo(v[v.length - 1].x, v[v.length - 1].y);
    for (var i = 0; i < v.length; i++) {
        g.lineTo(v[i].x, v[i].y);

    }
    if (wc) {
        for (var i = 0; i < v.length; i++) {

            if (v2[i].c)
                g.lineStyle(2, v2[i].c, 1);
            g.drawCircle(v[i].x, v[i].y, 2);
            if (v2[i].c)
                g.lineStyle(2, c, a);

        }
        g.moveTo(center.x - 2, center.y + 2);
        g.lineTo(center.x + 2, center.y - 2);
        g.moveTo(center.x + 2, center.y + 2);
        g.lineTo(center.x - 2, center.y - 2);
    }
    g.lineStyle(0);
    container.addChild(g);
}