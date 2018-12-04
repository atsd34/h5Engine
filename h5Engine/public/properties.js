//Game Object properties window (Pane)

var objCount = 0;
var clicks = new Array();
//If properties window redrawn withot changing selected gameobject this stores focus information
var toBeFocused = undefined;

var propertiesQueue = undefined;
//Interface for outside use redraw panel , Main function adding latency for letting server finish other communications- or multiple redrawing.
function reDrawPanel(d1) {
    if (propertiesQueue != undefined) {
        clearTimeout(propertiesQueue);
    }
    propertiesQueue = setTimeout(function () {
        reDrawPanel1(d1);
    }, 100);
}
//Main Redrawing for properties window redrawing with selected game object's properties
//Parameter : Gameobject's new properties
function reDrawPanel1(d1) {

    var focus = $(":focus");
    var focusedName = undefined;
    try {
    //Current focused Property
        var focusedName = focus.attr("class")
    } catch (e) {

    }
    //Gameobject's previous state before change happens 
    var data = objects[d1.name.value];
    for (var i = 0; i < clicks.length; i++) {
        clicks[i].off();
    }
    $("#gameproperties").html('');
    $("#gameproperties").prop('style', "background-color:#dddddd");
    //Properties window is essentially a <table> for each plugin 
    var tbl = $("<table class='tblProperties' style='width:100%' />").appendTo("#gameproperties");
    var tr = $("<tr />").appendTo(tbl);
    var td = $("<td colspan='2' />").appendTo(tr);
    var nameInp = $("<input style='width:100%' />").appendTo(td);
    nameInp.val(data.name.value);
    //Name change textbox requires just a little different
    nameInp.on("change", function () {
        objCount = 0;
        changeName(nameInp);
        objects[$(nameInp).val()] = objects[data.name.value];
        delete objects[data.name];
        //name change request send to server
        socketemit("gameobject",
            {
                action: "change",
                name: data.name.value, plugin: "name", newval: {
                    value: $(nameInp).val()
                }
            });
    });
    var tr = $("<tr />").appendTo(tbl);

    var td1 = $("<td colspan='2' />").appendTo(tr);
    changePropertyValue("", data, "name", "tagName", "<input style='width:100%' />");
    //Selected gameobject saved as prefab with current properties
    addMenu("Save Prefab" +
        (data.position.prefabName != undefined && data.position.prefabName != "" ? "(" + data.position.prefabName + ".prefab)" : "")
        , function () {
            if (data.position.prefabName == undefined || data.position.prefabName == "") {
                data.position.prefabName = data.name.value;
                socketemit("gameobject",
                    {
                        action: "change",
                        name: data.name.value, plugin: "position", newval: {
                            prefabName: data.position.prefabName
                        }
                    });
            }
            var arr = new Array();
            arr.push(goBack(data));
            addChildrenForPrefab(arr, data.name.value);
            socketemit("addPrefab", { name: data.position.prefabName, data: arr });
        }, "", td1, "btnToPrefab");
    //Position component is essential and always needs to be second group and cannot be removed so it is added manually;
    addPluginPanel(data, "position", false, focusedName);
    //Other component groups
    for (var i in data) {
        if (i != "name" && i != "position") {
            //Create group for all plugins except standart functions that doesnt need any group (.addComponent etc)
            if (standartGameObjectProperties.indexOf(i) == -1)
                addPluginPanel(data, i, true, focusedName)
        }
    }
    //"Add Component" Combobox that contains all plugins that selected Game object doesnt have.
    var tr = $("<tr />").appendTo(tbl);
    var td = $("<td colspan='2' />").appendTo(tr);
    var slct = $("<select style='width:100%;height:30px;background-color:#f1ab25' />").appendTo(td);
    slct.append("<option style='background-color:white;color:black'  value='' >Add Component</option>");
    for (var i in gm) {
        if (data[i] == undefined) {
            slct.append("<option style='background-color:white;color:black' value='" + i + "' >" + i + "</option>");
        }
    }
    slct.on("change", function () {
        var plugin = $(this).val();
        if (plugin == "" || gm[plugin] == undefined)
            return;
        var vals = new gm[plugin]();
        var o = { a: vals };
        componentAdded(data.name.value, o, plugin);
        data[plugin] = vals;
        reDrawPanel(data);
    });

    if (focusedName) {
        $("." + focusedName).focus();
    }
}
//If new Component added
// 1st Param : Plugin name (Component name)
// 2nd Param : Components default values  { a: defaultValues }
// 3rd Param : Component (Plugin) Name
function componentAdded(name, o, i) {
    var oo = goBack(o);
    socketemit("gameobject",
        {
            action: "addPlugin",
            name: name, plugin: i, newval: oo.a
        });
}
//Change name of gameobject
function changeName(nameInp) {
    var oldval = $(nameInp).val()
    if (objects[$(nameInp).val()] != undefined) {
        $(nameInp).val(oldval + objCount);
    }
    if (objects[$(nameInp).val()] != undefined) {
        objCount++;
        $(nameInp).val(oldval);
        changeName(nameInp);
    }
}

var lastRow = undefined;
function pluginRemoved(GoName, pName) {
    socketemit("gameobject",
        {
            action: "removePlugin",
            name: GoName, plugin: pName
        });
}
//Function Creates New group for each game object component with current values
// 1st Param : Contains components current values
// 2nd Param : Component name
// 3rd Param : This component can be removed from UI
// 4th Param : Before redrawing happens previous focused Component's property (whether in this component or not it is sent)
function addPluginPanel(data, i, deletable, focusedName) {
    var pan;
    var tr = $("<tr />").appendTo(".tblProperties");
    var td = $("<td colspan='2' style='background-color:#999999' />").appendTo(tr);
    // Little X button that removes component
    if (deletable) {
        var header = $("<div>");
        var tr = $("<tr />").appendTo($("<table style='width:100%'/>").appendTo(header));
        ($("<td style='width:80%' />").appendTo(tr)).append(i);
        var xx = $("<span>X</span>");
        ($("<td style='text-align: right;'/>").appendTo(tr)).append(xx);
        xx.on("click", function () {
            pluginRemoved(data.name.value, i);
        });
        header.appendTo(td);
    }
    else
        td.append(i);
    for (var j in data[i]) {
        // If property name is one of the preceeding keyword it is not shown in editor (This names are static)
        if (j == "worksInEditor" || j == "private" || j == "comboBoxes" || j == "__isDragging" || j == "requires" || j == "__initialized" || j == "priorty")
            continue;
        // If property name is set private by user it is not shown (if you set objects.GameObject0.sprite.private.path=true; Path variable wont be shown in GameObject0's sprite component)
        if (data[i].private && data[i].private[j] == true)
            continue;
        //User can set custom HTML for any property(ies) (For example you can check pixiUtil.js -> gm.sprite -> create() or API )
        if (j == "customDiv") {
            var customDivObject = gm[i].prototype.customDiv;
            if (customDivObject == undefined)
                customDivObject = data[i][j]
            for (var cc in customDivObject) {
                var tr = $("<tr />").appendTo(".tblProperties");
                var td1 = $("<td colspan='2' />").appendTo(tr);
                customDivObject[cc].apply(data[i], [td1]);
            }
        }
        else if (data[i].comboBoxes != undefined && data[i].comboBoxes[j] != undefined) { //If property needs to be shown as combobox 
        //Example  objects.GameObject0.sprite.comboBoxes.path= [{text :"Option 1",value:1},{text:"Option 2",value:"val"}]
            changePropertyValue(focusedName, data, i, j, "<select style='width:100%' />", {
                extraFunction:
                    function (GameObject, Plugin, Label, input, inp, extras) {
                        for (var k = 0; k < GameObject[Plugin].comboBoxes[Label].length; k++) {
                            var it = GameObject[Plugin].comboBoxes[Label][k];
                            if (typeof (it) == "string") {
                                ($("<option>" + GameObject[Plugin].comboBoxes[Label][k] + "</option>").appendTo(inp)).val(GameObject[Plugin].comboBoxes[Label][k]);
                            } else
                        ($("<option>" + GameObject[Plugin].comboBoxes[Label][k].text + "</option>").appendTo(inp)).val(GameObject[Plugin].comboBoxes[Label][k].value);
                        }
                    }
            });
        } else {
            if (typeof (data[i][j]) == "string") { //Default text box
                changePropertyValue(focusedName, data, i, j, "<input style='width:100%' />");
            }
            if (typeof (data[i][j]) == "number") { //Default number box
                changePropertyValue(focusedName, data, i, j, "<input  type='number'style='width:100%' />", {
                    val: function (inp, newVal) {
                        inp.val(newVal);
                    }, getval: function (inp) {
                        return parseFloat($(inp).val());
                    }
                });
            }
            if (typeof (data[i][j]) == "boolean") { //Checkbox
                changePropertyValue(focusedName, data, i, j, "<input type='checkbox' />", {
                    val: function (inp, newVal) {
                        inp.prop("checked", newVal);
                    }, getval: function (inp) {
                        return $(inp).is(':checked');
                    }
                });
            }
        }


    }

}
//Creates default inputs and their respective change function for each property in component
function changePropertyValue(focusedName, GameObject, Plugin, Label, input, extras) {

    var inp = undefined;
    var tr = $("<tr />").appendTo(".tblProperties");
    var td1 = $("<td  />").appendTo(tr);
    var td2 = $("<td  />").appendTo(tr);
    td1.append(Label);
    inp = $(input).appendTo(td2);
    inp.addClass(Plugin + "__" + Label);
    if (!extras)
        extras = {};
    if (extras.extraFunction)
        extras.extraFunction(GameObject, Plugin, Label, input, inp, extras);
    if (!extras.val)
        extras.val = function (inp, newVal) {
            $(inp).val(newVal);
        };
    if (!extras.getval)
        extras.getval = function (inp) {
            return $(inp).val();
        };
    if (!extras.change)
        extras.change = 'change';
    extras.val(inp, GameObject[Plugin][Label]);
    if (Label == focusedName)
        toBeFocused = inp;
    (function (i, j, data, inp, extras) {
        inp.on(extras.change, function () {
            if (objects[data.name.value][i].dontSerialize[j] == true) {
                objects[data.name.value][i][j] = extras.getval(inp);
            } else {
                var sendVal = {};
                sendVal[j] = extras.getval(inp);
                socketemit("gameobject",
                    {
                        action: "change",
                        name: data.name.value, plugin: i, newval: sendVal
                    });
            }
        });
    })(Plugin, Label, GameObject, inp, extras);

}
//During "Save Prefab" process also all of the children adds in prefab hierarchy
function addChildrenForPrefab(arr, name) {
    if (childrenGameObject[name] != undefined) {
        for (var c = 0; c < childrenGameObject[name].length; c++) {
            arr.push(goBack(objects[childrenGameObject[name][c]]));
            addChildrenForPrefab(arr, childrenGameObject[name][c]);
        }
    }

}