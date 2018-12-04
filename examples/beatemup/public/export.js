//Main game loop that created from server
//WARNING changing this file from game solution may cause unconsistency
//If any change needed please download source code change there
var INEDITOR = false;
objects = {};
var prefabs = {};
var changing = false;
var assetList = new Array();
var settings = {};
var pausedUpdate = false;
var resources = {};
//window.onerror = function (msg, url, line, col, error) {
//    alert(msg);

//}
var _loadingBox = undefined;
var _loadingBoxTick = 0;
var _loadingBox2 = undefined;
//After HTML complete, start initializing PIXI
window.onload = function () {
    //data comes from exportProperties.js
    assetList = data.assetList;
    prefabs = data.prefabs;
    settings = data.settings;
    SceneOrder = data.sceneOrder;
    document.title = settings.Header;
    for (var i = 0; i < assetList.length; i++) {
        assetList[i].name = assetList[i].name.substring(14);
    }
    var obj = data.GO;
    //Current Scene =Current gameobject collections
    resources["currentScene"] = { data: JSON.stringify(data.GO) }
    for (var i in obj) {
        var o = obj[i];
        addGameObjectBase(o, false);
    }
    var clr = parseInt("0x" + settings.BackgroundColor);
    game = new PIXI.Application(settings.Height, settings.Width, { antialias: false, backgroundColor: clr });
    if (settings.PixelPerfect)
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    gameContainer = new PIXI.Container();
    guiContainer = new PIXI.Container();
    document.getElementById('game').appendChild(game.view);
    resize();

    var w = game.renderer.width;
    var h = game.renderer.height;
    _loadingBox = new PIXI.Graphics();
    _loadingBox.beginFill(0x000000);
    _loadingBox.lineStyle(5, 0xaaaaaa);
    _loadingBox.drawRect(w / 6, h * 7 / 16, w * 4 / 6, h * 2 / 16);
    gameContainer.addChild(_loadingBox);
    _loadingBox2 = new PIXI.Graphics();
    _loadingBox2.beginFill(0xeeee00);
    _loadingBoxTick = ((w * 4 / 6) - 10) / 100;
    _loadingBox2.drawRect(w / 6 - 5, h * 7 / 16 - 5, _loadingBoxTick, h * 2 / 16 - 10);
    gameContainer.addChild(_loadingBox2);
    //default keyboard/mouse/touch actions
    initCanvasActions();
    //Loading screen
    preload();
    game.stage.addChild(gameContainer);
    game.stage.addChild(guiContainer);


}
//If any physics is present this used for physics world
var world;
function create() {
    for (var i in objects) {
        initializeGameObject(objects[i], false, true);
    }
    for (var i in objects) {
        var o = objects[i];
        warmUpObject(o, false);
    }
    //During test, Even if scene is in saved state we want to reset.
    if (document.location.search.startsWith("?reset=")) {
        currentSceneName = "";
        var scnTmp = document.location.search.replace("?reset=", "");
        if (scnTmp) {

            loadScene(scnTmp);
        }
        //We dont want to refresh browser but want to change current URL
        window.history.pushState("export ", "", "export.html");
    }
}
var dt = new Date();
//Main Game Loop
function update() {
    try {
        var d = 16;
        dt = new Date();
        if (!pausedUpdate) {
            INEDITOR = false;
            for (var i in objects) {
                for (var j in objects[i]) {
                    if (standartGameObjectProperties.indexOf(j) == -1)
                        if (gm[j].prototype.update) {
                            try {
                                gm[j].prototype.update.apply(objects[i][j], [d]);
                            } catch (e) {
                            }
                        }
                        else if (objects[i][j].update) {
                            try {
                                objects[i][j].update(d);
                            } catch (e) {
                            }
                        }
                }
            }
        }
        render();
        camera.update(pausedUpdate);
    } catch (e) {

    }
}
//Game objects render loop
function render() {
    window.scrollTo(0, 0);
    for (var i in objects) {
        for (var j in objects[i]) {
            if (objects[i][j].render) {
                objects[i][j].render();
            }
        }
    }
}
//This is loading screen for current game
function preload() {
    for (var i = 0; i < assetList.length; i++) {
        if (!assetList[i].name.endsWith(".js"))
            PIXI.loader.add(assetList[i].name, 'assets/' + assetList[i].name.replace(/\\/g, '/'))
    }
    PIXI.loader.on('progress', function () {
        _loadingBox2.clear();
        var w = game.renderer.width;
        var h = game.renderer.height;
        _loadingBox2.beginFill(0xeeee00);
        _loadingBox2.drawRect(w / 6 + 5, h * 7 / 16 + 5, _loadingBoxTick * PIXI.loader.progress, h * 2 / 16 - 10);
    });
    if (objectToArray(PIXI.loader.resources).length > 0) {
        PIXI.loader.load(function (loader, resourcesNow) {

            _loadingBox2.clear();
            var w = game.renderer.width;
            var h = game.renderer.height;
            _loadingBox2.beginFill(0xeeee00);
            _loadingBox2.drawRect(w / 6 + 5, h * 7 / 16 + 5, _loadingBoxTick * 100, h * 2 / 16 - 10);
            requestAnimationFrame(function () {
                for (var i in resourcesNow) {
                    resources[i] = resourcesNow[i];
                }
                for (var i in PIXI.utils.TextureCache) {
                    textList[i] = true;
                }
                _loadingBox2.clear();
                _loadingBox.clear();
                gameContainer.removeChild(_loadingBox2);
                gameContainer.removeChild(_loadingBox);
                create();
                game.ticker.add(update);
            });
        });
    } else {

        for (var i in PIXI.utils.TextureCache) {
            textList[i] = true;
        }
        _loadingBox2.clear();
        _loadingBox.clear();
        gameContainer.removeChild(_loadingBox2);
        gameContainer.removeChild(_loadingBox);
        create();
        game.ticker.add(update);
    }
}

function resize() {
    resizeGame();
    if (settings.AutoWidth == true || settings.AutoHeight == true)
        window.onresize = resizeGame;
}
function resizeGame() {
    if (game && game.view) {
        var height = settings.Height;
        if (settings.AutoHeight == true)
            height = window.innerHeight;
        var width = settings.Width;
        if (settings.AutoWidth == true)
            width = window.innerWidth;
        if ((width / height) < settings.MinWidthHeightRatio)
            height = width / settings.MinWidthHeightRatio;
        if ((width / height) > settings.MaxWidthHeightRatio)
            width = height * settings.MaxWidthHeightRatio;
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