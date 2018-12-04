///Socket.io Functionality
var plugins = {};
var injectEmit = {};
var recentFiles = [];
var editorloaded = [];
if (!("SceneOrder" in this))
    SceneOrder = [];
function socketOn(socket) {
    //When a game object selected (selection change happens) and confirmed from server
    socket.on('gameobjectselected', function (data) {
        gameHierarchy(undefined, data.name.value);
        for (var i in data) {
            if (typeof (objects[data.name.value][i]["selectGameObjectEditor"]) == "function") {
                objects[data.name.value][i]["selectGameObjectEditor"]();
            }
        }
        reDrawPanel1(data);
    });
    //Free javascript code can be sent from server
    socket.on('eval', function (data) {
        try {
            window.eval(data);
            gameHierarchy();
        } catch (e) {

        }
    });
    //Redo button active/passive
    socket.on("redoActive", function (data) {
        if (data) {
            $(".btnRedo").removeClass("disabled");

        } else {
            $(".btnRedo").addClass("disabled");
        }
    });
    //Undo button active/passive
    socket.on("undoActive", function (data) {
        if (data)
            $(".btnUndo").removeClass("disabled");
        else
            $(".btnUndo").addClass("disabled");
    });
    //GameObject Added from server
    socket.on('addGameObjectServer', function (o) {
        for (var i = 0; i < o.length; i++) {
            var oo = o[i];
            EditoraddGameObjectServer(oo);
        }
    });
    //Recent projects list updated by server
    socket.on("recentFiles", function (data) {
        recentFiles = data;
    });
    //Scene change triggered by server
    socket.on('refresh', function (obj) {
        for (var i in objects) {
            removeGameObject(objects, i, true);
        }
        for (var i in obj) {
            var o = obj[i];
            addGameObjectBase(o, true);
        }
        for (var i in objects) {
            var o = objects[i];
            initializeGameObject(o, true, true);
        }
        for (var i in objects) {
            var o = objects[i];
            warmUpObject(o, true);
        }
        gameHierarchy();
        selectedSprite = undefined;
        saved = true;
    });
    //Solution options set by server
    socket.on('solutionOptionsServer', function (o) {
        openedNodesHierarchy = o.hierarchy;
        openedNodesAssets = o.assets;
        lastSceneName = o.lastSceneName;
        lastJS = o.lastJS;
        dir = o.dir;
        if (o.guiVisible == false) {
            HideGUI();
            $(".btnShowGUI").html("Show GUI");
        }
        defaultProjectFolder = o.general.projectFolder;
        OpenAssets();
        openHierarchy();
        for (var i in o.camera) {
            camera[i] = o.camera[i];
        }
        redesignZoomPan();
    });
    //Delete Game Object command from server
    socket.on('deleteGameObjectDone', function (data) {
        for (var i = 0; i < data.length; i++) {
            EditordeleteGameObjectDone(data[i]);
        }
    });
    // During "Save Plugin" process, if u try to Override existing plugin and there are changes this is the window where you can see summarised changes.
    socket.on("changedPluginDetails", function (data) {

        var modal = {
            //Override plugin
            "Overwrite/Save": function () {
                data.data["Overwrite Existing Plugin"] = true;
                socketemit("SavePlugin", data.data);
            },
            "Cancel": function () {

            }
        };
        var prp = {
            "There are some changes you might want to control.": undefined
        };
        //Changes Segment
        prp["<b style='font-size:14px'>Changes</b>"] = undefined;
        for (var i in data.retval.changed) {
            (function (prp, i) {
                if (i.endsWith(".js")) {
                    prp[i] = function () {
                        socketemit("PluginChanges", i);
                    }
                }
                else
                    prp[i] = undefined;
            })(prp, i);
        }

        prp["<b style='font-size:14px'>Added Files</b>"] = undefined;
        for (var i in data.retval.added) {
            (function (prp, i) {
                prp[i] = undefined;
            })(prp, i);
        }
        prp["<b style='font-size:14px'>Removed Files</b>"] = undefined;
        for (var i in data.retval.deleted) {
            (function (prp, i) {
                prp[i] = undefined;
            })(prp, i);
        }
        //Trigger setted modal form
        modalForm(prp, modal
        );
    });
    // Plugin list updated by server
    socket.on("pluginList", function (data) {
        plugins = data;
        gameHierarchy();
    });
    // Asset list updated by server
    socket.on('assetList', function (data) {
        gameAssetList(data);
        checkResources();
        if ("selectedSprite" in window && selectedSprite) {
            var JSONReadyGO = goBack(selectedSprite);
            socketemit("selectgameobject", JSONReadyGO);
        }
    });
    //All gameobjects list changed or generally when scene is initially opened and needs to be changed.
    //When new project opens or game engine opens this is where everything set
    socket.on('objectproperties', function (data) {
        {
            INEDITOR = true;
            plugins = data.plugins;
            for (var i = 0; i < data.assetList.length; i++) {
                if (data.assetList[i].name.endsWith(".js")) {
                    var jsName = data.assetList[i].name.substr(7);
                    var txt = "";
                    $.ajax({
                        url: jsName,
                        type: 'GET',
                        dataType: 'text',
                        success: function (result) {
                            try {
                                window.eval(result);
                            } catch (e) {
                                console.log(e);
                            }
                        },
                        async: false
                    });

                }
            }
            //Project settings
            settings = data.settings;
            if (game && game.renderer && settings && settings.BackgroundColor)
                game.renderer.backgroundColor = parseInt("0x" + settings.BackgroundColor, 16);
            //Saved Prefabs
            prefabs = data.prefabs;
            //Scene Order
            SceneOrder = data.sceneOrder;
            //Game Objects
            var obj = data.GO;
            //Current Scene (If current scene is saved it is also located in prefabs object)
            resources["currentScene"] = { data: JSON.stringify(data.GO) };
            try {

                for (var i in obj) {
                    var o = obj[i];
                    addGameObjectBase(o, true);
                }
            } catch (e) {

            }
            gameDesign();
            gameHierarchy();

            // When any of the game object changed from server this is triggered
            socket.on("objectpropertieschange", function (data) {
                Editorobjectpropertieschange(data);
            });
        }
    });
}
//New game object or newly introduced game object from server
function EditoraddGameObjectServer(o) {
    saved = false;
    createGameObject(o, true);
    gameHierarchy(100);
    selectedSprite = objects[o.name.value];
    var JSONReadyGO = goBack(objects[o.name.value]);
    socketemit("selectgameobject", JSONReadyGO);
}
function EditordeleteGameObjectDone(data) {
    saved = false;
    removeGameObject(objects, data, true);
    gameHierarchy();
}
// When any of the game object changed from server this is triggered
function Editorobjectpropertieschange(data) {
    saved = false;
    //Remove used plugin from game object
    if (data.action == "removePlugin") {
        removeComponent(objects[data.name], data.plugin, true)

    } else {
        if (objects[data.name]) {
            //Add new plugin (functionality) to game object
            if (data.action == "addPlugin") {
                addComponent(objects[data.name], data.plugin, {}, true);

            }
            addComponentBase(objects[data.name], data.plugin, data.newval, true, true);
            //Name changes
            if (data.plugin == "name" && data.newval.value) {
                objects[data.newval.value] = objects[data.name];
                delete objects[data.name];
                gameHierarchy();
            }
            try {
                //All changes except plugin add/remove ( name changes included)
                if (!selectedSprite || data.name == selectedSprite.name.value) {
                    if (data.action == "change" && $("input:focus" + "." + data.plugin + "__" + i).length == 0) {
                        for (var i in data.newval) {
                            $("." + data.plugin + "__" + i).val(data.newval[i]);
                            data.newval[i];
                        }
                    }
                    else if ($("input:focus").length == 0)
                        reDrawPanel({ name: { value: data.name } });

                }

            } catch (e) {

            }
        }
    }
}
//Easier access for socket.emit function
function socketemit(name, data) {
    if (injectEmit[name] != undefined)
        injectEmit[name](data);
    else {
        if (debuggingGame) {
            try {
                var ifrm = $("#playgame").find("iframe")[0].contentWindow;
                switch (name) {
                    case "gameobject":
                        ifrm.FromEditorobjectpropertieschange(data);
                        break;
                    case "deleteGameObject":
                        ifrm.FromEditordeleteGameObjectDone(data);
                        break;
                    case "addGameObject":
                        ifrm.FromEditoraddGameObjectServer(data);
                        break;
                    default:
                }
            } catch (e) {

            }

        }
    }
    socket.emit(name, data);

}