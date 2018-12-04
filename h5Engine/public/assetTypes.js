//When double click on any asset associated action happens here depending of asset type

var editor;
function openAssetType(event) {
    var extension = event.node.name.split('.');
    var name = event.node.name;
    var folder = event.node.folder();
    var full = folder + "\\" + name;
    if (extension.length == 1)
        extension = "Folder";
    else {
        extension = extension[extension.length - 1];
    }
    //If animation editing phase is on, add image to animation
    if (isImage(name) && $("#dvAnimation").length > 0) {
        addImageToAnimation(full)
    }
    switch (extension) {
        case "Folder":
            //Expand / Collapse folder
            if (event.node.is_open)
                $(".dvAssetFiles").tree('closeNode', event.node, false);
            else
                $(".dvAssetFiles").tree('openNode', event.node, false);
            break;
        case "scene":
            //Open scene
            if (!saved)
                if (confirm("Do you want to save current scene?"))
                    SaveScene(false);
            socketemit("OpenScene", full);
            lastSceneName = name;
            break;
        case "prefab":
            //Get asset from server and Add prefab to current scene
            $.get("assets/" + full, function (e) {
                prefabs[name] = JSON.parse(e);
                var nm = addPrefab(name, { position: { x: camera.x, y: camera.y } }, true);
                for (var i = 0; i < nm.length; i++) {
                    var JSONReadyGO = goBack(objects[nm[i]]);

                    socketemit("addGameObject", JSONReadyGO);
                }
            });
            break;
        case "anim":
            //Get asset from server and Open animation editor
            $.get("assets/" + full, function (e) {
                var dvAnimation = $("#dvAnimation");
                if (dvAnimation.length == 0) {
                    var newItemConfig = {
                        title: "Animation Editor",
                        type: 'component',
                        componentName: 'testComponent',
                        componentState: { label: 'dvAnimation' }
                    };

                    if (myLayout.root.contentItems.length > 0)
                        myLayout.root.contentItems[0].addChild(newItemConfig);
                    else
                        myLayout.root.addChild(newItemConfig);
                    dvAnimation = $("#dvAnimation");
                }
                AnimationEditor(full, e);
                activateByTitle("Animation Editor");
            });
            break;

        case "physics":
            //Get asset from server and open material editor
            $.get("assets/" + full, function (e) {
                var dvPhysics = $("#dvPhysics");
                if (dvPhysics.length == 0) {
                    var newItemConfig = {
                        title: "Physics Material Editor",
                        type: 'component',
                        componentName: 'testComponent',
                        componentState: { label: 'dvPhysics' }
                    };

                    if (myLayout.root.contentItems.length > 0)
                        myLayout.root.contentItems[0].addChild(newItemConfig);
                    else
                        myLayout.root.addChild(newItemConfig);
                    dvPhysics = $("#dvPhysics");
                }
                PhysicsEditor(full, e);
                activateByTitle("Physics Material Editor");
            });
            break;
        case "js":
            //Get asset from server and open javascript editor
            $.get("assets/" + full, function (e) {
                lastJS = full;
                var script = $("#dvJavaScipt");
                var isNew = false;
                var startScript = e;
                if (script.length == 0) {
                    var newItemConfig = {
                        title: "Javascript",
                        type: 'component',
                        componentName: 'testComponent',
                        componentState: { label: 'dvJavaScipt' }
                    };

                    if (myLayout.root.contentItems.length > 0)
                        myLayout.root.contentItems[0].addChild(newItemConfig);
                    else
                        myLayout.root.addChild(newItemConfig);
                    script = $("#dvJavaScipt");
                    isNew = true;
                    var stck = myLayout.root.getItemsByFilter(function (item) { if (item.isComponent && item.config.title.trim() == "Javascript") { return true } })[0].parent;
                    stck.header
                        .controlsContainer
                        .find('.lm_close') //get the close icon
                        .off('click') //unbind the current click handler
                        .click(function () {
                            if (editor.getValue() != startScript) {
                                if (confirm('Do you want to save before closing (CTRL-S next time)?')) {
                                    socketemit("addFile", { name: editor.javascriptFileName, content: editor.getValue(), type: "text" });
                                }
                                stck.remove();
                            } else {
                                stck.remove();
                            }
                        });
                    var tab = myLayout.root.getItemsByFilter(function (item) { if (item.isComponent && item.config.title.trim() == "Javascript") { return true } })[0].tab;
                    tab.closeElement
                        .off('click') //unbind the current click handler
                        .click(function () {
                            if (editor.getValue() != startScript) {
                                if (confirm('Do you want to save before closing (CTRL-S next time)?')) {
                                    socketemit("addFile", { name: editor.javascriptFileName, content: editor.getValue(), type: "text" });
                                }
                                tab.contentItem.remove();
                            }
                            else {
                                tab.contentItem.remove();
                            }
                        });
                }
                if (editor == undefined || script.length == 0 || isNew == true) {
                    $("#dvJavaScipt").html('');
                    ace.require("ace/ext/language_tools");
                    var beautify = ace.require("ace/ext/beautify");
                    editor = ace.edit("dvJavaScipt");
                    editor.setOptions({
                        enableBasicAutocompletion: true,
                        enableSnippets: true,
                        enableLiveAutocompletion: false
                    });
                    editor.setTheme("ace/theme/monokai");
                    editor.getSession().setMode("ace/mode/javascript");
                }
                editor.setValue(e);
                editor.javascriptFileName = full;

                editor.commands.addCommand({
                    name: 'saveFile',
                    bindKey: {
                        win: 'Ctrl-S',
                        mac: 'Command-S',
                        sender: 'editor|cli'
                    },
                    exec: function (env, args, request) {
                        startScript = editor.getValue();
                        socketemit("addFile", { name: editor.javascriptFileName, content: editor.getValue(), type: "text" });
                    }
                });
                editor.commands.addCommand({
                    name: 'beatufiy',
                    bindKey: {
                        win: 'Ctrl-B',
                        mac: 'Command-B',
                        sender: 'editor|cli'
                    },
                    exec: function (env, args, request) {
                        var r = editor.getCursorPosition().row;
                        var c = editor.getCursorPosition().column;
                        editor.setValue(js_beautify(editor.getValue()));
                        setTimeout(function () {
                            try {
                                editor.gotoLine(r + 1);
                            } catch (e) {

                            }
                        }, 5);
                    }
                });
                activateByTitle("Javascript");
            })
            break;
        default:
    }

}


function getDefaultJs(name) {
    return "gm." + name + " = function(){ \n" +
        "\t//this.worksInEditor=false;\n" +
        "}\n" +
        "gm." + name + ".prototype.create=function () {\n" +
        "\n" +
        "}\n" +
        "gm." + name + ".prototype.update=function (dt) {\n" +
        "\n" +
        "}\n" +
        "gm." + name + ".prototype.dispose=function () {\n" +
        "\n" +
        "}\n" +
        "\t//other events are : \n" +
        "\t//Secondary Create : afterCreate \n" +
        "\t//Physics : beginContact,endContact,impact \n" +
        "\t//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe \n" +
        "\t//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control \n" +
        "\t//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove \n" +
        "\t// Scene management : sceneChange,nextLevel"

}

function CreateNewWindow(Title, elementName) {
    if (elementName == undefined)
        elementName = Title.replace(/[^a-zA-Z0-9]/g, "");
    var createdDv = $("#" + elementName);
    if (createdDv.length == 0) {
        var newItemConfig = {
            title: Title,
            type: 'component',
            componentName: 'testComponent',
            componentState: { label: elementName }
        };

        if (myLayout.root.contentItems.length > 0)
            myLayout.root.contentItems[0].addChild(newItemConfig);
        else
            myLayout.root.addChild(newItemConfig);
        createdDv = $("#" + elementName);
    }
    return createdDv;

}
function FindTabByTitle(Title) {

    var tab = myLayout.root.getItemsByFilter(function (item) { if (item.isComponent && item.config.title.trim() == Title) { return true } });
    if (tab.length > 0)
        return tab[0].tab;
}
function FindStackByTitle(Title) {
    var stck = myLayout.root.getItemsByFilter(function (item) { if (item.isComponent && item.config.title.trim() == Title) { return true } });
    if (stck.length > 0)
        return stck[0].parent;
}