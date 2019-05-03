//Complimentary functions

var clicked = false;
//Game objects standart properties that arent component(plugin)
var standartGameObjectProperties = ["remove", "addComponent", "removeComponent", "children"];
//Mouse object 
var mouse = {
    x: 0, y: 0, screenX: 0, screenY: 0, left: false, middle: false, right: false
}
//Most of the actions pushed here for easier execution
var actionFunctions = {};
//Mouse click/touch action
var clickFunctions = new Array();
//Mouse/Touch down 
var mousedownFunctions = new Array();
//Mouse up/Touch ended
var mouseupFunctions = new Array();
//Mouse/touch move 
var mousemoveFunctions = new Array();
//Keyboard key down
var keydownFunctions = new Array();
//Keyboard key press
var keyPressFunctions = new Array();
//Keyboard key up
var keyupFunctions = new Array();
//Built-in drag start
var dragStartFunctions = new Array();
//Built-in drag end
var dragStopFunctions = new Array();
//Built-in drag
var dragFunctions = new Array();
//Create new events
var inspectFunctions = new Array();
//Mouse middle wheel
var mousewheelFunctions = new Array();
//Scen change actions
var sceneChangeFunctions = new Array();
//constant game object persist through scene changes
var constantGameObjects = new Array();
//Current mouse state
var pressing = new Array();
var actionFunctionArrayArray = [clickFunctions, mousedownFunctions, mouseupFunctions, mousemoveFunctions, dragStartFunctions, dragStopFunctions, dragFunctions,
    mousewheelFunctions];
$(function () {
    //Dummy canvas for image manipulations
    $("<canvas style='display:none' class='cnDummy'/>").appendTo("body");
});
//During gameobject initialization, check it for action it might contain and push functions to suitable array(s)
function inspectComponent(component, cname) {
    for (var i = 0; i < inspectFunctions.length; i++) {
        inspectFunctions[i](component, cname);
    }
    if ("clickMe" in component) {
        var fn = function (mouse, e) {
            if (component.gameObject.position.isCollidingScreen(e.offsetX, e.offsetY)) {
                component.clickMe(mouse, e);
            }
        }
        clickFunctions.push(fn);
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "clickFunctions",
                fn: fn
            });
    }
    if ("sceneChange" in component) {
        var fn = function (o, n) {
            return component.sceneChange(o, n);
        }
        sceneChangeFunctions.push({ fn: fn, component: component });
    }
    if ("mouseDownOnMe" in component) {
        var fn = function (mouse, e) {
            if (component.gameObject.position.isCollidingScreen(e.offsetX, e.offsetY)) {
                return component.mouseDownOnMe(mouse, e);
            }
        }
        mousedownFunctions.push({ fn: fn, c: (component.priorty == undefined ? -1 : component.priorty), n: component.gameObject.name.value });
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "mousedownFunctions",
                fn: fn
            });
    }
    if ("mouseUpOnMe" in component) {
        var fn = function (mouse, e) {
            if (component.gameObject.position.isCollidingScreen(e.offsetX, e.offsetY)) {
                return component.mouseUpOnMe(mouse, e);
            }
        }
        mouseupFunctions.push({ fn: fn, c: (component.priorty == undefined ? -1 : component.priorty), n: component.gameObject.name.value });
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "mouseupFunctions",
                fn: fn
            });
    }
    if ("mouseMoveOnMe" in component) {
        var fn = function (mouse, e) {
            if (component.gameObject.position.isCollidingScreen(e.offsetX, e.offsetY)) {
                return component.mouseMoveOnMe(mouse, e);
            }
        }
        mousemoveFunctions.push({ fn: fn, c: (component.priorty == undefined ? -1 : component.priorty), n: component.gameObject.name.value });
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "mousemoveFunctions",
                fn: fn
            });
    }
    if ("click" in component) {
        var fn = function (mouse, e) {
            return component.click(mouse, e);
        }
        clickFunctions.push(fn);
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "clickFunctions",
                fn: fn
            });
    }
    if ("mousewheel" in component) {
        var fn = function (wheel, e) {
            return component.mousewheel(wheel, e);
        }
        mousewheelFunctions.push(fn);
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "mousewheelFunctions",
                fn: fn
            });
    }
    if ("mouseDown" in component) {
        var fn = function (mouse, e) {
            return component.mouseDown(mouse, e);
        }
        mousedownFunctions.push({ fn: fn, c: (component.priorty == undefined ? -1 : component.priorty), n: component.gameObject.name.value });
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "mousedownFunctions",
                fn: fn
            });
    }
    if ("keyDown" in component) {
        var fn = function (mouse, e) {
            return component.keyDown(mouse, e);
        }
        keydownFunctions.push({ fn: fn, c: (component.priorty == undefined ? -1 : component.priorty), n: component.gameObject.name.value });
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "keydownFunctions",
                fn: fn
            });
    }
    if ("keyPress" in component) {
        var fn = function (mouse, e) {
            return component.keyPress(mouse, e);
        }
        keyPressFunctions.push({ fn: fn, c: (component.priorty == undefined ? -1 : component.priorty), n: component.gameObject.name.value });
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "keyPressFunctions",
                fn: fn
            });
    }
    if ("keyUp" in component) {
        var fn = function (mouse, e) {
            return component.keyUp(mouse, e);
        }
        keyupFunctions.push({ fn: fn, c: (component.priorty == undefined ? -1 : component.priorty), n: component.gameObject.name.value });
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "keyupFunctions",
                fn: fn
            });
    }
    if ("mouseUp" in component) {
        var fn = function (mouse, e) {
            return component.mouseUp(mouse, e);
        }
        mouseupFunctions.push({ fn: fn, c: (component.priorty == undefined ? -1 : component.priorty), n: component.gameObject.name.value });
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "mouseupFunctions",
                fn: fn
            });
    }
    if ("mouseMove" in component) {
        var fn = function (mouse, e) {
            return component.mouseMove(mouse, e);
        }
        mousemoveFunctions.push({ fn: fn, c: (component.priorty == undefined ? -1 : component.priorty), n: component.gameObject.name.value });
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "mousemoveFunctions",
                fn: fn
            });
    }
    if ("dragStart" in component || "dragStop" in component || "drag" in component) {
        var down = function (mouse, e) {
            component.__isDragging = false;
            if (component.dragDisabled == undefined || component.dragDisabled() == false) {

                if (component.gameObject.position.isCollidingScreen(e.offsetX, e.offsetY)) {
                    component.__isDragging = true;
                    component.__offset = {
                        x: e.offsetX, y: e.offsetY
                    }
                    if (component.dragStart)
                        return component.dragStart(mouse, e);
                }
            }
        }
        var move = function (mouse, e) {
            if (component.dragDisabled == undefined || component.dragDisabled() == false) {
                if (component.__isDragging == true) {
                    var prntR = 0;
                    if (component.gameObject.position.parent && objects[component.gameObject.position.parent])
                        prntR = objects[component.gameObject.position.parent].position.getRotation();
                    if (prntR != 0) {
                        var thisX1 = (e.offsetX - component.__offset.x) / camera.scale;
                        var thisY1 = (e.offsetY - component.__offset.y) / camera.scale;
                        var len = Math.sqrt(thisX1 * thisX1 + thisY1 * thisY1);
                        var currAngle = Math.atan2(thisY1, thisX1);
                        var rotationalY = (len) * Math.sin(currAngle - prntR);
                        var rotationalX = (len) * Math.cos(currAngle - prntR);
                        component.gameObject.position.x = rotationalX + parseFloat(component.gameObject.position.x);
                        component.gameObject.position.y = rotationalY + parseFloat(component.gameObject.position.y);
                    } else {
                        component.gameObject.position.x = (e.offsetX - component.__offset.x) / camera.scale + parseFloat(component.gameObject.position.x);
                        component.gameObject.position.y = (e.offsetY - component.__offset.y) / camera.scale + parseFloat(component.gameObject.position.y);
                    }
                    component.__offset = {
                        x: e.offsetX, y: e.offsetY
                    }

                    if (component.drag)
                        return component.drag(mouse, e);

                }
            }
        }
        var up = function (mouse, e) {
            if (component.__isDragging) {
                if (component.dragDisabled == undefined || component.dragDisabled() == false) {
                    move(mouse, e);
                    component.__isDragging = false;
                    if (component.dragStop)
                        return component.dragStop(mouse, e);
                }
            }
        }

        mousedownFunctions.push({ fn: down, c: (component.priorty == undefined ? -1 : component.priorty), n: component.gameObject.name.value });
        mouseupFunctions.push({ fn: up, c: (component.priorty == undefined ? -1 : component.priorty), n: component.gameObject.name.value });
        mousemoveFunctions.push({ fn: move, c: (component.priorty == undefined ? -1 : component.priorty), n: component.gameObject.name.value });
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "mousedownFunctions",
                fn: down
            });
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "mousemoveFunctions",
                fn: move
            });
        if (actionFunctions[component.gameObject.name.value] == undefined)
            actionFunctions[component.gameObject.name.value] = new Array();
        actionFunctions[component.gameObject.name.value].push(
            {
                component: component,
                action: "mouseupFunctions",
                fn: up
            });
    }

    mousedownFunctions = mousedownFunctions.sort(function (a, b) { try { return (a.c < b.c ? 1 : (a.c > b.c ? -1 : 0)) } catch (e) { return 0 } });
    mouseupFunctions = mouseupFunctions.sort(function (a, b) { try { return (a.c < b.c ? 1 : (a.c > b.c ? -1 : 0)) } catch (e) { return 0 } });
    mousemoveFunctions = mousemoveFunctions.sort(function (a, b) { try { return (a.c < b.c ? 1 : (a.c > b.c ? -1 : 0)) } catch (e) { return 0 } });

}
//Create actual interactions
function initCanvasActions() {
    $("canvas").on("click", function (e) {
        if (clickFunctions.length > 0) {

            var w = game.renderer.width / 2;
            var h = game.renderer.height / 2;
            clicked = true;
            mouse.screenX = e.offsetX;
            mouse.screenY = e.offsetY;
            switch (e.button) {
                case 0:
                    mouse.left = true;
                    break;
                case 1:
                    mouse.middle = true;
                    break;
                case 2:
                    mouse.right = true;
                    break;
                default:
            }
            mouse.x = (mouse.screenX - w) / camera.scale + camera.x;
            mouse.y = (mouse.screenY - h) / camera.scale + camera.y;
            for (var i = 0; i < clickFunctions.length; i++) {
                clickFunctions[i](mouse, e);
            }
        }
    });
    $("canvas").on("contextmenu", function (e) {
        e.preventDefault();
    });
    $("canvas").on('mousewheel DOMMouseScroll', function (e) {
        if (mousewheelFunctions.length > 0) {
            for (var i = 0; i < mousewheelFunctions.length; i++) {
                mousewheelFunctions[i](e.originalEvent.wheelDelta, e);
            }
        }


    });
    $("canvas").on("mousedown touchstart", function (e) {
        if (e.type == 'touchstart' && e.touches) {
            e = e.touches[0];
            e.offsetX = e.pageX - e.target.offsetLeft;
            e.offsetY = e.pageY - e.target.offsetTop;
        }
        if (mousedownFunctions.length > 0) {

            var w = game.renderer.width / 2;
            var h = game.renderer.height / 2;
            clicked = true;
            mouse.screenX = e.offsetX;
            mouse.screenY = e.offsetY;
            switch (e.button) {
                case 0:
                    mouse.left = true;
                    break;
                case 1:
                    mouse.middle = true;
                    break;
                case 2:
                    mouse.right = true;
                    break;
                default:
            }
            mouse.x = (mouse.screenX - w) / camera.scale + camera.x;
            mouse.y = (mouse.screenY - h) / camera.scale + camera.y;
            for (var i = 0; i < mousedownFunctions.length; i++) {
                var retval = mousedownFunctions[i].fn(mouse, e);
                if (retval)
                    return true;

            }
        }
    });
    $("canvas").on("mousemove", function (e) {
        if (mousemoveFunctions.length > 0) {

            var w = game.renderer.width / 2;
            var h = game.renderer.height / 2;
            mouse.screenX = e.offsetX;
            mouse.screenY = e.offsetY;
            mouse.x = (mouse.screenX - w) / camera.scale + camera.x;
            mouse.y = (mouse.screenY - h) / camera.scale + camera.y;
            for (var i = 0; i < mousemoveFunctions.length; i++) {
                var retval = mousemoveFunctions[i].fn(mouse, e);
                if (retval)
                    return true;

            }
        }
    });
    $("body").on("keydown", function (e) {
        if (keydownFunctions.length > 0) {
            for (var i = 0; i < keydownFunctions.length; i++) {
                var retval = keydownFunctions[i].fn(e);
                if (retval)
                    return true;
            }
        }
        if (keyPressFunctions.length > 0) {
            if (pressing.indexOf(e.keyCode) == -1) {
                pressing.push(e.keyCode);
                for (var i = 0; i < keyPressFunctions.length; i++) {
                    var retval = keyPressFunctions[i].fn(e);
                    if (retval)
                        return true;
                }
            }
        }
    });
    $("body").on("keyup", function (e) {
        if (keyupFunctions.length > 0) {
            for (var i = 0; i < keyupFunctions.length; i++) {
                var retval = keyupFunctions[i].fn(e);
                if (retval)
                    return true;
            }
        }
        if (keyPressFunctions.length > 0) {
            var ind = pressing.indexOf(e.keyCode)
            if (ind != -1) {
                pressing.splice(ind, 1);
            }
        }
    });
    $("*").on("mouseup touchend", function (e) {
        if (e.type == 'touchend') {
            e.offsetX = e.pageX - e.target.offsetLeft;
            e.offsetY = e.pageY - e.target.offsetTop;
        }
        mouse.left = false;
        mouse.right = false;
        mouse.middle = false;
        for (var i = 0; i < mouseupFunctions.length; i++) {
            var retval = mouseupFunctions[i].fn(mouse, e);
            if (retval)
                return true;

        }
    });
}


//Rotate vector around another point
function rotateAround(p1, around, degree) {
    var dx = p1.x - around.x;
    var dy = p1.y - around.y;
    var d1 = Math.atan2(dy, dx);
    var len = Math.sqrt(dx * dx + dy * dy);
    return {
        x: around.x + len * Math.cos(d1 + degree),
        y: around.y + len * Math.sin(d1 + degree)
    }
}

var objects = {};
//Create observable variable
function newObservable(object, name, getFunction, setFunction, preSetfunction) {
    Object.defineProperty(object, "____" + name + "__", {
        writable: true,
        enumerable: false,
        configurable: true
    });
    if (name in object)
        object["____" + name + "__"] = object[name];

    Object.defineProperty(object, name, {
        enumerable: true,
        configurable: true,
        get: function () {
            if (getFunction)
                getFunction(object["____" + name + "__"]);

            return object["____" + name + "__"];
        },
        set: function (v) {
            if (preSetfunction)
                preSetfunction(object["____" + name + "__"], v);
            object["____" + name + "__"] = v;
            if (setFunction)
                setFunction(v, object);

        }
    });
    return setFunction;
}
//Set observable variable back to "normal"
function unlinkObservable(object, name) {
    if ("____" + name + "__" in object) {
        var temp = object["____" + name + "__"];
        Object.defineProperty(object, name, {
            writable: true,
            enumerable: true,
            configurable: true
        });
        object[name] = temp;
        delete object["____" + name + "__"];
    }
}
//Create object copy without recursive parts
function objectsCopy() {
    var retval = {};
    for (var i in objects) {
        retval[i] = goBack(objects[i]);
    }
    return retval;
}
//Create simpler object 
function goBack(o) {
    var retVal = {};
    for (var i in o) {
        if (standartGameObjectProperties.indexOf(i) == -1) {
            retVal[i] = {};
            try {

                if (!("dontSerialize" in o[i]))
                    o[i].dontSerialize = {};
                if (!("serializeObject" in o[i]))
                    o[i].serializeObject = {};

            } catch (e) {

            }
            for (var j in o[i]) {
                if ((typeof (o[i][j]) == "string" || typeof (o[i][j]) == "boolean" || typeof (o[i][j]) == "number") && j != "__initialized" && o[i].dontSerialize[j] != true && dontInitializeThese.indexOf(j) == -1) {
                    retVal[i][j] = o[i][j];
                } else if (o[i].serializeObject[j] == true) {
                    retVal[i][j] = o[i][j];
                }
            }
        }
    }
    return retVal;
}

var imageFormats = ["BMP", "GIF", "IMG", "JBG", "JPE", "JPEG", "JPG", "PNG", "RAS", "TGA", "TIFF", "SVG"];
var soundFormats = ["WAV", "MP3", "OGG"];
var isImage = function (fullname) {
    for (var i in imageFormats) {
        if (fullname.toUpperCase().endsWith(imageFormats[i])) {
            return true;
        }
    }
}
var isSound = function (fullname) {
    for (var i in soundFormats) {
        if (fullname.toUpperCase().endsWith(soundFormats[i])) {
            return true;
        }
    }
}
//Concatenate two images
// Add functionality to any menu 
// 1st Param : Background image
// 2nd Param : Foreground image
// 3rd Param : Function used for after loading
// 4th Param : Foreground image's offset x
// 5th Param : Foreground image's offset y
function drawOnImage(a, a2, fn, offsetx, offsety) {
    var dt1 = new Date();
    var img = resources[a].data;
    var img2 = resources[a2].data;
    var rx = 0;
    var ry = 0;
    if (offsetx < 0)
        rx = offsetx * -1;
    if (offsety < 0)
        ry = offsety * -1;
    var rw = 0;
    if (offsetx < 0)
        rw = Math.min(img.width, img2.width + offsetx);
    else
        rw = Math.min(img.width - offsetx, img2.width);
    var rh = 0;
    if (offsetx < 0)
        rh = Math.min(img.height, img2.height + offsety);
    else
        rh = Math.min(img.height - offsety, img2.height);

    var c = $(".cnDummy")[0];
    var ctx = c.getContext('2d');
    c.width = img.width;
    c.height = img.height;
    var startx = offsetx < 0 ? 0 : offsetx;
    var starty = offsety < 0 ? 0 : offsety;
    ctx.drawImage(img2, offsetx, offsety, img2.width, img2.height);
    var data = ctx.getImageData(startx, starty, rw, rh);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var data2 = ctx.getImageData(startx, starty, rw, rh);

    for (var i = 0; i < data2.data.length; i++) {
        if (data2.data[i + 3] != 0 && data.data[i + 3] > 100) {
            data2.data[i] = data.data[i];
            data2.data[i + 1] = data.data[i + 1];
            data2.data[i + 2] = data.data[i + 2];
        }
    }

    ctx.putImageData(data2, startx, starty);
    var d = c.toDataURL();
    var i = 0;
    var b = a;
    while (resources[b] != undefined) {
        i++;
        b = a + i;
    }
    PIXI.loader.add(b, d);
    PIXI.loader.load(function (loader, resourcesNow) {
        for (var i in resourcesNow) {
            if (i == b) {
                resources[i] = resourcesNow[i];
                fn(i);
            }
        }
    });
    return b;
}

//string simpler endsWith and startsWith
if (String.prototype.endsWith == undefined) {
    String.prototype.endsWith = function (str) {
        if ((this.length - this.indexOf(str)) == str.length)
            return true;
        else
            return false
    }
}
if (String.prototype.startsWith == undefined) {
    String.prototype.startsWith = function (str) {
        if (this.indexOf(str) == 0)
            return true;
        else
            return false
    }
}
//Simpler number padding
function padLeft(nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}
Number.prototype.padLeft = function (n, str) {
    return Array(n - String(this).length + 1).join(str || '0') + this;
}
//Simpler commit

function CommitValue(GO, componentname, valueName) {
    var newval = {};
    newval[valueName] = GO[componentname][valueName];
    socketemit("gameobject", { action: "change", name: GO.name.value, plugin: componentname, newval: newval });

}
var eventFunctionArrays = [];
function CreateNewComponentEvent(EventName) {
    this[EventName + "Functions"] = new Array();
    eventFunctionArrays.push({
        name: EventName, event: this[EventName + "Functions"]
    });
    (function (EventName) {
        inspectFunctions.push(function (component, cname) {
            if (EventName in component) {
                EventWithName(EventName).push({
                    name: component.gameObject.name.value,
                    component: component,
                    gameObject: component.gameObject,
                    fn: component[EventName]
                });
            }
        });
    })(EventName);
}
function EventWithName(name) {
    var ev = eventFunctionArrays.filter(i => i.name == name);
    if (ev.length > 0)
        return ev[0].event;
    else
        return [];
}
function FireEventWithArguments(EventName, ArgumentsArray) {
    if (!ArgumentsArray)
        ArgumentsArray = [];
    var arr = EventWithName(EventName);
    for (var i = 0; i < arr.length; i++) {
        var ev = arr[i];
        ev.fn.apply(ev.component, ArgumentsArray);
    }
}