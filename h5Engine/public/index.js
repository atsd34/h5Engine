///TODO 
//Comments
//Documentetion
//Tutorial (3)
//Credits

/// Credits :
// GoldenLayout https://golden-layout.com/
//socket.io https://socket.io/
//jquery 3.2.1 https://jquery.com/
// p2.js https://schteppe.github.io/p2.js/
//pixi http://www.pixijs.com/
//pixi-display - v1.0.1 https://github.com/pixijs/pixi-display
//bootstrap http://getbootstrap.com/
// JqTree 1.4.0 https://mbraak.github.io/jqTree/
// Jquery UI https://jqueryui.com/
// ACE Editor https://ace.c9.io/
// ADM.zip https://www.npmjs.com/package/adm-zip
// prettydiff 2 https://prettydiff.com/2/
// node watch https://www.npmjs.com/package/node-watch
// uglify.js https://github.com/mishoo/UglifyJS
// Liquidfun-Box2d https://github.com/flyover/box2d.js
//Poly decomp.js https://github.com/schteppe/poly-decomp.js/
// Wrench.js https://github.com/ryanmcgrath/wrench-js
//context menu https://github.com/s-yadav/contextMenu.js


var INEDITOR;
var lastKey = "";
var socket;
var deleteDisabled = false;
var copiedGameObject = undefined;
$(function () {
    socket = io.connect();
    socketOn(socket);
})
var obj = {};
var saved = true;
//Settings for golden layout
var config = {
    settings: {
        hasHeaders: true,
        constrainDragToContainer: true,
        reorderEnabled: true,
        selectionEnabled: false,
        popoutWholeStack: false,
        blockedPopoutsThrowError: true,
        closePopoutsOnUnload: true,
        showPopoutIcon: false,
        showMaximiseIcon: true,
        showCloseIcon: true
    },
    content: [{
        type: 'row',
        content: [
            {
                type: 'column',
                width: 20,
                content: [{
                    title: 'Hierarchy',
                    type: 'component',
                    componentName: 'testComponent',
                    componentState: { label: 'gamehierarchy' }
                },
                {
                    title: 'Assets',
                    type: 'component',
                    componentName: 'testComponent',
                    componentState: { label: 'gameassets' }
                }]
            }, {
                title: 'Game',
                type: 'component',
                componentName: 'testComponent',
                componentState: { label: 'gamedesign' }
            },
            {
                title: 'Properties',
                width: 20,
                type: 'component',
                componentName: 'testComponent',
                componentState: { label: 'gameproperties' }
            }
        ]
    }]
};
//Previous UI State stored in localstorage
var myLayout,
    savedState = localStorage.getItem('savedState');
//Predefined UI or Saved UI
if (savedState !== null) {
    myLayout = new GoldenLayout(JSON.parse(savedState), ".dvEngine");
} else {
    myLayout = new GoldenLayout(config, ".dvEngine");
}
//Mainb UI
myLayout.registerComponent('testComponent', function (container, componentState) {
    var parent = container.getElement().html("<div style='width:100%;height:100%' id='" + componentState.label + "' ></div>");
});
myLayout.init();
//Auto Save UI
myLayout.on('stateChanged', function () {
    resizeGame();
    resizeWindow();
    try {

        var state = JSON.stringify(myLayout.toConfig());
        localStorage.setItem('savedState', state);
    } catch (e) {
    }
});

//Keyboard actions depends active UI window.
var lastFocus = $(":focus");
//Test Game
$("*").on("keydown", function (e) {
    if (e.key == "F6") {
        socketemit("export");
        e.preventDefault();
    }
    else if (e.key == "F7") {
        socketemit("exportcurrent");
        e.preventDefault();
    }
});
$("*").on("keyup", function (e) {
    lastKey = e;
    if ((e.which == 90 || e.keyCode == 90) && e.ctrlKey) //CTRL-Z
        socketemit("undo");
    if ((e.which == 89 || e.keyCode == 89) && e.ctrlKey) //CTRL -Y
        socketemit("redo");

    lastFocus = $(":focus");
    if ((e.which == 67 || e.keyCode == 67) && e.ctrlKey && lastFocus.parents("#gameproperties").length == 0 &&
        (lastFocus.length == 0 || lastFocus.parents("#gamehierarchy").length > 0) && selectedSprite) //CTRL-C
    {
        copiedGameObject = goBack(selectedSprite);
    }
    if ((e.which == 86 || e.keyCode == 86) && e.ctrlKey) //CTRL-V
    {
        if (copiedGameObject && lastFocus.parents("#gameproperties").length == 0) {
            copiedGameObject.name.value = getGOName("GameObject");
            if (!e.shiftKey) {

                copiedGameObject.position.x = mouse.x;
                copiedGameObject.position.y = mouse.y;
            }
            socketemit("addGameObject",
                copiedGameObject);
        }
    }
    //Delete Game Object
    if (lastFocus.parents("#gameassets").length == 0) {
        if (e.keyCode == 46 && selectedSprite && //DEL
            (lastFocus.length == 0 || lastFocus.parents("#gamehierarchy").length > 0)) {
            if (!lockedSelection && !deleteDisabled)
                deleteGameObject(selectedSprite.name.value);
        }
        if (e.keyCode == 113 && selectedSprite) { //F2
            $($("#gameproperties").find("input")[0]).focus();
            $($("#gameproperties").find("input")[0]).select();
        }
    } else {
        //Delete Asset
        if (e.keyCode == 46) { //DEL
            var filename = $($("#gameassets").find(".dvAssetFiles")[0]).tree('getSelectedNode');
            socketemit("deleteFile",
                {
                    name: filename.name,
                    folder: filename.folder(),
                    isFolder: filename.isFolder()
                });
        } else if (e.keyCode == 113) { //F2
            e.preventDefault();
            var filename = $($("#gameassets").find(".dvAssetFiles")[0]).tree('getSelectedNode');
            var newName = window.prompt("New Name", filename.name);
            socketemit("fileRename",
                {
                    name: filename.name,
                    folder: filename.folder(),
                    newName: newName
                });

        }
    }
});
function deleteGameObject(name) {
    var names = meAndChildren(name);

    socketemit("deleteGameObject",
        names
    );
}
//Returns Gameobject array that contains with name and all children recursively
function meAndChildren(name) {
    var arr = [name];
    for (var i in objects) {
        if (objects[i].position.parent == name) {
            arr = arr.concat(meAndChildren(objects[i].name.value));
        }
    }
    return arr;
}
function resizeWindow() {
    Menu();
    $(".dvEngine").width(window.innerWidth);
    $("body").css("overflow", "hidden");
    $(".dvEngine").height(window.innerHeight - $(".dvMenu").height() - $(".dvConsole").height());
    if (myLayout.width != $(".dvEngine").width() || myLayout.height != $(".dvEngine").height())
        myLayout.updateSize($(".dvEngine").width(), $(".dvEngine").height());
}
function message(text) {
    $(".dvConsole").html(text);
}
//Auto Save game engine state
window.onbeforeunload = function (e) {
    openedNodesHierarchy = new Array();
    getOpenNodes($(".dvHierarchyTree").tree('getTree'));
    openedNodesAssets = new Array();
    getOpenNodesAssets($(".dvAssetFiles").tree('getTree'));
    socketemit("solutionOptions",
        {
            hierarchy: openedNodesHierarchy,
            assets: openedNodesAssets,
            lastSceneName: lastSceneName,
            camera: camera,
            guiVisible: guiVisible,
            lastJS: lastJS,
            dir: dir
        });

}
function overrideFunction($this, nm, fn) {
    $this[nm] = (function (original) {
        return function () {
            original.apply($this, arguments);
            fn.apply($this, arguments);
        }
    })($this[nm])

}