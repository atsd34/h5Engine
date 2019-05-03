//Game Window that is used for WYSIWYG editor that mimics some actual game functionality.
//Real game has export.js instead of this

var graphics;
var game;
var gamePlay;
var resources = {};
var changing = false;
var gameLayer;
var gameContainer;
var guiContainer;
var gameMouseAction = 0;
var zoomLevel;
var cameraX;
var cameraY;
var simulating = false;
var editorLoadComplete = [];
var camera;
function runGame() {
    loadScene("currentScene");
    simulating = true;
}
//Game design window basic HTML structure and PIXI initialization
//TODO : Independation of PIXI.js 
gameDesign = function () {
    delete game;
    $("#gamedesign").html('');
    $("#gamedesign").parent().css("overflow", "hidden");
    $("#gamedesign").append("<div class='gameButtons' />");
    redesignZoomPan();
    $("#gamedesign").append("<div class='gameCanvas' />");

    game = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });

    if (game && game.renderer && settings && settings.BackgroundColor)
        game.renderer.backgroundColor = parseInt("0x" + settings.BackgroundColor, 16);
    if (settings.PixelPerfect)
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    gameContainer = new PIXI.Container();
    guiContainer = new PIXI.Container();
    $(".gameCanvas")[0].appendChild(game.view);
    initCanvasActions();
    preload();
    game.stage.addChild(gameContainer);
    game.stage.addChild(guiContainer);
}
// Little menu for mouse action behaviors (default, zoom, pan , Reset View)
var redesignZoomPan = function () {
    $(".gameButtons").html('');
    addMenu("Work", function () {
        gameMouseAction = 0;
        setColorForWorkButtons();
    }, "", ".gameButtons", "gmWork");
    addMenu("Pan", function () {
        gameMouseAction = 1;
        setColorForWorkButtons();
    }, "", ".gameButtons", "gmPan");
    addMenu("Zoom", function () {
        gameMouseAction = 2;
        setColorForWorkButtons();
    }, "", ".gameButtons", "gmZoom");
    addMenu("Reset", function () {
        camera.x = 0;
        camera.y = 0;
        cameraY.val(camera.y);
        cameraX.val(camera.x);
        camera.scale = 1;
        zoomLevel.val(camera.scale);
        gameMouseAction = 0;
        setColorForWorkButtons();
    }, "", ".gameButtons", "gmReset");
    setColorForWorkButtons();
    zoomLevel = $("<input type='number' style='width:100px' />").appendTo(".gameButtons");
    cameraX = $("<input type='number' style='width:100px' />").appendTo(".gameButtons");
    cameraY = $("<input type='number' style='width:100px' />").appendTo(".gameButtons");
    zoomLevel.val(camera.scale);
    zoomLevel.on("change", function () {
        camera.scale = parseFloat(zoomLevel.val());
    });
    cameraY.val(camera.y);
    cameraX.val(camera.x);
    cameraY.on("change", function () {
        camera.y = parseFloat(cameraY.val());
    });
    cameraX.on("change", function () {
        camera.x = parseFloat(cameraX.val());
    });
}
function setColorForWorkButtons() {

    $(".gmWork").removeClass("btn-primary");
    $(".gmPan").removeClass("btn-primary");
    $(".gmZoom").removeClass("btn-primary");
    if (gameMouseAction == 0)
        $(".gmWork").addClass("btn-primary");
    if (gameMouseAction == 1)
        $(".gmPan").addClass("btn-primary");
    if (gameMouseAction == 2)
        $(".gmZoom").addClass("btn-primary");

}
function checkResources() {
    if (!("PIXI" in window) || !("loader" in PIXI) || !PIXI.loader.resources)
        return;
    var loadNew = false;
    PIXI.loader.resources = {};
    for (var i = 0; i < assetList.length; i++) {
        var url = 'assets/' + assetList[i].name.replace(/\\/g, '/');
        if (resources[assetList[i].name] == undefined) {
            PIXI.loader.add(assetList[i].name, url);
            loadNew = true;
        }
    }
    if (loadNew)
    PIXI.loader.load(function (loader, resourcesNow) {
        for (var i in resourcesNow) {
            resources[i] = resourcesNow[i];
        }
    });
}
//PIXI preload
function preload() {
    var loadingFont = false;
    for (var i = 0; i < assetList.length; i++) {
        var url = 'assets/' + assetList[i].name.replace(/\\/g, '/');
        if (assetList[i].name.endsWith(".ttf")) {
            $("<style> @font-face {  -webkit-font-smoothing: none;   font-family: " + assetList[i].name.replace(".", "") + ";    src: url('" + url + "') }</style>").appendTo('head');
            loadingFont = true;
        }
        PIXI.loader.add(assetList[i].name, url)
    }
    if (loadingFont) {
        editorLoadComplete.push(function () {
            setTimeout(function () {
                for (var i in objects) {
                    var o = objects[i];
                    if (o.text) {
                        o.text.fontSize = o.text.fontSize; //reload hack;
                }
                }
            }, 100);
        });
    }
    if (objectToArray(PIXI.loader.resources).length > 0) {
        PIXI.loader.load(function (loader, resourcesNow) {
            for (var i in resourcesNow) {
                resources[i] = resourcesNow[i];

            }

            create();
            game.ticker.add(update);
            pannable();
            for (var i = 0; i < editorLoadComplete.length; i++) {
                editorLoadComplete[i]();
            }
            editorLoadComplete = [];
        });
    } else {
        create();
        game.ticker.add(update);
        pannable();
        for (var i = 0; i < editorLoadComplete.length; i++) {
            editorLoadComplete[i]();
        }
        editorLoadComplete = [];
    }
}
//Screen coordinates to game coordinates
var screenToWorld = function (v) {
    var w = game.renderer.width / 2;
    var h = game.renderer.height / 2;
    return {
        x: camera.x + (v.x - w) / camera.scale,
        y: camera.y + (v.y - h) / camera.scale

    }

}
//Dummy GameObject (ish) object used for panning world
function pannable() {

    var panfunction = {
        mousewheel: function (d, e) {
            if (e.button != 1 && this.lastButton != 1) {
                var oldP = screenToWorld({
                    x: e.offsetX, y: e.offsetY
                });
                var w = game.renderer.width / 2;
                var h = game.renderer.height / 2;
                cameraX = $($(".gameButtons").find("input")[1]);
                cameraY = $($(".gameButtons").find("input")[2]);
                camera.scale += (d) / 1000;
                if (camera.scale < 0)
                    camera.scale = 0.001;
                zoomLevel.val(camera.scale);
                var newP = screenToWorld({
                    x: e.offsetX, y: e.offsetY
                });
                camera.x += oldP.x - newP.x;
                camera.y += oldP.y - newP.y;
                cameraY.val(camera.y);
                cameraX.val(camera.x);
            }
        },
        mouseDown: function (m, e) {
            if (selectedPrefab() != undefined) {
                var grid = prefabGrid();
                var s = selectedPrefab();
                $.get("assets/" + s, function (e) {
                    prefabs[s] = JSON.parse(e);
                    var nm = addPrefab(s, {
                        position: {
                            x: Math.round((m.x - grid.ox) / grid.gw) * grid.gw + grid.ox,
                            y: Math.round((m.y - grid.oy) / grid.gh) * grid.gh + grid.oy
                        }
                    }, true);
                    for (var i = 0; i < nm.length; i++) {
                        var JSONReadyGO = goBack(objects[nm[i]]);
                        socketemit("addGameObject", JSONReadyGO);
                    }
                });
                return true;
            }
            if (gameMouseAction == 1 || gameMouseAction == 2 || e.button == 1) {
                this.lastButton = 1;
                e.preventDefault();
                this.started = true;
                this.m = { x: e.clientX, y: e.clientY };
            }

        },
        mouseUp: function (m, e) {
            this.started = false;
            this.lastButton = undefined;
        },
        mouseMove: function (m, e) {
            if (this.started) {
                if (gameMouseAction == 1 && (e.button == 1 || this.lastButton == 1)) {
                    e.preventDefault();
                    camera.x -= (e.clientX - this.m.x) / camera.scale;
                    camera.y -= (e.clientY - this.m.y) / camera.scale;
                    cameraY.val(camera.y);
                    cameraX.val(camera.x);
                } else if (e.button == 1 || this.lastButton == 1) {
                    camera.scale += (e.clientX - this.m.x + e.clientY - this.m.y) * 0.001 * camera.scale;
                    zoomLevel.val(camera.scale);
                }
                this.m = { x: e.clientX, y: e.clientY };
            }
        },
        gameObject: {
            name: {
                value: 'panfunction'
            }
        }
    }
    //Properties converted into actions
    inspectComponent(panfunction);
}
//Dispose World
function dispose() {
    INEDITOR = true;
    for (var i in objects) {
        for (var j in objects[i]) {
            if (objects[i][j].worksInEditor && objects[i][j].dispose) {
                try {
                    objects[i][j].dispose();
                } catch (e) {

                }
            }
        }
    }

    INEDITOR = false;
}
var group;
var engine, world;
//Create game world
function create() {
    INEDITOR = true;
    resizeGame();
    for (var i in objects) {
        initializeGameObject(objects[i], true, true);
    }

    for (var i in objects) {
        var o = objects[i];
        warmUpObject(o, true);
    }
    game.stage.disableVisibilityChange = true;
    INEDITOR = false;
}
//Auto resize game
$(window).resize(function () {
    resizeGame();
});
var dt = new Date();
//Main game loop for game
function update() {
    var d = (new Date()).getTime() - dt.getTime();
    dt = new Date();
    INEDITOR = !simulating;
    for (var i in objects) {
        for (var j in objects[i]) {
            //Execute component update if it needs and have 
            if (standartGameObjectProperties.indexOf(j) == -1)
                if (objects[i][j].worksInEditor || simulating) {
                    try {
                        if (gm[j].prototype.update) {
                            try {
                                gm[j].prototype.update.apply(objects[i][j], [d]);
                            } catch (e) {
                            }
                        }
                        else if (objects[i][j].update)
                            objects[i][j].update(d);
                    } catch (e) {

                    }
                }
        }
    }
    render();
    camera.update();
    INEDITOR = false;
}
function render() {
    INEDITOR = true;
    for (var i in objects) {
        for (var j in objects[i]) {
            if (objects[i][j].worksInEditor && objects[i][j].render) {
                objects[i][j].render();
            }
        }
    }
    INEDITOR = false;
}
function resizeGame() {
    if (game && game.view) {
        var height = $("#gamedesign").height() - $(".gameButtons").height();
        var width = $("#gamedesign").width();
        //game.view.width = width;
        //game.view.height = height-15;
        game.renderer.resize(width, height);
    }
}

function objectToArray(obj) {
    var retval = [];
    for (var i in obj) {
        retval.push(obj[i]);
    }
    return retval;

}