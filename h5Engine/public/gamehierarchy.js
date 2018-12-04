//Game objects hierarchy tree window

var j = 0;
var selectedId = -1;
var focusId = -1;
var openedNodesHierarchy = new Array();
var hierarchyQueue = undefined;
var lastScrollHierarchy = 0;
//Sets/Get game hierarchy window scroll in case of refreshing
function ScrollPercent(selector, percent) {

    var s = $(selector);
    if (s == undefined || s.length == 0)
        return 0;
    var ul = s.find("ul");
    if (ul == undefined || ul.length == 0)
        return 0;
    var element = ul[0];
    var tp = element.scrollTop;
    element.scrollTop = 99999999999999;
    var max = element.scrollTop;
    element.scrollTop = percent == undefined ? tp : max * percent;
    return tp / max;
}
//Interface for refreshing game hierarchy
function gameHierarchy(percent, focus) {
    try {
        lastScrollHierarchy = percent ? percent : ScrollPercent(".dvHierarchyTree");
    } catch (e) {

    }
    if (hierarchyQueue != undefined) {
        clearTimeout(hierarchyQueue);
    }
    hierarchyQueue = setTimeout(function() {
        gameHierarchy1(focus);
    }, 100);
}
//Main fuction that creates gameHierarchy tree
function gameHierarchy1(focus) {
    //Get Current state of tree to set again after creating new tree
    openedNodesHierarchy = new Array();
    getOpenNodes($(".dvHierarchyTree").tree('getTree'));
    var preInp = $("#gamehierarchy").find("input");
    var isFocused = preInp.is(":focus");
    var caret = isFocused ? preInp[0].selectionStart : -1;
    //Search
    var keyword = preInp.val();
    if (keyword)
        keyword = keyword.toLowerCase();
    $("#gamehierarchy").html('');
    //Create new empty Game Object
    var a = addMenu("New Game Object", function() {
        socketemit("addGameObject",
            {
            });
    }, "", "#gamehierarchy", "btnAddHierarchy");
    var where = "#gamehierarchy";
    var treeName = ".dvHierarchyTree";
    var filter = $("<br />").appendTo(where);
    var filter = $("<input type='search' style='width:100%' placeholder='Filter GameObjects' />").appendTo(where);
    if (keyword) {
        filter.val(keyword);
    }
    //When search box change filter tree
    filter.on("input", function(e) {
        gameHierarchy1();
    });
    var dv = $("<div class='dvHierarchyTree' style='margin:0 0 0 0;background-color:#dddddd;height:80%'/>").appendTo("#gamehierarchy");
    var arr = new Array();

    j = 0;
    selectedId = -1;
    focusId = -1;
    //Create Tree JSON + Set selected object id + If new focus needed set id
    for (var i in objects) {
        if (keyword) {
            if (objects[i].name.value.toLowerCase().indexOf(keyword) == -1 && !hasChildrenHasKeyword(objects[i].name.value, keyword))
                continue;
        }
        if (objects[i].position.parent == undefined || objects[i].position.parent == "") {
            arr.push({ name: i, id: j });
            if (selectedSprite == objects[i])
                selectedId = j;
            if (focus && objects[i].name.value == focus)
                focusId = j;
            j++;
        }
    }
    for (var i = 0; i < arr.length; i++) {
        fillChildren(arr[i], focus, keyword);
    }
    //Tree JSON created 
    //Create Tree HTML 
    $(dv).tree({
        data: arr,
        autoOpen: false,
        dragAndDrop: true
    });
    //Game Object hierarchy changed
    $(dv).bind(
        'tree.move',
        function(event) {
            ScrollPercent(".dvHierarchyTree");
            event.move_info.do_move();
            objects[event.move_info.moved_node.name].position.parent = event.move_info.moved_node.parent.name;
            socketemit("gameobject",
                {
                    action: "change",
                    name: event.move_info.moved_node.name, plugin: "position", newval: {
                        parent: event.move_info.moved_node.parent.name
                    }
                });
            setTimeout(function() {
                ScrollPercent(".dvHierarchyTree", lastScrollHierarchy);
            }, 32);
        }
    );
    //Select Game Object
    $(dv).bind(
        'tree.click',
        function(event) {
            if (!lockedSelection) {
                // The clicked node is 'event.node'
                var node = event.node;
                var i = node.name;

                if (objects[i]) {
                    selectedSprite = objects[i];
                    var JSONReadyGO = goBack(objects[i]);
                    socketemit("selectgameobject", JSONReadyGO);
                }
            }
        }
    );
    if (selectedId > -1)
        $(dv).tree('selectNode', $(dv).tree('getNodeById', selectedId));

    //Reopen tree to set view like previous
    openHierarchy();
    //Scroll previous place
    ScrollPercent(".dvHierarchyTree", lastScrollHierarchy);
    //If new object added focus it and change scroll
    focusTreeElement(focusId, ".dvHierarchyTree");
    // If user in process of entering keyword reinsert caret previous place 
    if (isFocused) {
        filter.focus();
        filter[0].selectionStart = caret;
        filter[0].selectionEnd = caret;
    }
}
function focusTreeElement(focusId, tree) {

    if (focusId != -1) {
        var $element = $($(tree).tree('getNodeById', focusId).element);
        var top_1 = $element.offset().top - $(tree).offset().top;
        var maxtop = ($(tree).find("ul").height() - $element.height() * 2);
        var c = $(tree).find("ul")[0].scrollTop;
        if (top_1 < 0 || top_1 > maxtop)
            $(tree).find("ul")[0].scrollTop = c + top_1;
    }
}
function openHierarchy() {
    for (var i in openedNodesHierarchy) {
        var node = $(".dvHierarchyTree").tree(
            'getNodeByCallback',
            function(node) {
                if (node.name == openedNodesHierarchy[i]) {
                    return true;
                }
                else {
                    return false;
                }
            }
        );
        $(".dvHierarchyTree").tree('openNode', node, false);
    }

}
//If parent or children have keyword gameobject will be visible even it doesnt fulfil current criteria
function hasChildrenHasKeyword(name, keyword) {
    var hasit = false;
    for (var i in objects) {
        if (objects[i].position.parent == name) { //child
            if (objects[i].name.value.toLowerCase().indexOf(keyword) != -1)
                return true;
            if (hasChildrenHasKeyword(objects[i].name.value, keyword))
                return true;
        }
    }
    return hasParentHasKeyword(name, keyword);
}
function hasParentHasKeyword(name, keyword) {
    var o = objects[name];
    if (o.position.parent) {
        if (o.position.parent.toLowerCase().indexOf(keyword) != -1) {
            return true;
        }
        return hasParentHasKeyword(o.position.parent, keyword)
    }
    return false;
}
//Game objects children hierarchy filled here as JSON
function fillChildren(data, focus, keyword) {
    for (var i in objects) {
        if (objects[i].position.parent == data.name) {
            if (keyword) {
                if (objects[i].name.value.toLowerCase().indexOf(keyword) == -1 && !hasChildrenHasKeyword(objects[i].name.value, keyword))
                    continue;
            }
            var obj = { name: i, id: j };
            if (selectedSprite == objects[i])
                selectedId = j;

            if (focus && objects[i].name.value == focus)
                focusId = j;
            j++;
            fillChildren(obj, focus, keyword);
            if (data.children == undefined)
                data.children = new Array();
            data.children.push(obj);
        }
    }

}
//Get tree's ccurrent expanded/collapsed state
function getOpenNodes(node) {
    try {
        for (var i in node.children) {
            if (node.children[i].is_open)
                openedNodesHierarchy.push(node.children[i].name);
            if (node.children[i].children)
                getOpenNodes(node.children[i]);
        }
    } catch (e) {

    }

}
