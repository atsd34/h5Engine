var cutterID = 0;
gm.Director = function () {
    this.backs = [];
    this.canRestart = false;

    this.bricks = new Array();
    this.lights = new Array();
    this.unusedLights = new Array();
    this.obstacles = new Array();
    this.nodes = new Array();
    this.unusedObstacles = new Array();
    this.unusedNodes = new Array();
    this.score = 0;
    this.unusedBricks = new Array();
    this.patternNo = 0;
    this.currentPattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.minPos = 0;
    this.maxPos = 0;
    this.hardness = function () {
        var a = this.score;
        a = Math.max(1.2, Math.sqrt(a) / (2 * Math.log(a + 20) * Math.LOG10E));
        return parseInt((1 - (1 / (a))) * 100);

    }
    this.hardnessRandom = function () {
        var hardness = this.hardness();
        var val = Math.random();
        return hardness / 2 + parseInt(hardness * val);
    }
    this.createBrick = function (x, y) {

        if (x == undefined)
            x = this.lastBrick().position.x + 253;
        if (y == undefined)
            y = this.floorY;
        if (this.patternNo < this.currentPattern.length) {
            var cNum = this.currentPattern[this.patternNo];
            this.patternNo++;
            switch (cNum) {
                case 1:
                    var ob;

                    if (this.unusedObstacles.length == 0)
                        ob = objects[addPrefab("Cutter.prefab")[0]];
                    else
                        ob = this.unusedObstacles.splice(0, 1)[0];
                    this.obstacles.push(ob);
                    ob.position.x = x;
                    ob.position.y = y - 100;
                    ob.cutter.horizantalMove = false;
                    ob.cutter.startX = ob.position.x;
                    ob.cutter.startY = ob.position.y;
                    ob.cutter.id = cutterID++;
                    break;
                case 2:
                    var o2;
                    if (this.unusedNodes.length == 0)
                        o2 = objects[addPrefab("ropeNode.prefab")];
                    else
                        o2 = this.unusedNodes.splice(0, 1)[0];
                    o2.position.x = x - 100 + Math.random() * 200;
                    o2.position.y = y - 1300 + Math.random() * 300;
                    this.nodes.push(o2);
                    break;
                case 7:
                    var o2;
                    if (this.unusedNodes.length == 0)
                        o2 = objects[addPrefab("ropeNode.prefab")];
                    else
                        o2 = this.unusedNodes.splice(0, 1)[0];
                    o2.position.x = x - 100;
                    o2.position.y = y - 1200;
                    this.nodes.push(o2);
                    var ob;

                    if (this.unusedObstacles.length == 0)
                        ob = objects[addPrefab("Cutter.prefab")[0]];
                    else
                        ob = this.unusedObstacles.splice(0, 1)[0];
                    this.obstacles.push(ob);
                    ob.position.x = x;
                    ob.position.y = y - 100;
                    ob.cutter.horizantalMove = false;
                    ob.cutter.startX = ob.position.x;
                    ob.cutter.startY = ob.position.y;
                    ob.cutter.id = cutterID++;
                    break;
                case 3:
                    var ob;

                    if (this.unusedObstacles.length == 0)
                        ob = objects[addPrefab("Cutter.prefab")[0]];
                    else
                        ob = this.unusedObstacles.splice(0, 1)[0];
                    this.obstacles.push(ob);
                    ob.position.x = x;
                    ob.position.y = y - 450;
                    ob.cutter.horizantalMove = false;
                    ob.cutter.startX = ob.position.x;
                    ob.cutter.startY = ob.position.y;
                    ob.cutter.id = cutterID++;
                    break;
                case 4:
                    var ob;

                    if (this.unusedObstacles.length == 0)
                        ob = objects[addPrefab("Cutter.prefab")[0]];
                    else
                        ob = this.unusedObstacles.splice(0, 1)[0];
                    this.obstacles.push(ob);
                    ob.position.x = x;
                    ob.position.y = y - 500;
                    ob.cutter.horizantalMove = false;
                    ob.cutter.startX = ob.position.x;
                    ob.cutter.startY = ob.position.y;
                    ob.cutter.id = cutterID++;
                    break;
                case 5:
                    var ob;

                    if (this.unusedObstacles.length == 0)
                        ob = objects[addPrefab("Cutter.prefab")[0]];
                    else
                        ob = this.unusedObstacles.splice(0, 1)[0];
                    this.obstacles.push(ob);
                    ob.position.x = x;
                    ob.position.y = y;
                    ob.cutter.horizantalMove = false;
                    ob.cutter.startX = ob.position.x;
                    ob.cutter.startY = ob.position.y;
                    ob.cutter.id = cutterID++;
                    break;
                case 6:
                    var ob;

                    if (this.unusedObstacles.length == 0)
                        ob = objects[addPrefab("Cutter.prefab")[0]];
                    else
                        ob = this.unusedObstacles.splice(0, 1)[0];
                    this.obstacles.push(ob);
                    ob.position.x = x + 128;
                    ob.position.y = y;
                    ob.cutter.horizantalMove = false;
                    ob.cutter.startX = ob.position.x;
                    ob.cutter.startY = ob.position.y;
                    ob.cutter.id = cutterID++;
                    break;
                case 8:
                    var ob;

                    if (this.unusedObstacles.length == 0)
                        ob = objects[addPrefab("Cutter.prefab")[0]];
                    else
                        ob = this.unusedObstacles.splice(0, 1)[0];
                    this.obstacles.push(ob);
                    ob.position.x = x;
                    ob.position.y = y;
                    ob.cutter.horizantalMove = false;
                    ob.cutter.startX = ob.position.x;
                    ob.cutter.startY = ob.position.y;
                    ob.cutter.id = cutterID++;

                    break;
                case 9:
                    var ob;

                    if (this.unusedObstacles.length == 0)
                        ob = objects[addPrefab("Cutter.prefab", {
                            position: {
                                x: x + 128,
                                y: y
                            },
                            cutter: {
                                horizantalMove: true
                            }
                        })[0]];
                    else
                        ob = this.unusedObstacles.splice(0, 1)[0];
                    this.obstacles.push(ob);
                    ob.position.x = x + 128;
                    ob.position.y = y;
                    ob.cutter.startX = ob.position.x;
                    ob.cutter.startY = ob.position.y;
                    ob.cutter.horizantalMove = true;
                    ob.cutter.id = cutterID++;
                    break;
                default:
                // code
            }
        } else {
            if (this.score > 0) {
                var hr = this.hardnessRandom();
                if (hr < 5)
                    this.currentPattern = [0, 0, 1, 0];
                else if (hr < 10)
                    this.currentPattern = [0, 0, 1, 2, 1];
                else if (hr < 15)
                    this.currentPattern = [0, 0, 1, 7, 1, 1];
                else if (hr < 25)
                    this.currentPattern = [0, 0, 1, 1, 7, 1, 1];
                else if (hr < 35)
                    this.currentPattern = [0, 0, 4, 1, 7, 1, 1];
                else if (hr < 40)
                    this.currentPattern = [0, 0, 1, 1, 2, 1];
                else if (hr < 45)
                    this.currentPattern = [0, 0, 0, 1, 1, 2, 0, 5, 0];
                else if (hr < 50)
                    this.currentPattern = [0, 0, 1, 9, 2, 0, 1, 0];
                else if (hr < 55)
                    this.currentPattern = [0, 0, 1, 2, 1, 0, 3, 0];
                else if (hr < 59)
                    this.currentPattern = [0, 0, 4, 0, 1, 7, 1, 0, 4, 4, 0];
                else if (hr < 63)
                    this.currentPattern = [0, 0, 1, 2, 1, 1, 0, 6, 1, 0, 3, 0, 0];
                else if (hr < 67)
                    this.currentPattern = [0, 0, 4, 1, 7, 1, 1, 4, 0];
                else if (hr < 71)
                    this.currentPattern = [0, 0, 7, 4, 4, 1, 0, 1, 7, 0, 6, 1, 0, 3, 0, 1, 0];
                else if (hr < 74)
                    this.currentPattern = [0, 0, 7, 0, 4, 1, 0, 1, 7, 0, 6, 1, 0, 3, 0, 1];
                else if (hr < 77)
                    this.currentPattern = [0, 0, 1, 4, 1, 7, 1, 4, 0];
                else if (hr < 80)
                    this.currentPattern = [0, 0, 0, 0, 7, 9, 0, 0, 0];
                else if (hr < 82)
                    this.currentPattern = [0, 0, 0, 0, 9, 2, 9, 0, 0, 0];
                else if (hr < 85)
                    this.currentPattern = [0, 0, 0, 0, 9, 7, 9, 0, 0, 0];
                else if (hr < 88)
                    this.currentPattern = [0, 0, 0, 0, 9, 2, 9, 1, 0, 0];
                else if (hr < 91)
                    this.currentPattern = [0, 0, 0, 1, 9, 2, 9, 1, 0, 0];
                else if (hr < 94)
                    this.currentPattern = [0, 0, 0, 1, 4, 1, 0, 7, 0, 1, 4, 1];
                else
                    this.currentPattern = [0, 0, 7, 9, 0, 0, 0, 7, 0, 0, 0, 1, 1, 7, 4, 4, 1, 7, 1, 1, 4, 4, 1, 7, 0, 0, 0, 7, 4, 4, 1, 0, 1, 7, 0, 6, 1, 0, 3, 0, 1, 0];
            } else
                this.currentPattern =  [4, 0, 1, 0, 0, 0, 1, 7, 1, 0, 0];
            this.patternNo = 0;

            var light = undefined;
            if (this.unusedLights.length == 0)
                light = objects[addPrefab("Vial.prefab", {
                    position: {
                        x: x,
                        y: y - 80
                    }
                })[0]];
            else {
                light = this.unusedLights.splice(0, 1)[0];
                light.position.x = x;
                light.sprite.path = "light.png";
            }

            this.lights.push(light);
        }
        var o;
        if (this.unusedBricks.length == 0) {
            var rnd = parseInt(Math.random() * 5)
            var path = "FLOOR\\" + "f4.png";
            switch (rnd) {
                case 0:
                    var path = "FLOOR\\" + "f1.png";
                    break;
                case 1:
                    var path = "FLOOR\\" + "f2.png";
                    break;
                case 2:
                    var path = "FLOOR\\" + "f3.png";
                    break;
                default:
            }
            o = objects[addPrefab("Brick.prefab", {
                sprite: {
                    path: path
                }
            }
            )];
        }
        else {
            o = this.unusedBricks.splice(0, 1)[0];
        }
        o.position.x = x;
        o.position.y = y;
        this.bricks.push(o);


    }
    this.lastBrick = function () {
        return this.bricks[this.bricks.length - 1];
    }
    this.firstBrick = function () {
        return this.bricks[0];
    }
}
gm.Director.prototype.create = function () {
    if (localStorage.highestEscapeEvilCorpScore == undefined)
        localStorage.highestEscapeEvilCorpScore = 0;
    objects.HighScore.text.text = "Best :" + localStorage.highestEscapeEvilCorpScore;
    for (var i = 0; i < 5; i++) {
        var o = objects[addPrefab("back.prefab", {
            sprite: {
                path: 'factory' + i + '.png'
            },
            tint: {
                tint: "0xffffff"
            }
        })[0]];
        o.position.x = -2000 + (o.position.width - 1) * i;
        this.backs.push(o);
    }
    pausedUpdate = true;
    this.floorY = 600;
    this.createBrick(-2000);
    for (var i = 0; i < 40; i++) {
        this.update();
    }
}
gm.Director.prototype.render = function (dt) {
    camera.scale = game.view.height / 1550;
    guiContainer.scale.x = game.view.height / 1350;
    guiContainer.scale.y = game.view.height / 1350;
}
gm.Director.prototype.update = function (dt) {
    for (var i = 0; i < this.backs.length; i++) {
        var next = i - 1;
        if (next == -1)
            next = this.backs.length - 1;
        if ((this.backs[i].position.x + this.backs[i].position.width / 2) < (objects.Main.position.x - 3000)) {
            this.backs[i].position.x = this.backs[next].position.x + this.backs[next].position.width - 1;
            var a = 255 - Math.min(180, parseInt(this.score / 3));
            this.backs[i].tint.tint = "0x" + (256 * 256 * 255 + a * 256 + a).toString(16);
        }

    }
    if (!objects.Main || !objects.Main.position)
        return;
    if (camera.x < objects.Main.position.x)
        camera.x = objects.Main.position.x;
    var score = parseInt(objects.Main.position.x / 100);
    this.score = Math.max(score, this.score);
    if (this.score > localStorage.highestEscapeEvilCorpScore) {
        objects.HighScore.text.text = "Best :" + this.score;
    }
    var scoreText = "Score:" + this.score;
    if (scoreText != objects.GUI.text.text)
        objects.GUI.text.text = scoreText;
    var f = this.firstBrick();
    for (var i = 0; i < this.lights.length; i++) {
        if (this.lights[i].position.x < (objects.Main.position.x - 3000)) {
            var l = this.lights.splice(i, 1)[0];
            this.unusedLights.push(l);
            break;
        }
    }
    var fx = (objects.Main.position.x - 2200);
    var lx = (objects.Main.position.x + 2200);
    if (this.bricks.length > 1 && f.position.x < fx) {
        this.unusedBricks.push(this.bricks.splice(0, 1)[0]);
    }
    var fo = this.obstacles[0];
    var fn = this.nodes[0];
    if (fo != undefined && fo.position.x < fx) {
        this.unusedObstacles.push(this.obstacles.splice(0, 1)[0]);
    }
    if (fn != undefined && fn.position.x < fx) {
        this.unusedNodes.push(this.nodes.splice(0, 1)[0]);
    }
    var l = this.lastBrick();
    if (l.position.x < lx)
        this.createBrick();

}