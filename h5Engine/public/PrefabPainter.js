function PrefabPainter() {
    var dvPrefabPainter = $("#PrefabPainter");
    if (dvPrefabPainter.length == 0) {
        var newItemConfig = {
            title: "Prefab Painter",
            type: 'component',
            componentName: 'testComponent',
            componentState: { label: 'PrefabPainter' }
        };

        if (myLayout.root.contentItems.length > 0)
            myLayout.root.contentItems[0].addChild(newItemConfig);
        else
            myLayout.root.addChild(newItemConfig);
        dvPrefabPainter = $("#PrefabPainter");
    }
    var tb = $("<table />").appendTo(dvPrefabPainter);
    var tr = $("<tr style='background-color:grey;color:black' />").appendTo(tb);
    var td1 = $("<td />").appendTo(tr); td1.append("Grid Width X Height");
    var td2 = $("<td style='width:30%' />").appendTo(tr); var gw = $("<input class='prefabPainterGW' style='width:100%' />").appendTo(td2);
    var td3 = $("<td style='width:12px' />").appendTo(tr); td3.append("X");
    var td4 = $("<td style='width:30%' />").appendTo(tr); var gh = $("<input class='prefabPainterGH'  style='width:100%' />").appendTo(td4);
    var tr = $("<tr style='background-color:grey;color:black' />").appendTo(tb);
    var td1 = $("<td />").appendTo(tr); td1.append("Offset X X Y");
    var td2 = $("<td style='width:30%' />").appendTo(tr); var ox = $("<input class='prefabPainterOX'  style='width:100%' />").appendTo(td2);
    var td3 = $("<td style='width:12px' />").appendTo(tr); td3.append("X");
    var td4 = $("<td style='width:30%' />").appendTo(tr); var oy = $("<input class='prefabPainterOY'  style='width:100%' />").appendTo(td4);
    gw.val("32");
    gh.val("32");
    ox.val("0");
    oy.val("0");
    tr = $("<tr />").appendTo(tb);
    td1 = $("<td colspan='4'/>").appendTo(tr);

    var ol = $("<ol class='prefabPainter' />").appendTo(td1);
    for (var i in prefabs) {


        var p = prefabs[i][0];
        var li = $("<li></li>").appendTo(ol);
        li.attr("selectedPrefab", i);
        var header = $("<div style='width:128px;height:20px;overflow: hidden;'>" + i + "</div>").appendTo(li);
        if (p.sprite && p.sprite.path) {
            var dv = $("<div />").appendTo(li);
            var clip = "";
            if (p.sprite.spriteSheet) {
                var img = new Image();
                img.src = "assets/" + p.sprite.path;

                var height = img.height;
                var width = img.width;
                var s = p.sprite;
                var frame = 0;
                try {
                    frame = s.animationData[0].seq[0];
                } catch (e) {

                }
                var columns = Math.floor(width / s.sheetTileWidth);
                var top = Math.floor(frame / columns);
                var left = frame - top * columns;
                img.style.marginLeft = -1 * left * 128 + "px";
                img.style.marginTop = -1 * top * 128 + "px";
                img.style.width = parseInt(img.width * 128 / s.sheetTileWidth) + "px";
                img.style.height = parseInt(img.height * 128 / s.sheetTileHeight) + "px";
                $(img).appendTo(dv);
                //clip = "clip: rect(" + left * s.sheetTileWidth + "px, " + top * s.sheetTileHeight + "px, " + s.sheetTileWidth + "px, " + s.sheetTileHeight + "px);";

                dv.attr("style", "width:128px;height:128px;overflow: hidden;");


            } else {

                li.attr("style", "background-image:url('" + p.sprite.path + "');" +
                    clip);
            }
        }
    }
    ol.selectable({
        selected: function (event, ui) {
           $("ui-selected").removeClass("ui-selected")
           $(ui.selected).addClass("ui-selected");
        }
    });
}
function selectedPrefab() {
    if ($("ol.prefabPainter li.ui-selected").length == 1) {
        return $("ol li.ui-selected").attr("selectedPrefab");
    }

}
function prefabGrid() {
    var retval = { gw: 32, gh: 32, ox: 0, oy: 0 }
    try {
        retval.gw = parseInt($(".prefabPainterGW").val());
    } catch (e) {
    }
    try {
        retval.gh = parseInt($(".prefabPainterGW").val());
    } catch (e) {
    }
    try {
        retval.ox = parseInt($(".prefabPainterOX").val());
    } catch (e) {
    }
    try {
        retval.oy = parseInt($(".prefabPainterOY").val());
    } catch (e) {
    }
    return retval;
}