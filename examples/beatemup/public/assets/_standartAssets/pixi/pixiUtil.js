//Sprite component
//Responsiple for ingame / in editor visual behaviour of game objects
//For more information check API
gm.sprite = function () {
    //Where animation state stored
    this.currentAnim = {
        frame: 0, loop: true, func: function () {
        }
    };
    //Image or animation file path
    this.path = "";
    this.AnimationSpeed = 0.5;
    $this = this;
    Object.defineProperty(this, "FPS", {
        enumerable: true,
        configurable: true,
        get: function () {
            return 1 / $this.AnimationSpeed;
        },
        set: function (v) {
            $this.AnimationSpeed = 1 / v;
            CommitValue($this.gameObject, "sprite", "AnimationSpeed");
        }
    });
    this.isTileMap = false;
    this.spriteSheet = false;
    this.randomTiled = false;
    this.sheetTileWidth = 32;
    this.sheetTileHeight = 32;
    this.sheetTileSpacing = 0;
    this.tileWidth = 32;
    this.tileHeight = 32;
    this.animations = [];
    this.animationData = [];
    this.texture = {};
    this.currentTile = {};
    this.tempPallete = undefined;
    this.private = { AnimationSpeed: true, sheetTileSpacing: true, tileWidth: true, tileHeight: true, reloadME: true, sheetTileWidth: true, sheetTileHeight: true };
    this.reloadInEditor = { randomTiled: true, path: true, isTileMap: true, tileWidth: true, tileHeight: true, reloadME: true, spriteSheet: true, sheetTileWidth: true, sheetTileHeight: true }
    this.tiles = [];
    this.tilesNum = [];
    this.randomTypes = [];
    this.dontSerialize = { FPS: true, Editing: true, reloadME: true }
    this.serializeObject = { tilesNum: true, animationData: true, randomTypes: true }
    this.reloadME = 0;
  

    newObservable(this, "AnimationSpeed", undefined, function (val, object) {
        try {
            object.sprite.animationSpeed = parseFloat(object.AnimationSpeed);
        } catch (e) {

        }
    });
    //EDITOR and game behaviour is different but needs to work in editor.
    this.worksInEditor = true;
    //Creates combobox with available paths for sprites
    this.comboBoxes = {};
    this.SetComboboxes = function () {
        if ("assetList" in window) {
            this.comboBoxes.path = new Array();
            for (var i = 0; i < assetList.length; i++) {
                if (assetList[i].isFolder == false && (isImage(assetList[i].name) || assetList[i].name.endsWith(".anim")))
                    this.comboBoxes.path.push({
                        text: assetList[i].name, value: assetList[i].name
                    })
            }
        }
    }
    this.SetComboboxes();
    this.selectGameObjectEditor = function () {
        this.SetComboboxes();
    }
    //Spritesheet animation can be played with this function (infinite loop)
    // 1st Param : animation index (starts with 0) or name to play
    this.loopAnim = function (nameOrNumber) {
        var num = nameOrNumber;
        if (typeof (num) == "string") {
            for (var i = 0; i < this.animationData.length; i++) {
                if (this.animationData[i].name == num)
                    num = i;
            }
        } else {
            nameOrNumber = this.animationData[num].name;
        }
        this.currentAnim = {
            name: nameOrNumber,
            frame: num, loop: true, func: function () {
            }
        };
        this.reloadME++;
    }

    //Spritesheet animation can be played with this function
    // 1st Param : animation index (starts with 0) or name to play
    // 2nd Param : After animation completed this function triggered (can be undefined)
    this.playOnceAnim = function (nameOrNumber, func) {
        var num = nameOrNumber;
        if (typeof (num) == "string") {
            for (var i = 0; i < this.animationData.length; i++) {
                if (this.animationData[i].name == num)
                    num = i;
            }

        } else {
            nameOrNumber = this.animationData[num].name;
        }
        if (num != this.currentAnim.frame) {
            this.currentAnim = {
                name: nameOrNumber,
                frame: num, loop: false, func: (func != undefined ? func : function () {
                })
            };
            this.reloadME++;
        } else {
            this.currentAnim = {
                name: nameOrNumber,
                frame: num, loop: false, func: (func != undefined ? func : function () {
                })
            };
            this.sprite.loop = this.currentAnim.loop;
            this.sprite.onComplete = this.currentAnim.func;
            this.sprite.gotoAndPlay(0);
        }
    }
    //Initialization
    this.create = function () {
        try {

            this.private.sheetTileSpacing = true;
            //Programatically generated tile map acts same in editor and game
            if (this.randomTiled) {
                debugger;
                if (this.spriteSheet)
                    this.spriteSheet = false;
                this.private.sheetTileWidth = false;
                this.private.sheetTileHeight = false;
                this.private.sheetTileSpacing = false;
                if (this.randomTypes.length > 0) {
                    var tex = resources[this.path].texture;
                    var renderTexture = PIXI.RenderTexture.create(this.gameObject.position.width, this.gameObject.position.height);
                    var wd = tex.width;
                    var ht = tex.height;
                    var xt = parseInt(wd / this.sheetTileWidth);
                    var yt = parseInt(ht / this.sheetTileHeight);
                    var xc = Math.ceil(this.gameObject.position.width / this.sheetTileWidth);
                    var yc = Math.ceil(this.gameObject.position.height / this.sheetTileHeight);
                    for (var i = 0; i < xc; i++) {
                        for (var j = 0; j < yc; j++) {
                            var canditates = new Array();
                            var candidateItems = new Array();
                            // $this.randomTypes.push({ num: 0, minX: -1, maxX: -1, minY: -1, maxY: -1 });
                            for (var k = 0; k < this.randomTypes.length; k++) {
                                var r = this.randomTypes[k];
                                if ((r.minX == -1 || i <= r.minX) &&
                                    (r.maxX == -1 || i >= r.maxX) &&
                                    (r.minY == -1 || j <= r.minY) &&
                                    (r.maxY == -1 || j >= r.maxY)) {
                                    var nums = r.num.toString().split(',');
                                    for (var l = 0; l < nums.length; l++) {
                                        canditates.push(parseInt(nums[l]));

                                    }
                                    candidateItems.push(r);
                                }
                            }
                            var rand = Math.floor(Math.random() * canditates.length);
                            var cin = 0;
                            var rc = rand;
                            for (var l = 0; l < candidateItems.length; l++) {
                                rc -= candidateItems[l].num.toString().split(',').length;
                                if (rc > 0)
                                    cin++;
                                else
                                    break;
                            }
                            var itm = candidateItems[cin];
                            var seq = canditates[rand];
                            var shift = 0;
                            try {


                                if (itm.shiftData) {

                                    var shft = JSON.parse(itm.shiftData);

                                    for (var nam in shft) {
                                        var nm = nam.replace('a', '').split('_');
                                        if ((!nm[0] || i >= parseInt(nm[0])) && (!nm[1] || i <= parseInt(nm[1]))) {
                                            if (shft[nam].h != undefined)
                                                shift = parseInt(shft[nam].h);
                                            if (!shft[nam].lim || parseInt(shft[nam].lim) >= j) {

                                                if ((nm[0] && i == parseInt(nm[0]) && shft[nam].l)
                                                    || (i == 0 && shft[nam].l))
                                                    seq = shft[nam].l;
                                                if ((nm[1] && i == parseInt(nm[1]) && shft[nam].r)
                                                    || (i == (xc - 1) && shft[nam].r))
                                                    seq = shft[nam].r;
                                            }
                                        }
                                    }
                                }
                            } catch (e) {

                            }
                            var yy = parseInt(seq / xt);
                            var xx = seq - yy * xt;
                            var nt = new PIXI.Texture(tex, new PIXI.Rectangle(xx * this.sheetTileWidth, yy * this.sheetTileHeight, this.sheetTileWidth, this.sheetTileHeight));
                            var tile = new PIXI.Sprite(nt);
                            var a = new PIXI.Transform();
                            tile.x = i * (this.sheetTileWidth - this.sheetTileSpacing) - this.sheetTileSpacing;
                            tile.y = j * (this.sheetTileHeight - this.sheetTileSpacing) - this.sheetTileSpacing - shift;

                            game.renderer.render(tile, renderTexture, false);
                        }
                    }
                    this.sprite = new PIXI.Sprite(renderTexture);

                }
                //h5Engine Editor some sprite properties are shown in custom div
                if (INEDITOR) {

                    this.customDiv = {
                        types:
                            function (container) {
                                var $this = this;
                                var tbl = $("<table style='width:100%' />").appendTo(container);

                                for (var i = 0; i < this.randomTypes.length; i++) {
                                    var t = this.randomTypes[i];
                                    var tr = $("<tr />").appendTo(tbl);
                                    var td1 = $("<td style='width:40%' />").appendTo(tr);
                                    var td2 = $("<td colspan='2' />").appendTo(tr);
                                    var td3 = $("<td style='width:16px' />").appendTo(tr);
                                    td1.append("<b>" + i + " Sprite Number:</b>");
                                    var inp = $("<input style='width:100%' />").appendTo(td2);
                                    inp.val(t.num);
                                    inp.attr("whichAnim", i);
                                    inp.on("change", function () {
                                        var num = parseInt($(this).attr("whichAnim"));
                                        $this.randomTypes[num].num = $(this).val();
                                        socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "sprite", newval: { randomTypes: $this.randomTypes } });
                                        $this.reloadME++;
                                    });
                                    var close = $('<img src="img/close.png" />').appendTo(td3);
                                    close.attr("whichAnim", i);
                                    close.on("click", function () {
                                        var num = parseInt($(this).attr("whichAnim"));
                                        $this.randomTypes.splice(num, 1);
                                        socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "sprite", newval: { randomTypes: $this.randomTypes } });
                                        $this.reloadME++;
                                    });
                                    var tr = $("<tr />").appendTo(tbl);
                                    var td1 = $("<td />").appendTo(tr);
                                    var td2 = $("<td style='width:30%' />").appendTo(tr);
                                    var td3 = $("<td colspan='2' />").appendTo(tr);
                                    td1.append(i + " X Range:");
                                    inp = $("<input  style='width:100%'/>").appendTo(td3);
                                    inp.val(this.randomTypes[i].minX);
                                    inp.attr("whichAnim", i);
                                    inp.on("change", function () {
                                        var num = parseInt($(this).attr("whichAnim"));
                                        $this.randomTypes[num].minX = parseInt($(this).val());
                                        socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "sprite", newval: { randomTypes: $this.randomTypes } });
                                        $this.reloadME++;
                                    });

                                    inp = $("<input  style='width:100%'/>").appendTo(td2);
                                    inp.val(this.randomTypes[i].maxX);
                                    inp.attr("whichAnim", i);
                                    inp.on("change", function () {
                                        var num = parseInt($(this).attr("whichAnim"));
                                        $this.randomTypes[num].maxX = parseInt($(this).val());
                                        socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "sprite", newval: { randomTypes: $this.randomTypes } });
                                        $this.reloadME++;
                                    });


                                    var tr = $("<tr />").appendTo(tbl);
                                    var td1 = $("<td />").appendTo(tr);
                                    var td2 = $("<td style='width:30%' />").appendTo(tr);
                                    var td3 = $("<td colspan='2' />").appendTo(tr);
                                    td1.append(i + " Y Range:");
                                    inp = $("<input  style='width:100%'/>").appendTo(td3);
                                    inp.val(this.randomTypes[i].minY);
                                    inp.attr("whichAnim", i);
                                    inp.on("change", function () {
                                        var num = parseInt($(this).attr("whichAnim"));
                                        $this.randomTypes[num].minY = parseInt($(this).val());
                                        socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "sprite", newval: { randomTypes: $this.randomTypes } });
                                        $this.reloadME++;
                                    });

                                    inp = $("<input  style='width:100%'/>").appendTo(td2);
                                    inp.val(this.randomTypes[i].maxY);
                                    inp.attr("whichAnim", i);
                                    inp.on("change", function () {
                                        var num = parseInt($(this).attr("whichAnim"));
                                        $this.randomTypes[num].maxY = parseInt($(this).val());
                                        socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "sprite", newval: { randomTypes: $this.randomTypes } });
                                        $this.reloadME++;
                                    });

                                    var tr = $("<tr />").appendTo(tbl);
                                    var td1 = $("<td />").appendTo(tr);
                                    var td2 = $("<td colspan='3' />").appendTo(tr);
                                    td1.append(i + " Shift Data");
                                    inp = $("<input  style='width:100%'/>").appendTo(td2);
                                    inp.val(this.randomTypes[i].shiftData);
                                    inp.attr("whichAnim", i);
                                    inp.on("change", function () {
                                        var num = parseInt($(this).attr("whichAnim"));
                                        $this.randomTypes[num].shiftData = $(this).val();
                                        socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "sprite", newval: { randomTypes: $this.randomTypes } });
                                        $this.reloadME++;
                                    });

                                }
                                var btn = addMenu("Add New Random Tile", function () {
                                    $this.randomTypes.push({ num: 0, minX: -1, maxX: -1, minY: -1, maxY: -1, shiftData: '' });
                                    socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "sprite", newval: { randomTypes: $this.randomTypes } });
                                    $this.reloadME++;
                                }, "", container, "btnAddAnimation");
                            }
                    }
                }
            }
            else if (this.spriteSheet) { //spriteSheet animation
                this.private.sheetTileWidth = false;
                this.private.sheetTileHeight = false;
                this.animations = [];
                var tex = resources[this.path].texture;
                var wd = tex.width;
                var ht = tex.height;
                var xt = parseInt(wd / this.sheetTileWidth);
                var yt = parseInt(ht / this.sheetTileHeight);
                if (this.animationData.length == 0) {
                    this.animationData = [{ seq: [0], FPS: 6, name: "default" }];
                }
                for (var i = 0; i < this.animationData.length; i++) {
                    var an = this.animationData[i];
                    this.animations[i] = [];
                    for (var j = 0; j < an.seq.length; j++) {
                        var yy = parseInt(an.seq[j] / xt);
                        var xx = an.seq[j] - yy * xt;
                        this.animations[i].push(new PIXI.Texture(tex, new PIXI.Rectangle(xx * this.sheetTileWidth, yy * this.sheetTileHeight, this.sheetTileWidth, this.sheetTileHeight)));
                    }
                }
                this.sprite = new PIXI.extras.AnimatedSprite(this.animations[this.currentAnim.frame]);

                this.sprite.loop = this.currentAnim.loop;
                this.sprite.onComplete = this.currentAnim.func;
                if (changing && INEDITOR) {
                    this.gameObject.position.width = this.sprite.width;
                    this.gameObject.position.height = this.sprite.height;
                    socketemit("gameobject", { action: "change", name: this.gameObject.name.value, plugin: "position", newval: { width: this.gameObject.position.width, height: this.gameObject.position.height } });

                }
                this.currentAnim.name = this.animationData[this.currentAnim.frame].name;
                this.sprite.animationSpeed = this.animationData[this.currentAnim.frame].FPS / 60;
                if (!INEDITOR)
                    this.sprite.play();
                else {

                    //h5Engine Editor some sprite properties are shown in custom div
                    this.customDiv = {
                        animationSequences:
                            function (container) {
                                var $this = this;
                                var tbl = $("<table style='width:100%' />").appendTo(container);
                                for (var i = 0; i < this.animationData.length; i++) {
                                    var tr = $("<tr />").appendTo(tbl);
                                    var td1 = $("<td style='width:40%' />").appendTo(tr);
                                    var td2 = $("<td  />").appendTo(tr);
                                    var td3 = $("<td style='width:16px' />").appendTo(tr);
                                    td1.append("<b>" + i + " animation Name:</b>");
                                    var inp = $("<input style='width:100%' />").appendTo(td2);
                                    inp.val(this.animationData[i].name);
                                    inp.attr("whichAnim", i);
                                    inp.on("change", function () {
                                        var num = parseInt($(this).attr("whichAnim"));
                                        $this.animationData[num].name = $(this).val();
                                        socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "sprite", newval: { animationData: $this.animationData } });
                                        $this.reloadME++;
                                    });
                                    var close = $('<img src="img/close.png" />').appendTo(td3);
                                    close.attr("whichAnim", i);
                                    close.on("click", function () {
                                        var num = parseInt($(this).attr("whichAnim"));
                                        $this.animationData.splice(num, 1);
                                        socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "sprite", newval: { animationData: $this.animationData } });
                                        $this.reloadME++;
                                    });
                                    var tr = $("<tr />").appendTo(tbl);
                                    var td1 = $("<td />").appendTo(tr);
                                    var td2 = $("<td colspan='2' />").appendTo(tr);
                                    td1.append(i + " animation FPS:");
                                    inp = $("<input  style='width:100%'/>").appendTo(td2);
                                    inp.val(this.animationData[i].FPS);
                                    inp.attr("whichAnim", i);
                                    inp.on("change", function () {
                                        var num = parseInt($(this).attr("whichAnim"));
                                        $this.animationData[num].FPS = parseInt($(this).val());
                                        socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "sprite", newval: { animationData: $this.animationData } });
                                        $this.reloadME++;
                                    });
                                    var tr = $("<tr />").appendTo(tbl);
                                    var td1 = $("<td/>").appendTo(tr);
                                    var td2 = $("<td colspan='2' />").appendTo(tr);
                                    td1.append(i + " animation sequence:");
                                    inp = $("<input style='width:100%' />").appendTo(td2);
                                    var str = JSON.stringify(this.animationData[i].seq);
                                    inp.val(str.substr(1, str.length - 2));
                                    inp.attr("whichAnim", i);
                                    inp.on("change", function () {
                                        var num = parseInt($(this).attr("whichAnim"));
                                        $this.animationData[num].seq = JSON.parse("[" + $(this).val() + "]");
                                        socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "sprite", newval: { animationData: $this.animationData } });
                                        $this.reloadME++;
                                    });
                                }
                                var btn = addMenu("Add New Animation", function () {
                                    $this.animationData.push({ seq: [0], FPS: 6, name: "" });
                                    socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "sprite", newval: { animationData: $this.animationData } });
                                    $this.reloadME++;
                                }, "", container, "btnAddAnimation");
                            }
                    }

                }
            }
            else {
                this.private.sheetTileWidth = true;
                this.private.sheetTileHeight = true;

                //Tile map
                if (this.isTileMap) {
                    this.gameObject.position.centerx = 0;
                    this.gameObject.position.centery = 0;
                    this.customDiv = {
                        tiler:
                            TilerDiv
                    }
                    this.private = { AnimationSpeed: true, sheetTileSpacing: true, AnimationSpeed: true, Editing: true, reloadME: true, sheetTileWidth: true, sheetTileHeight: true };
                    this.texture = resources[this.path].texture;
                    var w = Math.ceil(this.texture.width / this.tileWidth);
                    var h = Math.ceil(this.texture.height / this.tileHeight);
                    for (var i = 0; i < w; i++) {
                        this.tiles[i] = [];
                        for (var j = 0; j < h; j++) {
                            var ww = this.tileWidth;
                            var xx = i * this.tileWidth;
                            if (xx + ww > this.texture.width)
                                ww = this.texture.width - xx;
                            var hh = this.tileHeight;
                            var yy = j * this.tileHeight;
                            if (yy + hh > this.texture.height)
                                hh = this.texture.height - yy;

                            this.tiles[i][j] = new PIXI.Texture(this.texture, new PIXI.Rectangle(xx, yy, ww, hh))

                        }
                    }

                    this.sprite = new PIXI.Container();

                    for (var i = 0; i < this.tilesNum.length; i++) {
                        for (var j = 0; j < this.tilesNum[i].length; j++) {
                            var it = this.tilesNum[i][j];
                            if (it != undefined && it.x != undefined) {
                                var tl = this.tiles[it.x][it.y];
                                var tile = new PIXI.Sprite(tl);
                                tile.x = i * (this.tileWidth);
                                tile.y = j * (this.tileHeight);
                                this.sprite.addChild(tile);
                            }
                        }
                    }
                }
                else {
                    //standart sprite without animation (OR animation file with animation)
                    this.customDiv = {
                    }
                    this.private = { AnimationSpeed: true,sheetTileSpacing: true, tileWidth: true, tileHeight: true, Editing: true, reloadME: true, sheetTileWidth: true, sheetTileHeight: true };

                    if (this.path.endsWith("anim")) {
                        var arr = new Array();
                        var lst = JSON.parse(resources[this.path].data);
                        for (var i in lst) {
                            arr.push(resources[lst[i]].texture);
                        }
                        this.sprite = new PIXI.extras.AnimatedSprite(arr);
                        this.sprite.animationSpeed = parseFloat(this.AnimationSpeed);
                        if (!INEDITOR)
                            this.sprite.play();

                    } else {
                        this.sprite = new PIXI.Sprite(resources[this.path].texture);
                    }
                    if (changing && INEDITOR) {
                        this.gameObject.position.width = this.sprite.width;
                        this.gameObject.position.height = this.sprite.height;
                        socketemit("gameobject", { action: "change", name: this.gameObject.name.value, plugin: "position", newval: { width: this.gameObject.position.width, height: this.gameObject.position.height } });

                    }
                }
            }
        } catch (e) {
            this.sprite = { anchor: {} };
        }
        //When this is selected gameObject
        if (INEDITOR) {
            if (selectedSprite == this.gameObject) {

                reDrawPanel1(this.gameObject);
            }
        }
        try {
            //PIXI container is in position for better parent-child management
            this.gameObject.position.container.addChild(this.sprite);
        } catch (e) {

        }
        //Sprite dependant "position component" initialization
        this.gameObject.position.init();
    }
    //Game loop
    this.update = function () {
        //Editor tile map painting
        if (INEDITOR && this.isTileMap == true) {
            if (this.tempPallete != undefined) {
                try {
                    while (this.tempPallete.children.length > 0) {
                        this.tempPallete.removeChild(this.tempPallete.children[0]);
                    }
                } catch (e) {

                }
                guiContainer.removeChild(this.tempPallete);
                this.tempPallete = undefined;
            }
            if (selectedSprite == this.gameObject && this.Editing == true) {
                this.tempPallete = new PIXI.Container();
                var w = Math.ceil(this.texture.width / this.tileWidth);
                var h = Math.ceil(this.texture.height / this.tileHeight);
                for (var i = 0; i < w; i++) {
                    for (var j = 0; j < h; j++) {
                        var tl = this.tiles[i][j];
                        var tile = new PIXI.Sprite(tl);
                        tile.x = i * (this.tileWidth + 1) - camera.x;
                        tile.y = j * (this.tileHeight + 1) - camera.y;
                        this.tempPallete.addChild(tile);
                    }
                }

                this.graphics = new PIXI.Graphics();
                this.graphics.lineStyle(1, 0xffd900, 1);
                var w1 = Math.ceil(this.gameObject.position.width / this.tileWidth);
                var h1 = Math.ceil(this.gameObject.position.height / this.tileHeight);
                for (var i = 1; i < w1; i++) {
                    this.graphics.moveTo(i * this.tileWidth + this.gameObject.position.getScreenX(), this.gameObject.position.getScreenY());
                    this.graphics.lineTo(i * this.tileWidth + this.gameObject.position.getScreenX(), this.gameObject.position.height + this.gameObject.position.getScreenY());
                }
                for (var i = 1; i < h1; i++) {
                    this.graphics.moveTo(this.gameObject.position.getScreenX(), i * this.tileHeight + this.gameObject.position.getScreenY());
                    this.graphics.lineTo(this.gameObject.position.width + this.gameObject.position.getScreenX(), i * this.tileHeight + this.gameObject.position.getScreenY());
                }
                this.graphics.lineStyle(0);
                if (this.currentTile.x != undefined)
                    DrawBox(this.currentTile.x * (this.tileWidth + 1) - camera.x, this.currentTile.y * (this.tileHeight + 1) - camera.y,
                        this.tileWidth, this.tileHeight, 0, this.graphics, 0, 0, 0xff0000, 1, true, this.gameObject.position.container);
                this.tempPallete.addChild(this.graphics);
                guiContainer.addChild(this.tempPallete);
            }
        }
    }
    this.dispose = function () {
        try {
            this.gameObject.position.container.removeChild(this.sprite);
        } catch (e) {

        }
        try {
            if (this.sprite.destroy)
                this.sprite.destroy();
        } catch (e) {

        }
        delete this.sprite;
    }

}
//Simple tint component
gm.tint = function () {
    this.tint = "0xffffff";
    this.worksInEditor = true;
    newObservable
    this.create = function () {
        var $this = this;
        newObservable(this, "tint", undefined, function (val, object) {
            $this.gameObject.sprite.sprite.tint = $this.tint;
        })();
    }
    this.dispose = function () {
        if (this.gameObject.sprite && this.gameObject.sprite.sprite && this.gameObject.sprite.sprite.tint)
            this.gameObject.sprite.sprite.tint = "0xffffff";
    }
    return this;
}

//PIXI text renderer component
gm.text = function () {
    this.text = "";
    this.fontSize = "16";
    this.fontFamily = "Arial";
    this.fontStyle = "italic";
    this.fontWeight = "bold";
    this.fill = "['#ffffff']";
    this.stroke = "#000000";
    this.strokeThickness = 2;
    this.dropShadows = true;
    this.ShadowColor = "#000000";
    this.dropShadowBlur = 4;
    this.dropShadowAngle = 45;//Math.PI / 6;
    this.dropShadowDistance = 6;
    this.wordWrap = true;
    this.wordWrapWidth = 440;

    this.private = {};

    this.worksInEditor = true;
    this.reloadInEditor = {
        fontSize: true
        , fontFamily: true
        , fontStyle: true
        , fontWeight: true
        , fill: true
        , stroke: true
        , strokeThickness: true
        , dropShadows: true
        , ShadowColor: true
        , dropShadowBlur: true
        , dropShadowAngle: true
        , dropShadowDistance: true
        , wordWrap: true
        , wordWrapWidth: true
    }
    this.create = function () {
        try {
            var fill = ["#ffffff"];
            try {
                fill = JSON.parse(this.fill.replace(/\'/g, '"'))
            } catch (e) {

            }
            var style = new PIXI.TextStyle({
                fontFamily: this.fontFamily,
                fontSize: parseInt(this.fontSize),
                fontStyle: this.fontStyle,
                fontWeight: this.fontWeight,
                fill: fill, // gradient
                stroke: this.stroke,
                strokeThickness: parseInt(this.strokeThickness),
                dropShadow: this.dropShadows,
                dropShadowColor: this.dropShadowColor,
                dropShadowBlur: this.dropShadowBlur,
                dropShadowAngle: parseFloat(this.dropShadowAngle) * Math.PI / 180,
                dropShadowDistance: parseInt(this.dropShadowDistance),
                wordWrap: this.wordWrap,
                wordWrapWidth: parseInt(this.wordWrapWidth)
            });
            this.sprite = new PIXI.Text(this.text, style);

            var $this = this;
            newObservable(this, "text", undefined, function (val, object) {
                $this.sprite.setText(val);
                $this.gameObject.position.width = $this.sprite.width;
                $this.gameObject.position.height = $this.sprite.height;
            });
        } catch (e) {

        }
        if (changing) {
            this.gameObject.position.width = this.sprite.width;
            this.gameObject.position.height = this.sprite.height;
            if (INEDITOR) {
                socketemit("gameobject", { action: "change", name: this.gameObject.name.value, plugin: "position", newval: { width: this.gameObject.position.width, height: this.gameObject.position.height } });
            }
        }
        if (INEDITOR) {
            if (selectedSprite == this.gameObject) {

                reDrawPanel1(this.gameObject);
            }
        }
        try {
            this.gameObject.position.container.addChild(this.sprite);
        } catch (e) {

        }
        this.gameObject.position.init("text");
    }
    this.dispose = function () {
        try {
            this.gameObject.position.container.removeChild(this.sprite);
        } catch (e) {

        }
        if (this.sprite.destroy)
            this.sprite.destroy();
        delete this.sprite;
    }

}
//Tilemap painter Div
function TilerDiv(container) {
    var $this = this;
    var btn = addMenu("Edit", function () {
        if ($this.Editing) {
            lockedSelection = false;
            $(".btnResetTile").removeClass("btn-danger").html("Edit");
            $this.Editing = false;
            $this.currentTile = {};
            $("canvas").off("click", $this.onclick);
            if ($this.preRotation != undefined)
                $this.gameObject.position.rotation = $this.preRotation;
        } else {
            camera.scale = 1;
            lockedSelection = true;
            $this.Editing = true;
            $this.preRotation = $this.gameObject.position.rotation;
            $this.gameObject.position.rotation = 0;
            $(".btnResetTile").addClass("btn-danger").html("Stop");
            $this.onclick = function (e) {

                var w = Math.ceil($this.texture.width / $this.tileWidth);
                var h = Math.ceil($this.texture.height / $this.tileHeight);
                var xx = Math.floor(e.offsetX / $this.tileWidth);
                var yy = Math.floor(e.offsetY / $this.tileHeight);
                if (xx < w && yy < h) {
                    $this.currentTile = { x: xx, y: yy };
                }
                if ($this.currentTile.x != undefined) {
                    xx = Math.floor((e.offsetX - $this.gameObject.position.getScreenX() - camera.x) / $this.tileWidth);
                    yy = Math.floor((e.offsetY - $this.gameObject.position.getScreenY() - camera.y) / $this.tileHeight);
                    w = Math.ceil($this.gameObject.position.width / $this.tileWidth);
                    h = Math.ceil($this.gameObject.position.height / $this.tileHeight);
                    if (xx < w && yy < h && xx > -1 && yy > -1) {
                        if ($this.tilesNum[xx] == undefined)
                            $this.tilesNum[xx] = [];
                        $this.tilesNum[xx][yy] = $this.currentTile;
                        $this.reloadME++;
                        socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "sprite", newval: { tilesNum: $this.tilesNum } });
                    }
                }
            }
            $("canvas").on("click", $this.onclick);
        }
    }, "", container, "btnResetTile");
    if ($this.Editing == true) {
        camera.scale = 1;
        lockedSelection = true;
        $(btn).addClass("btn-danger").html("Stop");
    }
}