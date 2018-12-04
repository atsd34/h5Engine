//Game settings popup
function Settings() {
    var dv = $("#dvSettings");
    if (dv.length == 0) {
        var newItemConfig = {
            title: "Settings",
            type: 'component',
            componentName: 'testComponent',
            componentState: {
                label: 'dvSettings'
            }
        };
        if (myLayout.root.contentItems.length > 0)
            myLayout.root.contentItems[0].addChild(newItemConfig);
        else
            myLayout.root.addChild(newItemConfig);
    }
    dv = $("#dvSettings");
    dv.html('');
    addCheckBoxToSettings(dv, "Game Width (Auto)", "AutoWidth");
    addNumerictextBoxToSettings(dv, "Game Width", "Width");
    addCheckBoxToSettings(dv, "Game Height (Auto)", "AutoHeight");
    addNumerictextBoxToSettings(dv, "Game Height", "Height");
    addtextBoxToSettings(dv, "Game Header", "Header");
    addtextBoxToSettings(dv, "Background Color", "BackgroundColor");
    addComboBoxToSettings(dv, "Physics Engine", "Physics", [{ val: '', text: 'p2.js' },  "None"]).on("change", function () {
        message("Please reload editor for changes");
    });
    activateByTitle("Settings");
}
function addCheckBoxToSettings(dv, Header, SettingsName) {

    var r = $("<div class='row'  />").appendTo(dv);
    var d1 = $("<div class='col-md-6' style='color:white' />").appendTo(r); d1.append("<span >" + Header + "</span>");
    var d2 = $("<div class='col-md-6' />").appendTo(r);
    var chkWidth = $("<input type='checkbox' checked='checked' />").appendTo(d2);
    chkWidth.on("change", function () {
        if ($(this).is(":checked"))
            settings[SettingsName] = true;
        else
            settings[SettingsName] = false;
        socketemit("saveSettings", settings);

    });
    if (settings[SettingsName] = true)
        chkWidth.attr("checked", "checked");
    else {
        settings[SettingsName] = false;
        chkWidth.attr("checked", "false");

    }
    return chkWidth;
}
function addtextBoxToSettings(dv, Header, SettingsName) {
    var r = $("<div class='row'  />").appendTo(dv);
    var d1 = $("<div class='col-md-3' style='color:white' />").appendTo(r); d1.append("<span >" + Header + "</span>");
    var d2 = $("<div class='col-md-3' />").appendTo(r);
    var txtWidth = $("<input />").appendTo(d2);
    txtWidth.on("change", function () {
        settings[SettingsName] = $(this).val();

        socketemit("saveSettings", settings);

    });
    if (settings[SettingsName])
        txtWidth.val(settings[SettingsName]);
    else
        settings[SettingsName] = "";
    return txtWidth;
}
function addNumerictextBoxToSettings(dv, Header, SettingsName) {
    var r = $("<div class='row' />").appendTo(dv);
    var d1 = $("<div class='col-md-3' style='color:white' />").appendTo(r); d1.append("<span >" + Header + "</span>");
    var d2 = $("<div class='col-md-3' />").appendTo(r);
    var txtWidth = $("<input type='number' />").appendTo(d2);
    txtWidth.on("change", function () {
        settings[SettingsName] = parseFloat($(this).val());
        socketemit("saveSettings", settings);
    });
    if (settings[SettingsName])
        txtWidth.val(settings[SettingsName]);
    else
        settings[SettingsName] = 0;
    return txtWidth;
}
function addComboBoxToSettings(dv, Header, SettingsName, values) {
    var r = $("<div class='row' />").appendTo(dv);
    var d1 = $("<div class='col-md-3' style='color:white' />").appendTo(r); d1.append("<span >" + Header + "</span>");
    var d2 = $("<div class='col-md-3' />").appendTo(r);
    var slctOption = $("<select type='number' />").appendTo(d2);
    for (var i = 0; i < values.length; i++) {
        if (typeof (values[i]) == "string")
            slctOption.append("<option>" + values[i] + "</option>");
        else
            slctOption.append("<option value='" + values[i].val + "'>" + values[i].text + "</option>");
    }
    slctOption.on("change", function () {
        settings[SettingsName] = $(this).val();
        socketemit("saveSettings", settings);
    });
    if (settings[SettingsName])
        slctOption.val(settings[SettingsName]);
    else
        settings[SettingsName] = 0;
    return slctOption;
}