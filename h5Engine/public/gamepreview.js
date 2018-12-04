var socket;
var assetList = new Array();
var settings = {};
function loadMe() {
    socket = io.connect();
    socket.on('objectproperties', function (data) {
        INEDITOR = true;
        settings = data.settings;
        if (game && game.renderer && settings && settings.BackgroundColor)
            game.renderer.backgroundColor = parseInt("0x" + settings.BackgroundColor, 16);
        assetList = data.assetList;
        prefabs = data.prefabs;
        for (var i = 0; i < data.assetList.length; i++) {
            if (data.assetList[i].name.endsWith(".js") && data.assetList[i].name.indexOf("editorOnly\\") == -1) {
                var jsName = data.assetList[i].name.substr(7);
                $.ajax({
                    url: jsName,
                    type: 'GET',
                    success: function (result) {
                        window.eval(result);
                    },
                    async: false
                });
            }
        }
        for (var i = 0; i < assetList.length; i++) {
            assetList[i].name = assetList[i].name.substring(14);

        }
        var obj = data.GO;
        for (var i in obj) {
            var o = obj[i];
            addGameObjectBase(o, false);
        }
        loadMeSecond();
    });

    socket.on('eval', function (data) {
        window.eval(data);
    });


    window.onbeforeunload = function (e) {
        socketemit("stopGame");
    }
}

if (window.parent.EditoraddGameObjectServer == undefined)
    loadMe();


var FromEditorobjectpropertieschange = function (data) {
    if ("fromGame" in data) {
        return;
    }
    if (data.action == "removePlugin") {
        removeComponent(objects[data.name], data.plugin, false)

    } else {
        if (objects[data.name]) {
            if (data.action == "addPlugin") {
                addComponent(objects[data.name], data.plugin, {}, false);

            }
            for (var i in data.newval) {
                objects[data.name][data.plugin][i] = data.newval[i];
            }
            if (data.plugin == "name") {
                objects[data.newval.value] = objects[data.name];
                delete objects[data.name];
            }

        }
    }

};
var FromEditordeleteGameObjectDone = function (data) {
    removeGameObject(objects, data.name, false);
};
var FromEditoraddGameObjectServer = function (o) {
    createGameObject(o, false);
};