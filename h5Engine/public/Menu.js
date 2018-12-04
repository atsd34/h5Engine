//Top Menu of game engine

var debuggingGame = false;
var defaultProjectFolder = "c:\test1";
var guiVisible = true;
var settings = {};
var tempCamera = {};
function Menu() {
    //Hidden windows has their toggle button enabled , Shown windows their toggle button disabled
    if ($("#gameassets").length == 0) {
        if ($(".btnAssets").hasClass("disabled")) {
            $(".btnAssets").removeClass("disabled");
            $(".btnAssets").attr("disabled", false);

        }
    } else {
        $(".btnAssets").addClass("disabled");
        $(".btnAssets").attr("disabled", true);
    }
    if ($("#gamehierarchy").length == 0) {
        if ($(".btnHierarchy").hasClass("disabled")) {
            $(".btnHierarchy").removeClass("disabled");
            $(".btnHierarchy").attr("disabled", false);
        }
    } else {
        $(".btnHierarchy").addClass("disabled");
        $(".btnHierarchy").attr("disabled", true);
    }
    if ($("#gamedesign").length == 0) {
        if ($(".btnScene").hasClass("disabled")) {
            $(".btnScene").removeClass("disabled");
            $(".btnScene").attr("disabled", false);
        }
    } else {
        $(".btnScene").addClass("disabled");
        $(".btnScene").attr("disabled", true);
    }
    if ($("#gameproperties").length == 0) {
        if ($(".btnProperties").hasClass("disabled")) {
            $(".btnProperties").removeClass("disabled");
            $(".btnProperties").attr("disabled", false);
        }
    } else {
        $(".btnProperties").addClass("disabled");
        $(".btnProperties").attr("disabled", true);
    }

}
var lastSceneName;
var dir = "";
//Initial Menu preperation
$(function () {
    $(window).on("resize", resizeWindow);
    $(".dvMenu").html('<input type="file" style="display:none" id="flProject">')
    //File Menu
    addMenu("File", function () {
        //When file sub menu is opened , if you are working on saved scene save scene command shows current scene name
        if (lastSceneName)
            $($(".btnSaveScene")).text("Save Scene(" + lastSceneName + ")");
        else
            $($(".btnSaveScene")).text("Save Scene (NEW)");

        $(".btnRecentList").remove();
        //When file sub menu is opened , Recent projects list is refreshed
        for (var i = recentFiles.length - 1; i >= 0; i--) {
            (function (n) {
                addMenu(n, function () {
                    socketemit("ProjectFolderOpen", { Folder: n });
                }, ".btnFile", undefined, "btnRecentList");
            })(recentFiles[i]);
        }
    }, "", undefined, "btnFile");

    //UNDO
    addMenu("<i class='glyphicon glyphicon-arrow-left' />", function () {

        socketemit("undo");
    }, "", undefined, "btnUndo");
    //REDO
    addMenu("<i class='glyphicon glyphicon-arrow-right' />", function () {
        socketemit("redo");
    }, "", undefined, "btnRedo");
    //Hide in-game gui for designer
    addMenu("Hide GUI", function () {
        toggleGUI();
    }, "", undefined, "btnShowGUI");
    //Project Settings Modal form
    addMenu("Settings", function () {
        var oldPixel = settings.PixelPerfect;
        modalForm(settings, {
            Save: function (i) {
                socketemit("saveSettings", i);

                if (game && game.renderer && settings && settings.BackgroundColor)
                    game.renderer.backgroundColor = parseInt("0x" + settings.BackgroundColor, 16);
                if (i.PixelPerfect != oldPixel)
                    window.location.href = window.location.href;
            }
        });
    }, "", undefined, "btnStop");
    //Recreate solution and Open project solution in new visual studio 
    addMenu("Open With Visual Studio", function () {
        socketemit("VisualStudio");
    }, ".btnFile", undefined, "");
    //Open project folder
    addMenu("Open Project", function () {
        var projectFolderObject = {
            "Please Enter Project Folder,If It exists you will open project": undefined,
            Folder: defaultProjectFolder
        }


        modalForm(projectFolderObject, {
            "Change": function (i) {
                socketemit("ProjectFolderOpen", i);
            }
        });
        $("[nameOfVal='Standart Assets']").attr("disabled", true);
        $("[nameOfVal='PIXI renderer']").attr("disabled", true);
    }, ".btnFile", undefined, "");
    //Create new project in given folder with selected plugins
    addMenu("New Project", function () {
        var projectFolderObject = {
            "Please Enter Project Folder": undefined,
            Folder: defaultProjectFolder,
            "--------------------------------------": undefined,
            "Please Select All needed plugins to import / if it is existing project you dont need to select any": undefined,
            "---------------------------------------": undefined

        }

        for (var i in plugins) {

            projectFolderObject[i] = ["Standart Assets", "PIXI renderer", "Sound", "p2 Physics"].indexOf(i) != -1;
        }
        modalForm(projectFolderObject, {
            "Change": function (i) {
                socketemit("ProjectFolderSave", i);
            }
        });
        $("[nameOfVal='Standart Assets']").attr("disabled", true);
        $("[nameOfVal='PIXI renderer']").attr("disabled", true);
    }, ".btnFile", undefined, "");

    //Test project in new browser window. Project opens with first available scene that set in "Scene Order"
    addMenu("Export Project(Test First Scene) (F6)", function () {
        socketemit("export");
    }, ".btnFile", undefined, "");
    //Test project in new browser window. Project opens with the scene that you are working
    addMenu("Export Project(Test Current Scene) (F7)", function () {
        socketemit("exportcurrent");
    }, ".btnFile", undefined, "");
    //Create minified project for deployment
    addMenu("Export Project(Save)", function () {
        socketemit("exportSave");
    }, ".btnFile", undefined, "");
    $('#flProject').on('change', function () {
        var files = $(this).get(0).files;
        if (files.length > 0) {
            var reader = new FileReader();
            reader.onload = function () {
                var text = reader.result;
                socketemit("OpenProject", { name: files[0].name, text: text });
            };
            reader.readAsArrayBuffer(files[0]);
        }
    });


    $('<li role="separator" class="divider"></li>').appendTo($(".btnFile").parent().find("ul"));
    //Create new unnamed-unsaved scene
    addMenu("New Scene", function () {
        if (!saved)
            if (confirm("Do you want to save current scene?"))
                SaveScene(false);
        lastSceneName = undefined;
        socketemit("NewScene");
    }, ".btnFile", undefined, "");
    //Save current scene (Override if exists , create new one if it is new)
    addMenu("Save Scene", function () {
        SaveScene(false);
    }, ".btnFile", undefined, "btnSaveScene");
    //Save current Scene as new asset with new name
    addMenu("Save Scene As", function () {
        SaveScene(true);
    }, ".btnFile", undefined, "");
    //Change Scene Order also include-exclude scenes from scene order (You can use scenes even it is not included in order) 
    addMenu("Scene Order", function () {
        var scenes = assetList.filter(i => i.name.toLowerCase().endsWith(".scene")).map(i => i.name);
        var start = SceneOrder.filter(i => scenes.indexOf(i) != -1);
        var end = scenes.filter(i => SceneOrder.indexOf(i) == -1);

        var mObj = { "Scene Order": start, "Unused Scenes": end };

        modalForm(mObj, {
            "Save": function (i) {
                SceneOrder = i["Scene Order"];
                socketemit("saveSceneOrder", SceneOrder);
            }
        });

    }, ".btnFile", undefined, "");
    $('<li role="separator" class="divider"></li>').appendTo($(".btnFile").parent().find("ul"));
    //Import plugins that created by default, 3rd parties or you , For more information about plugin system check documentation
    addMenu("Import Plugin to Project", function () {
        var pluginsObject = {
            "Please Select All needed plugins to import ,if it exists in project files will be overwritten!": undefined,
            "---------------------------------------": undefined

        }
        for (var i in plugins) {
            pluginsObject[i] = false;

        }
        modalForm(pluginsObject, {
            "Import": function (i) {
                socketemit("ImportPlugin", i);
            }
        });
    }, ".btnFile", undefined, "");
    //Save existing or new plugin by selecting included assets
    addMenu("Save Plugin", function () {
        var pluginsObject = {
            "Existing Plugin Name": "New",
            "comboBox": [{
                included: ["Existing Plugin Name"],
                vals: []
            }],
            "Plugin Name": "",
            "Select Included Assets": undefined
        }
        pluginsObject.comboBox[0].vals.push("New");
        for (var i in plugins) {
            pluginsObject.comboBox[0].vals.push(i);
        }
        for (var i in assetList) {
            pluginsObject[assetList[i].name] = false;
        }
        modalForm(pluginsObject, {
            "Save": function (o) {
                if (!o["Plugin Name"]) {
                    alert("You must specify plugin name");
                    return true;
                }
                var haschecked = false;
                for (var i in o) {
                    if (o[i] == true)
                        haschecked = true;
                }
                if (!haschecked) {
                    alert("You must select at least one asset");
                    return true;
                }
                socketemit("SavePlugin", o);
            },
            "Delete Selected Plugin": function (o) {
                socketemit("DeletePlugin", o);
            }
        });
        $("[nameOfVal='Existing Plugin Name']").on("change", function () {
            if ($(this).val() != "New") {
                $("[nameOfVal='Plugin Name']").val($(this).val());
                $("[nameOfVal='Plugin Name']").attr("disabled", true);
                pluginsObject['Plugin Name'] = $(this).val();
                $("[nameOfVal][type=checkbox]").prop("checked", false);
                for (var i in plugins[$(this).val()]) {
                    $("[nameOfVal='" + i.replace(/\\/g, "_") + "']").prop("checked", true);
                    if (i in pluginsObject)
                        pluginsObject[i] = true;
                }
            } else {
                $("[nameOfVal='Plugin Name']").attr("disabled", false);

            }
        });

    }, ".btnFile", undefined, "");


    //
    addMenu("Export Plugin to File", function () {
        var pluginsObject = {
            "Click plugins to export ": undefined,
            "---------------------------------------": undefined
        }
        for (var i in plugins) {
            (function (i) {
                pluginsObject[i] = function () {
                    socketemit("ExportPluginFile", i);
                }
            })(i)

        }
        modalForm(pluginsObject, {

        });
    }, ".btnFile", undefined, "");
    //
    addMenu("Import Plugin from file", function () {
        var pluginsObject = {
            '<input name="file" id="flPluginNew" type="file" accept=".zip" />': undefined,
            "Plugin Name": ""
        }

        modalForm(pluginsObject, {
            "Import": function (p) {
                for (var i in plugins) {
                    if (i == p["Plugin Name"]) {
                        if (!confirm("A plugin with same name exists do you want to overwrite"))
                            return true;
                    }
                }
                var f = $("#flPluginNew");
                var reader = new FileReader();
                reader.onload = function () {
                    var text = reader.result;
                    var snd = { name: p["Plugin Name"], str: text };
                    socketemit("SavePluginFile", snd);
                };
                var str = reader.readAsArrayBuffer(f.get(0).files[0]);


            }
        });
        var fl = $("#flPluginNew");
        fl.on("change", function () {
            if (fl.val()) {
                var fname = fl.val().split('\\');

                fname = fname[fname.length - 1].split('.')[0]
                $("[nameofval='Plugin Name']").val(fname);
            } else {
                $("[nameofval='Plugin Name']").val('');
            }
            pluginsObject["Plugin Name"] = $("[nameofval='Plugin Name']").val();
        });
    }, ".btnFile", undefined, "");
    $('<li role="separator" class="divider"></li>').appendTo($(".btnFile").parent().find("ul"));
    // Hide /Show Hierarchy,Scene,Properties and Assets windows
    addMenu("Hierarchy", function () {
        var newItemConfig = {
            title: "Hierarchy",
            type: 'component',
            componentName: 'testComponent',
            componentState: { label: 'gamehierarchy' }
        };
        if (myLayout.root.contentItems.length > 0)
            myLayout.root.contentItems[0].addChild(newItemConfig);
        else
            myLayout.root.addChild(newItemConfig);
        activateByTitle("Hierarchy");
        gameHierarchy()

    }, "", undefined, "btnHierarchy");
    addMenu("Scene", function () {
        var newItemConfig = {
            title: "Game",
            type: 'component',
            componentName: 'testComponent',
            componentState: { label: 'gamedesign' }
        };
        if (myLayout.root.contentItems.length > 0)
            myLayout.root.contentItems[0].addChild(newItemConfig);
        else
            myLayout.root.addChild(newItemConfig);
        gameDesign();
        activateByTitle("Game");
    }, "", undefined, "btnScene");
    addMenu("Properties", function () {

        var newItemConfig = {
            title: "Properties",
            type: 'component',
            componentName: 'testComponent',
            componentState: { label: 'gameproperties' }
        };
        if (myLayout.root.contentItems.length > 0)
            myLayout.root.contentItems[0].addChild(newItemConfig);
        else
            myLayout.root.addChild(newItemConfig);
        activateByTitle("Properties");
    }, "", undefined, "btnProperties");
    addMenu("Assets", function () {
        var newItemConfig = {
            title: "Assets",
            type: 'component',
            componentName: 'testComponent',
            componentState: { label: 'gameassets' }
        };
        if (myLayout.root.contentItems.length > 0)
            myLayout.root.contentItems[0].addChild(newItemConfig);
        else
            myLayout.root.addChild(newItemConfig);
        gameAssetList(assetList);

        activateByTitle("Assets");
    }, "", undefined, "btnAssets");

    addMenu("Documentation", function () {
        var win = window.open("/help/help.html", '_blank');
        win.focus();
    }, "", undefined, "");
});
// Save scene 
// 1st Param : Save as new asset or not
function SaveScene(SaveAs) {
    if (SaveAs || !lastSceneName) {
        var tmp = window.prompt("Scene Name", "");
        if (!tmp.endsWith(".scene"))
            tmp += ".scene";
        for (var i = 0; i < assetList.length; i++) {
            if (assetList[i].name == tmp) {
                alert("Already Exists");
                return;
            }
        }
        lastSceneName = tmp;
    }
    socketemit("SaveScene", lastSceneName);
    saved = true;
}
// Activate window by windows title
function activateByTitle(tt) {
    var a = myLayout.root.getItemsByFilter(function (item) { if (item.isComponent && item.config.title.trim() == tt) { return true } });
    if (a.length > 0) {
        var parent = a[0].parent;
        if (parent.isStack) {
            parent.setActiveContentItem(a[0])
        }
    }
    return a;
}
// Add functionality to any menu 
// 1st Param : Menu's name
// 2nd Param : Menu's function that executes when clicked
// 3rd Param : If sub menu this is jquery selector for parent if undefined = added as first menu
// 4th Param : Where menu located if undefined = TOP menu
// 5th Param : html class for menu button
function addMenu(Label, Function, Parent, Where, Class) {
    var btn = undefined;
    if (Where == undefined)
        Where = $(".dvMenu");
    else
        Where = $(Where);
    var btnGroup = Where.find(".btn-group");
    if (btnGroup.length == 0)
        btnGroup = $('<div class="btn-group btn-xs" role="group" aria-label="..." />').appendTo(Where);
    if (!Parent) {
        btn = $('<button type="button" class="btn btn-default btn-xs ' + Class + '">' + Label + '</button>').appendTo($('<div class="dropdown" style="display:inline" />').appendTo(btnGroup));
    }
    else {
        var parentBtn = $(Parent);

        if (!parentBtn.hasClass('dropdown-toggle')) {
            parentBtn.addClass('dropdown-toggle');
            parentBtn.attr("data-toggle", "dropdown");
            parentBtn.attr("aria-haspopup", "true");
            parentBtn.attr("aria-expanded", "false");
            $('<ul class="dropdown-menu" parentClass="' + Parent + '" />').appendTo(parentBtn.parent());
        }
        var ul = parentBtn.parent().find("ul[parentClass='" + Parent + "']");
        btn = $("<li class='btn-xs " + Class + "' >" + Label + "</li>").appendTo(ul);
    }

    btn.on("click", Function);
    return btn;
}

function toggleGUI() {

    if (guiVisible) {
        HideGUI();
        $(".btnShowGUI").html("Show GUI");
    } else {
        ShowGUI();
        $(".btnShowGUI").html("Hide GUI");
    }
}
function HideGUI() {
    guiVisible = false;
    for (var i = 0; i < game.stage.children.length; i++) {
        if (game.stage.children[i] == guiContainer) {
            game.stage.removeChild(guiContainer);
        }
    }

}
function ShowGUI() {
    guiVisible = true;
    var haveGUI = false;
    for (var i = 0; i < game.stage.children.length; i++) {
        if (game.stage.children[i] == guiContainer) {
            haveGUI = true;
        }
    }
    if (!haveGUI)
        game.stage.addChild(guiContainer);
}
// Creates and opens modal form that is used for changing any simple object
// 1st Param : an object that presents modal box, generally a Label and current value required , created html depends on current value 
//For example if value is string it creates <input />
// String = textbox , Boolean =checkbox ,function =button , Number =number ,Array = sortable
//Exception : if there is combobox property it checks combobox[property name] and creates combobox with combobox[property name] array options
// 2nd Param : Buttons that closes (if function returns true it stays open ) modal with given functionality 
//function takes 1 parameter which is changed object with new values
//Example : {"OK" :function(obj){ if(check(obj){
//                                  saveObject(obj); 
//                                  }else{
//alert("validation failed")
//return true;
//}
//} ,}
function modalForm(object, buttons) {
    var div = $("<div  />");
    var len = 0;

    for (var i in object) {
        if (i != ("comboBox")) {
            (function (object, i, div) {
                len++;
                if (typeof (object[i]) != "function")
                    ($("<span ></span").appendTo(div)).html(i);
                var o = object[i];
                if (o != undefined) {
                    var combo = undefined;
                    if (object["comboBox"] != undefined) {
                        var combos = $.grep(object["comboBox"], function (c) {
                            return c.included.indexOf(i) != -1;
                        });
                        if (combos.length > 0)
                            combo = combos[0];
                    }

                    if (combo != undefined) {
                        var inp = $("<select style='width:100%' />").appendTo(div);
                        inp.attr("nameOfVal", i.replace(/\\/g, "_"));
                        for (var k = 0; k < combo.vals.length; k++) {
                            inp.append("<option>" + combo.vals[k] + "</option>");
                        }
                        inp.val(o);
                        inp.on("change", function () {
                            object[i] = inp.val();
                        });

                    } else {
                        switch (typeof (o)) {
                            case "function":
                                var btn = $("<button class='btn' >" + i + "</button>").appendTo(div);
                                btn.on("click", o);
                                div.append("<br />");
                                break;
                            case "number":
                                var inp = $("<input style='width:100%' type='numeric' />").appendTo(div);
                                inp.attr("nameOfVal", i.replace(/\\/g, "_"));
                                inp.val(o);
                                inp.on("input", function () {
                                    object[i] = parseFloat(inp.val());
                                });
                                break;
                            case "boolean":

                                var inp = $("<input type='checkbox' />").appendTo(div);
                                inp.attr("nameOfVal", i.replace(/\\/g, "_"));
                                div.append("<br />");
                                inp.prop("checked", o);
                                inp.on("change", function () {
                                    object[i] = inp.is(":checked");
                                });
                                break;
                            case "object":
                                if (o.constructor == Array) {
                                    var ul = $("<ol class='connectedSortable' style='min-height: 30px;min-width:40px;background-color:rgb(233, 233, 233);padding-bottom:10px'/>").appendTo(div);
                                    for (var k = 0; k < o.length; k++) {
                                        var it = o[k];
                                        var inp = $('<li class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s" />' + it + '</li>').appendTo(ul);
                                        inp.attr("SceneName", it);
                                    }
                                    ul.sortable({
                                        connectWith: ".connectedSortable",
                                        stop: function (event, ui) {
                                            var list = ul.sortable("toArray", { attribute: 'SceneName' });
                                            object[i] = list;
                                        },
                                        receive: function (event, ui) {
                                            var list = ul.sortable("toArray", { attribute: 'SceneName' });
                                            object[i] = list;
                                        }
                                    });
                                    ul.disableSelection();
                                }
                                break;
                            default:
                                var inp = $("<input style='width:100%' />").appendTo(div);
                                inp.attr("nameOfVal", i.replace(/\\/g, "_"));
                                inp.val(o);
                                inp.on("input", function () {
                                    object[i] = inp.val();
                                });

                        }
                    }
                } else {
                    div.append("<br />");
                }
            })(object, i, div);
        }
    }
    var buttonFunctions = {};
    if (buttons != undefined) {
        for (var i in buttons) {
            (function (i, div) {
                buttonFunctions[i] = function () {
                    var retval = buttons[i](object);
                    if (retval != true) {
                        div.dialog("close");
                        $(div).html('');
                        $(div).remove();
                    }
                }
            })(i, div);
        }
    }
    div.dialog({

        height: 400,
        width: 450,
        modal: true,
        buttons: buttonFunctions
    });
}