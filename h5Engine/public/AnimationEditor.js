//Create Animation editor (With different assets for each frome, Spritesheet animation is on sprite component)
var ul;
function AnimationEditor(full, content) {
    var currentList = [];

    ul = $('<ul id="sortable"> </ul >')
        .appendTo("#dvAnimation");
    $("#sortable").attr("animationName", full);
    try {
        currentList = JSON.parse(content);
        for (var i in currentList) {
            addImageToAnimation(currentList[i], true);
        }
    } catch (e) {

    }
    $("#sortable").sortable({
        stop: function (event, ui) {
            var list = JSON.stringify($("#sortable").sortable("toArray", { attribute: 'imageName' }));
            socketemit("addFile", { name: $("#sortable").attr("animationName"), content: list });
        },
        create: function (event, ui) {
            var list = JSON.stringify($("#sortable").sortable("toArray", { attribute: 'imageName' }));
            socketemit("addFile", { name: $("#sortable").attr("animationName"), content: list });
        }
    });
    $("#sortable").disableSelection();
    //$( "#sortable" ).sortable(  "toArray",{attribute:'imageName'});
}

function addImageToAnimation(name, dontSave) {
    if (name.startsWith("\\"))
        name = name.substr(1);
    if (isImage(name)) {
        var li = $('<li class="ui-state-default" imageName="' + name + '"></li>').appendTo(ul);
        var close = $('<div style="font-size:16px;color:red;position:relative;left:84px;top:-8px;width:16px;height:16px"><img src="img/close.png" /></div>').appendTo(li);
        close.on("click", function () {
            $(this).parent().remove();
            var list = JSON.stringify($("#sortable").sortable("toArray", { attribute: 'imageName' }));
            socketemit("addFile", { name: $("#sortable").attr("animationName"), content: list });
        });
        $('<img style="max-width:100px;max-height:100px;position:relative;left:0px;top:-8px;" src="assets/' + name
            + '" />').appendTo(li);
        $("<span style='font-size:16px;color:black;display:block;'>" + name + "</span>").appendTo(li);
    }
    if (!dontSave) {
        var list = JSON.stringify($("#sortable").sortable("toArray", { attribute: 'imageName' }));
        socketemit("addFile", { name: $("#sortable").attr("animationName"), content: list });
    }
}

function PhysicsEditor(full, content) {
    var mat = JSON.parse(content);
    for (var i in mat) {
        var row = $("<div class='row' />").appendTo($("#dvPhysics"));
        var c1 = $("<div class='col-md-6' style='color:white' />").appendTo(row);
        c1.html(i);
        var c2 = $("<div class='col-md-6' />").appendTo(row);
        (function (i, mat, full) {
            var inp = $("<input value='" + mat[i] + "' />").appendTo(c2);
            inp.on("change", function () {
                mat[i] = parseFloat(inp.val());
                socketemit("addFile", { name: full, content: JSON.stringify(mat) });
            });
        })(i, mat, full);
    }
    //        { friction: 0.3, restitution: 0, stiffness: -1, surfaceVelocity: 0 }
}