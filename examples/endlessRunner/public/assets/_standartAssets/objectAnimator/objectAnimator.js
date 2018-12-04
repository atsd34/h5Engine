//Object Animator Component lets user change any property of any game object or its children with specified timeline
//Can be used for cinematic, flash style animations or anything you can imagine that changes properties over time

gm.objectAnimator = function () {
    this.worksInEditor = true;
    this.serializeObject = {
        timeLine: true
    }
    this.dontSerialize = {
        currentTime: true,
        recordingAnimation: true,
        recording: true
    }
    this.timeLine = {};
    this.private = {
        currentTime: true,
        recordingAnimation: true,
        recording: true,
        playedLoop: true,
        currentFrame: true,
        playing: true,
        extraTime: true
    }

    this.playedLoop = 0;
    this.currentFrame = 0;
    this.playing = undefined;
    this.fun = undefined;
    this.loopCount = -1;
    this.playOnStart = "";
    this.extraTime = 0;
    this.lastPlayed = "";
}
gm.objectAnimator.prototype.create = function () {
    if (this.playOnStart && !INEDITOR)
        this.playXTimes(this.playOnStart, this.loopCount);
}
gm.objectAnimator.prototype.update = function (d) {
    if (this.playing) {
        this.gotoFrame(this.playing, this.currentFrame);
        this.extraTime += d;
        var fps = this.timeLine[this.playing].FPS;
        if (!fps)
            fps = 30;

        var frameIncrease = parseInt(this.extraTime * fps / 1000);
        if (frameIncrease > 0) {
            this.extraTime -= 1000 * frameIncrease / fps;
            this.currentFrame += frameIncrease;
            if (this.currentFrame > (this.timeLine[this.playing]['Number Of Frames'] - 1)) {
                if (this.fun)
                    this.fun();
                if (this.loopCount != -1) {
                    this.playedLoop++;
                    if (this.playedLoop >= this.loopCount) {
                        this.playing = undefined;
                        this.gotoFrame(this.playing, 0);
                        this.fun = undfined;
                    }
                }
                this.currentFrame = 0;
            }
        }
    }
}
//Go to specified animation's indexed framed (Zero indexed)
gm.objectAnimator.prototype.gotoFrame = function (anim, i) {

    var animation = this.timeLine[anim].calculatedAnimation[i];
    for (var goName in animation)
        for (var plugin in animation[goName])
            for (property in animation[goName][plugin])
                objects[goName][plugin][property] = animation[goName][plugin][property];
}
//Play named animation
    // 1st Param : Name of the animation that had given in animator window
    // 2nd Param : How many times will animation be played
    // 3rd Param : When Animation played X times callback function will be executed
gm.objectAnimator.prototype.playXTimes = function (name, number, func) {
    this.lastPlayed = name;
    this.playing = name;

    this.loopCount = number;
    this.fun = func;
    this.currentFrame = 0;

    this.playedLoop = 0;
}
//Play animation in endless loop
gm.objectAnimator.prototype.loop = function (name) {
    this.lastPlayed = name;
    this.playing = name;
    this.loopCount = -1;
}
//Stop current animation
gm.objectAnimator.prototype.stop = function () {
    this.playing = undefined;

}
gm.objectAnimator.prototype.currentTime = 0;
gm.objectAnimator.prototype.recordingAnimation = "";
gm.objectAnimator.prototype.recording = undefined;
gm.objectAnimator.prototype.preTempObject = {};
//This Div creates "record" "Edit" "Delete" buttons for each animation also lets you create new ones 
gm.objectAnimator.prototype.customDiv = {
    newAnimation: function (container) {
        if (this.recording)
            return;
        var $this = this;
        addMenu("Add New Animation", function () {
            if (this.recording)
                return;
            var newAnimation = {
                Name: '',
                'Number Of Frames': 10,
                FPS: 60
            };
            modalForm(newAnimation, {
                "Add": function (i) {
                    i.Animation = [];
                    $this.timeLine[i.Name] = i;
                    saveAnimation($this);
                }
            })
        }, "", container, "");
        $("<br />").appendTo(container);
    },
    selectAnimation: function (container) {
        if (this.recording)
            return;
        var $this = this;
        var tbl = $("<table style='width:100%;margin:10px 10px 10px 10px;' />").appendTo(container);
        for (var i in this.timeLine) {
            var tr = $("<tr />").appendTo(tbl);
            var td = $("<td style='width:16px'/>").appendTo(tr);
            var record = $("<a href='javascript:void(0);' class='btn  btn-xs btn-success' >Start Recording \"" +
                i + "\"</a>").appendTo(td);
            record.attr("nameOfAnimation", i);
            record.on("click", function () {
                $this.recordingAnimation = $(this).attr("nameOfAnimation");
                try {
                    $this.stop();
                    $this.gotoFrame($this.recordingAnimation, 0);
                } catch (e) {

                }
                AnimationFrames($this);
                var objlist = findChildrenRecursive($this.gameObject.name.value);
                for (var i = 0; i < objlist.length; i++) {
                    var go = objlist[i]
                    $this.preTempObject[go.name.value] = goBack(go);

                }
                $this.recording = true;
                injectEmit["gameobject"] = function (data) {
                    if (data.action == "change" && objlist.indexOf(objects[data.name]) != -1) {
                        recordGameObject(objects[data.name], $this, data.newval, data.plugin);
                        AnimationFrames();
                        calculateTimeline($this);
                    }
                }
                reDrawPanel1($this.gameObject);
            });
            td = $("<td style='width:50px' />").appendTo(tr);
            var props = $("<a href='javascript:void(0);' class='btn  btn-xs btn-primary' >Edit \"" +
                i + "\" Properties</a>").appendTo(td);
            props.attr("nameOfAnimation", i);
            props.on("click", function () {
                var tl = $this.timeLine[i];
                modalForm({
                    'Number Of Frames': tl['Number Of Frames'],
                    FPS: tl.FPS
                }, {
                        "Change": function (j) {
                            $this.timeLine[i]['Number Of Frames'] = j['Number Of Frames'];
                            $this.timeLine[i]['FPS'] = j['FPS'];
                        }
                    })
            });
            td = $("<td style='width:16px'/>").appendTo(tr);
            var deleteMe = $('<img src="img/close.png" />')
                .appendTo(td);
            deleteMe.attr("nameOfAnimation", i);
            deleteMe.on("click", function () {
                var nm = $(this).attr("nameOfAnimation");
                delete $this.timeLine[nm];
                saveAnimation($this);
            })
        }
        $("<div class='animationEditor' />").appendTo(container);

    }
}
//Creates new timeline and fills gaps with appropriate values
function calculateTimeline(obj) {

    for (var i in obj.timeLine) {
        var anim = obj.timeLine[i];
        obj.timeLine[i].calculatedAnimation = new Array();
        for (var j = 0; j < anim['Number Of Frames']; j++) {
            obj.timeLine[i].calculatedAnimation[j] = {};
            if (anim.Animation[j] != undefined) {
                for (var goName in anim.Animation[j]) {
                    for (var plugin in anim.Animation[j][goName]) {
                        for (var propertyName in anim.Animation[j][goName][plugin]) {
                            var values = JSON.parse(anim.Animation[j][goName][plugin][propertyName]);
                            if (typeof (values) == "number" && j > 0) {
                                var pre = 0;
                                for (var l = j - 1; l >= 0; l--) {
                                    if (anim.Animation[l] &&
                                        goName in anim.Animation[l] &&
                                        plugin in anim.Animation[l][goName] &&
                                        propertyName in anim.Animation[l][goName][plugin]) {
                                        pre = l;
                                        break;
                                    }
                                }
                                //Frame No : j
                                //Previous Frame : pre
                                var valuesOld = JSON.parse(JSON.stringify(values));
                                if (anim.Animation[pre] &&
                                    goName in anim.Animation[pre] &&
                                    plugin in anim.Animation[pre][goName] &&
                                    anim.Animation[pre][goName][plugin][propertyName]) {
                                    valuesOld = JSON.parse(anim.Animation[pre][goName][plugin][propertyName]);
                                }
                                for (var l = j; l >= pre; l--) {
                                    if (obj.timeLine[i].calculatedAnimation[l] == undefined)
                                        obj.timeLine[i].calculatedAnimation[l] = {};
                                    var newAnim = obj.timeLine[i].calculatedAnimation[l];
                                    if (newAnim[goName] == undefined)
                                        newAnim[goName] = {}
                                    if (newAnim[goName][plugin] == undefined)
                                        newAnim[goName][plugin] = {}
                                    newAnim[goName][plugin][propertyName] =
                                        ((l - pre) / (j - pre)) * (values - valuesOld) + valuesOld;
                                }

                            }
                            //After this frame
                            for (var l = j; l <= anim['Number Of Frames']; l++) {
                                if (obj.timeLine[i].calculatedAnimation[l] == undefined)
                                    obj.timeLine[i].calculatedAnimation[l] = {};
                                var newAnim = obj.timeLine[i].calculatedAnimation[l];
                                if (newAnim[goName] == undefined)
                                    newAnim[goName] = {}
                                if (newAnim[goName][plugin] == undefined)
                                    newAnim[goName][plugin] = {}
                                newAnim[goName][plugin][propertyName] = values;
                            }
                        }
                    }
                }
            }
        }
    }
}
//Save Current animation in server
function saveAnimation(obj) {
    calculateTimeline(obj);
    var JSONReadyGO = goBack(obj.gameObject);
    socketemit("gameobject", {
        action: "change",
        name: JSONReadyGO.name.value,
        plugin: "objectAnimator",
        newval: JSONReadyGO.objectAnimator
    });
    reDrawPanel1(obj.gameObject);
}
//Animation frames slider
var createAnimationDiv = function (selectedAnimation, $this) {
    $('.animationEditor').html('');
    $("<div class='animationTime' style='margin-left:10px;margin-right:10px;' />").appendTo('.animationEditor');
    $('.animationTime').slider({
        create: function () {
            $('.ui-slider-handle').text($(this).slider("value"));
        },
        slide: function (event, ui) {
            $('.ui-slider-handle').text(ui.value);
            $this.currentTime = ui.value;
            $this.gotoFrame($this.recordingAnimation, ui.value);
            reDrawPanel1(selectedSprite);
        },
        value: $this.currentTime,
        min: 1,
        max: $this.timeLine[selectedAnimation]['Number Of Frames'],
    });
}
//Add new keyframe with current values
var addkeyframe = function ($this, animationName, i, go, plugin, property, value) {
    var keyframe = $this.timeLine[animationName]
        .Animation[i];
    if (keyframe == undefined) {
        $this.timeLine[animationName]
            .Animation[i] = {};
        keyframe = $this.timeLine[animationName]
            .Animation[i];
    }
    if (keyframe[go] == undefined) {
        keyframe[go] = {};
    }
    if (keyframe[go][plugin] == undefined) {
        keyframe[go][plugin] = {};
    }
    keyframe[go][plugin][property] = JSON.stringify(
        value
    );
}
//Checks and records gameObject for changes in properties
var recordGameObject = function (go, $this, current, plugin) {
    var selected = $this.recordingAnimation;
    for (var j in current) {
        if (JSON.stringify(current[j]) !=
            JSON.stringify(go[plugin][j])) {
            addkeyframe($this, selected, $this.currentTime, go.name.value, plugin, j, current[j]);

        }

    }

    $this.preTempObject[go.name.value] = goBack(go);

}
//creates gameobject array that contains named gameobject and its children
//Use this always with 1 parameter
function findChildrenRecursive(name, retval) {
    if (!retval)
        retval = new Array();
    retval.push(objects[name]);
    if (childrenGameObject[name]) {
        for (var i = 0; i < childrenGameObject[name].length; i++) {
            findChildrenRecursive(childrenGameObject[name][i], retval);
        }
    }
    return retval;
}
var currentThis = undefined;
//Timeline Window
var AnimationFrames = function ($this) {
    selectedTd = [];
    deleteDisabled = true;
    $('.recorderContainer').remove();
    if ($this == undefined)
        $this = currentThis;
    currentThis = $this;
    var containerRecord =
        $("<div class='recorderContainer' style='width:100%;height:70px;background-color:white;position:absolute;bottom:0px;left:0px' />").appendTo(".gameCanvas");
    var separator = $("<div style='width:100%;background-color:#111111;height:5px;cursor:ns-resize' />").appendTo(containerRecord);
    if (localStorage["animationEditorHeight"])
        $(".recorderContainer").height(localStorage["animationEditorHeight"]);
    separator.on("mousedown", function (e) {
        separator.py = e.clientY;
        var mv = function (e) {
            e.preventDefault();
            $(".recorderContainer").height($(".recorderContainer").height() - e.clientY + separator.py);
            separator.py = e.clientY;
        }
        var up = function (e) {
            e.preventDefault();
            $(".recorderContainer").height($(".recorderContainer").height() - e.clientY + separator.py);
            separator.py = e.clientY;
            $("*").off("mousemove", mv);
            $("*").off("mouseup", up);
            localStorage["animationEditorHeight"] = $(".recorderContainer").height();
        }
        $("*").mousemove(mv);
        $("*").mouseup(up);

    });

    $("<span>Recording " + $this.recordingAnimation + " animation</span>").appendTo(containerRecord);
    addMenu("Stop Recording", function () {
        deleteDisabled = false;
        delete injectEmit["gameobject"];
        $this.recording = undefined;
        $(".recorderContainer").remove();
        saveAnimation($this);
        if (selectedSprite == $this.gameObject)
            reDrawPanel1($this.gameObject);
    }, "", containerRecord, "btnRecordAnim");
    $("<br />").appendTo(containerRecord);

    var tbl = $("<table style='width:100%' />").appendTo(containerRecord);
    var tr = $("<tr />").appendTo(tbl);
    var td1 = $("<td />").appendTo(tr);
    $("<span>Frames</span>").appendTo(td1);
    var td2 = $("<td style='width:70%' />").appendTo(tr);
    $("<div class='animationTime' />").appendTo(td2);
    $('.animationTime').slider({
        create: function () {
            $('.ui-slider-handle').text($(this).slider("value"));
        },
        slide: function (event, ui) {
            $('.ui-slider-handle').text(ui.value);
            $this.currentTime = ui.value;
            $this.gotoFrame($this.recordingAnimation, ui.value);
            reDrawPanel1(selectedSprite);
        },
        min: 0,
        value: $this.currentTime,
        max: $this.timeLine[$this.recordingAnimation]['Number Of Frames'] - 1,
    });
    var names = [];
    for (var i in $this.timeLine[$this.recordingAnimation].Animation) {

        for (var go in $this.timeLine[$this.recordingAnimation].Animation[i]) {
            for (var plugin in $this.timeLine[$this.recordingAnimation].Animation[i][go]) {
                for (var prop in $this.timeLine[$this.recordingAnimation].Animation[i][go][plugin]) {
                    var nm = go + "." + plugin + "." + prop;
                    if (names.indexOf(nm) == -1)
                        names.push(nm);
                }
            }
        }
    }
    for (var nm in names) {
        var tr = $("<tr />").appendTo(tbl);
        var td1 = $("<td />").appendTo(tr);
        $("<span>" + names[nm] + "&nbsp;</span>").appendTo(td1);
        var td2 = $("<td style='width:70%' />").appendTo(tr);
        var tbl2 = $("<table />").appendTo(td2);
        var tr2 = $("<tr />").appendTo(tbl2);
        var splitted = names[nm].split('.');
        for (var i = 0; i < $this.timeLine[$this.recordingAnimation]['Number Of Frames']; i++) {
            var td = $("<td style='width:10px;border:1px solid black;height:15px'/>").appendTo(tr2);

            if ($this.timeLine[$this.recordingAnimation].Animation[i]
                && splitted[0] in $this.timeLine[$this.recordingAnimation].Animation[i]
                && splitted[1] in $this.timeLine[$this.recordingAnimation].Animation[i][splitted[0]]
                && splitted[2] in $this.timeLine[$this.recordingAnimation].Animation[i][splitted[0]][splitted[1]]) {
                td.css("background-color", "grey");

            }
            td.attr("animIndex", i);
            td.attr("animProp", names[nm]);
            (function (i, splitted) {
                var menu = [{
                    name: 'Create Empty On Selected',
                    title: 'create button',
                    fun: function () {
                        for (var td = 0; td < selectedTd.length; td++) {
                            var ttd = $(selectedTd[td]);
                            var ind = parseInt(ttd.attr("animIndex"));
                            var splittedInd = ttd.attr("animProp").split('.');
                            addkeyframe($this, $this.recordingAnimation, ind, splittedInd[0], splittedInd[1], splittedInd[2], objects[splittedInd[0]][splittedInd[1]][splittedInd[2]]);
                           
                        }
                        selectedTd = [];
                        calculateTimeline($this);
                        AnimationFrames();
                    }
                }, {
                    name: 'Delete Selected',
                    title: 'delete button',
                    fun: function () {
                        for (var td = 0; td < selectedTd.length; td++) {
                            var ttd = $(selectedTd[td]);
                            var ind = parseInt(ttd.attr("animIndex"));
                            var splittedInd = ttd.attr("animProp").split('.');

                            delete $this.timeLine[$this.recordingAnimation].Animation[ind][splittedInd[0]][splittedInd[1]][splittedInd[2]];
                        }
                        selectedTd = [];
                        calculateTimeline($this);
                        AnimationFrames();
                    }
                    },
                {
                    name: 'Move Selected',
                    title: 'Move button',
                    fun: function () {
                        var move = parseInt(prompt("How many frames to move (if you enter negative it will move backwards)", "0"));
                        if (move != 0 && !isNaN( move)) {
                          
                            for (var td = 0; td < selectedTd.length; td++) {
                                var ttd = $(selectedTd[td]);
                                var ind = parseInt(ttd.attr("animIndex"));

                                var splittedInd = ttd.attr("animProp").split('.');
                                addkeyframe($this, $this.recordingAnimation, ind + move, splittedInd[0], splittedInd[1], splittedInd[2],
                                    JSON.parse($this.timeLine[$this.recordingAnimation].Animation[ind][splittedInd[0]][splittedInd[1]][splittedInd[2]]));
                                delete $this.timeLine[$this.recordingAnimation].Animation[ind][splittedInd[0]][splittedInd[1]][splittedInd[2]];
                            }
                            selectedTd = [];
                            calculateTimeline($this);
                            AnimationFrames();
                        }
                    }
                }

                ];
                $(td).contextMenu(menu, { triggerOn: 'contextmenu' });
            })(i, splitted);
            $(td).on("click", function (e) {
                if (selectedTd.indexOf(this) == -1) {
                    selectedTd.push(this);
                    $(this).css("border", "2px solid blue");
                } else {
                    selectedTd.splice(selectedTd.indexOf(this), 1);
                    $(this).css("border", "1px solid black");

                }

            });
        }
    }
    $(".animationTime").css("width", 10 * ($this.timeLine[$this.recordingAnimation]['Number Of Frames'] - 1) + "px");
    $(".animationTime").css("margin-left", "8px");
    $(".btnRecordAnim").addClass("btn-danger");

}
var selectedTd = [];