// Game asset window Tree handled
var lastJS = undefined;
var assetList = new Array();
var assetTree = new Array();
var assetId = 0;
var openedNodesAssets = new Array();
var assetsQueue = undefined;
var assetTypesToShow = "All";
//Interface for Asset window creation/redrawn
function gameAssetList1(list) {
    if (assetsQueue != undefined) {
        clearTimeout(assetsQueue);
    }
    assetsQueue = setTimeout(function () {
        gameAssetList1(list);
    }, 100);
}
function drop_handler(event) {
    event.preventDefault();
    console.log(event);
}
//Filter asset depending on type
function rightType(name) {
    name = name.toUpperCase();
    switch (assetTypesToShow) {
        case "All":
            return true;
            break;
        case "Scenes":
            if (name.endsWith(".SCENE"))
                return true;
            break;
        case "Prefabs":
            if (name.endsWith(".PREFAB"))
                return true;
            break;
        case "Javascripts":
            if (name.endsWith(".JS"))
                return true;
            break;
        case "Others":

            if (!name.endsWith(".JS") && !name.endsWith(".SCENE") && !name.endsWith(".PREFAB"))
                return true;
            break;

        default:
            return true;
    }
}
//Main gameAsset Tree creation function
function gameAssetList(list) {
    //Get Current state of tree to set again after creating new tree
    focusId = -1;
    var assetNames = assetList.map(i => i.name);
    var newAssets = list.filter(i => assetNames.indexOf(i.name) == -1);
    var focus = "";
    if (newAssets.length == 1)
        focus = newAssets[0].name;
    var scrollAssets = ScrollPercent(".dvAssetFiles");
    openedNodesAssets = new Array();
    getOpenNodesAssets($(".dvAssetFiles").tree('getTree'));
    assetId = 0;
    var preInp = $("#gameassets").find("input[type=search]");
    var isFocused = preInp.is(":focus");
    var caret = isFocused ? preInp[0].selectionStart : -1;
    var keyword = preInp.val();
    if (keyword)
        keyword = keyword.toLowerCase();
    //Create HTML
    //1 Hidden file control
    //2 filter assets with types
    $("#gameassets").html('<input name="file" id="flAsset" type="file" multiple style="display:none" />' +
        '<span style="color:white">SHOW : </span><select class="slcAssets" />"');
    $("<option>All</option>").appendTo(".slcAssets");
    $("<option>Scenes</option>").appendTo(".slcAssets");
    $("<option>Prefabs</option>").appendTo(".slcAssets");
    $("<option>Javascripts</option>").appendTo(".slcAssets");
    $("<option>Others</option>").appendTo(".slcAssets");
    $(".slcAssets").val(assetTypesToShow);
    $(".slcAssets").on("change", function () {
        assetTypesToShow = $(".slcAssets").val();
        gameAssetList(assetList);
    });
    //Create empty folder
    var aFolder = addMenu("Empty Folder", function (e) {
        e.preventDefault();
        var selected = $(".dvAssetFiles").tree('getSelectedNode');
        var selectedFolder = "";
        if (selected && selected.isFolder && selected.isFolder())
            selectedFolder = selected.folder() + "\\" + selected.name;
        var name = prompt("Folder Name");
        var name = getNewAssetName(name);
        socketemit("AddDirectory", { folder: selectedFolder, name: name });
    }, "", "#gameassets", "");
    //Open /Add File from local computer
    var aFile =
        addMenu("Open File", function (e) {
            e.preventDefault();
            $("#flAsset").trigger('click');
        }, "", "#gameassets", "");
    //Create sprite animation
    addMenu("New Animation", function (e) {
        var selected = $(".dvAssetFiles").tree('getSelectedNode');
        var selectedFolder = "";
        if (selected && selected.isFolder && selected.isFolder())
            selectedFolder = selected.folder() + "\\" + selected.name;
        var name = prompt("Animation Name");
        var name = getNewAssetName(name, ".anim");
        socketemit("addFile", { folder: selectedFolder, name: name, content: "" });
    }, "", "#gameassets", "");
    //Toggle Prefab painter
    addMenu("Prefab Painter", function (e) {
        PrefabPainter();
    }, "", "#gameassets", "");
    if ($("#PrefabPainter").length > 0)
        editorLoadComplete.push(function () {
            PrefabPainter();
        });
    //Create empty Physics material
    //addMenu("New Physics Material", function (e) {
    //    var selected = $(".dvAssetFiles").tree('getSelectedNode');
    //    var selectedFolder = "";
    //    if (selected && selected.isFolder && selected.isFolder())
    //        selectedFolder = selected.folder() + "\\" + selected.name;
    //    var name = prompt("Name");
    //    var name = getNewAssetName(name, ".physics");
    //    socketemit("addFile", { name: name, folder: selectedFolder, content: JSON.stringify({ friction: 0.3, restitution: 0, stiffness: -1, surfaceVelocity: 0 }) });
    //}, "", "#gameassets", "");
    //Create new Script object, (Javascript)
    addMenu("New Script Object", function (e) {
        var selected = $(".dvAssetFiles").tree('getSelectedNode');
        var selectedFolder = "";
        if (selected && selected.isFolder && selected.isFolder())
            selectedFolder = selected.folder() + "\\" + selected.name;
        var name = prompt("Script Name");
        name2 = getNewAssetName(name, ".js");
        if (name.replace(/[a-zA-Z0-9_]/g, "") != "")
            alert("Filename should be alphanumeric");
        socketemit("addFile", { name: name2, content: getDefaultJs(name), type: "text", folder: selectedFolder });
    }, "", "#gameassets", "");
    //Open file happened
    $('#flAsset').on('change', function () {
        var selected = $(".dvAssetFiles").tree('getSelectedNode');
        var selectedFolder = "";
        if (selected && selected.isFolder && selected.isFolder())
            selectedFolder = selected.folder() + "\\" + selected.name;

        var files = $(this).get(0).files;

        if (files.length > 0) {
            for (var f = 0; f < files.length; f++) {
                (function (files, f) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        var text = reader.result;
                        socketemit("AddAsset", { name: files[f].name, text: text, folder: selectedFolder });
                    };
                    reader.readAsArrayBuffer(files[f]);
                })(files, f);
            }
        }

    });
    var where = "#gameassets";
    var filter = $("<br />").appendTo(where);
    //Search box
    var filter = $("<input type='search' style='width:100%' placeholder='Filter Assets' />").appendTo(where);
    if (keyword) {
        filter.val(keyword);
    }
    //When search box change filter tree
    filter.on("input", function (e) {
        gameAssetList(list);
    });

    //Create Asset Tree JSON 
    assetList = list;
    assetTree = new Array();

    for (var i = 0; i < assetList.length; i++) {
        var item = assetList[i].name;

        var path = item.split('\\');
        if (assetList[i].isFolder || rightType(item))
            addAssetTree(assetTree, path, "", assetList[i].isFolder, keyword, focus);

    }
    if (keyword)
        assetTree = FilterAssetTree(assetTree, keyword);

    //Create container DIV for Asset tree 
    var dv = $("<div class='dvAssetFiles' style='padding:0px 0px 0px 5px;background-color:#dddddd;height:70%'/>").appendTo("#gameassets");
    // Create Tree
    $(dv).tree({
        data: assetTree,
        autoOpen: false,
        dragAndDrop: true,
        closedIcon: $('<img src="libs/folder/images/directory.png" />'),
        openedIcon: $('<img src="libs/folder/images/folder_open.png" />'),
        onCreateLi: function (node, $li) {
            var type = "txt";
            var extension = node.name.split('.');
            if (extension.length == 1)
                extension = "Folder";
            else {
                extension = extension[extension.length - 1].toUpperCase();
            }

            switch (extension) {
                case "PNG":
                case "BMP":
                case "IMG":
                case "GIF":
                case "JPE":
                case "JPEG":
                case "JPG":
                case "RAS":
                case "TGA":
                case "TIFF":
                    type = "PSD";
                    break;
                case "WAV":
                case "MP3":
                case "OGG":
                    type = "music";
                    break;
                case "JS":
                    type = "code";
                    break;
                case "PREFAB":
                    type = "db";
                    break;
                case "ANIM":
                    type = "film";
                    break;
                case "PHYSICS":
                    type = "application";
                    break;
                case "Folder":
                    type = "";
                    break;
                case "SCENE":
                    type = "script";
                    break;

                default:
            }
            if (type != "") {
                $li.find('.jqtree-element').prepend(
                    '<img src="libs/folder/images/' + type + '.png" />'
                );
            }
        }
    });
    //Open associated action with asset
    //More on assetTypes.js
    $(dv).bind(
        'tree.dblclick',
        function (event) {
            openAssetType(event);
        }
    );
    editorLoadComplete.push(function () {
        if (lastJS && $("#dvJavaScipt").length > 0) {
            var ev = {
                node: { name: lastJS, folder: function () { return "" } }
            };
            openAssetType(ev);
        }
    });
    //Change Asset tree hierarchy
    $(dv).bind(
        'tree.move',
        function (event) {
            event.move_info.do_move();
            var filename = event.move_info.moved_node;
            if (filename.parent == undefined || filename.parent.isFolder()) {
                //            objects[event.move_info.moved_node.name].position.parent = event.move_info.moved_node.parent.name;
                socketemit("fileMoved",
                    {
                        name: filename.name,
                        folder: filename.folder(),
                        isFolder: filename.isFolder(),
                        newFolder: filename.parent == undefined || filename.parent == null || filename.parent.name == "" ? " " : filename.parent.folder() + "\\" + filename.parent.name
                    });
            } else {
                gameAssetList(assetList);
            }
        }
    );
    //Restore Asset tree state to before redrawn
    OpenAssets();
    if (isFocused) {
        filter.focus();
        filter[0].selectionStart = caret;
        filter[0].selectionEnd = caret;
    }
    ScrollPercent(".dvAssetFiles", scrollAssets);
    focusTreeElement(focusId, ".dvAssetFiles");
    if (focusId != -1)
        $(dv).tree('selectNode', $(dv).tree('getNodeById', focusId));

}
//Filter Asset tree JSON with keyword
function FilterAssetTree(assetTree, keyword) {
    var retval = new Array();
    for (var i = 0; i < assetTree.length; i++) {
        var it = assetTree[i];
        if (it.name.toLowerCase().indexOf(keyword) != -1)
            retval.push(it);
        else if (it.children) {
            var childrenFiltered = FilterAssetTree(it.children, keyword);
            if (childrenFiltered.length > 0) {
                it.children = childrenFiltered;
                retval.push(it);
            }
            else
                delete it.children;
        }
    }
    return retval;
}
//Open assets that were open before redrawing
function OpenAssets() {
    for (var i in openedNodesAssets) {
        var node = $(".dvAssetFiles").tree(
            'getNodeByCallback',
            function (node) {
                if (node.name == openedNodesAssets[i]) {
                    return true;
                }
                else {
                    return false;
                }
            }
        );
        $(".dvAssetFiles").tree('openNode', node, false);
    }
}
//Add Item to JSON tree
function addAssetTree(assetTree, path, folder, isFolder, keyword, focus) {

    var node = findNode(assetTree, path[0]);

    if (node == undefined) {
        if (isFolder)
            node = {
                name: path[0], id: assetId, folder: function () { return folder }, isFolder: function () { return true }
            }
        else
            node = {
                name: path[0], id: assetId, folder: function () { return folder }, isFolder: function () { return false }
            }
        if (focus && path[0] == focus) {
            focusId = assetId;
        }
        assetId++;
        assetTree.push(node);
    }
    if (path.length > 1) {
        node.isFolder = function () { return true };

        if (node.children == undefined)
            node.children = new Array();
        var newPath = path.splice(1);
        addAssetTree(node.children, newPath, folder + "\\" + path[0], isFolder);

    }
    assetTree = assetTree.sort(function (a, b) {
        if (a.isFolder() && !b.isFolder())
            return -1;
        else if (!a.isFolder() && b.isFolder())
            return 1;
        else if (a.name > b.name)
            return 1;
        else if (a.name < b.name)
            return -1;
        else
            return 0;
    });
}
//Find node info with name
function findNode(assetTree, item) {
    for (var i = 0; i < assetTree.length; i++) {
        if (assetTree[i].name == item)
            return assetTree[i];
        if (assetTree[i].children) {
            var retVal = undefined;
            retVal = findNode(assetTree[i].children, item);
            if (retVal)
                return retVal;
        }

    }
}
function getOpenNodesAssets(node) {
    try {
        for (var i in node.children) {
            if (node.children[i].is_open)
                openedNodesAssets.push(node.children[i].name);
            if (node.children[i].children)
                getOpenNodesAssets(node.children[i]);
        }
    } catch (e) {

    }

}

//When creating new asset create default name according to its type
function getNewAssetName(prefix, ext) {
    if (ext == undefined)
        ext = "";
    var i = 0;
    var name = prefix + ext;
    while (true) {
        var contains = false;
        for (var j = 0; j < assetTree.length; j++) {
            var item = assetTree[j];
            if (item.name == name) {
                contains = true;
            }
        }
        if (!contains)
            break;
        i++;

        name = prefix + i + ext;
    }
    return name;
}