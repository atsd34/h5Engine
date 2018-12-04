gm.Achievments = function () {
    //this.worksInEditor=false;
    this.achivementList = []
}
gm.Achievments.prototype.addAchievment = function (name, description, fn, save) {
    this.achivementList.push({ name: name, controlFunction: fn, description: description, save: save });
}
gm.Achievments.prototype.getText = function () {

    var completed = 0;
    for (var i in this.laList) {

        if (this.laList[i].done) {
            completed++;
        }
    }
    return "(" + completed + "/" + this.achivementList.length + ")";
}
gm.Achievments.prototype.getCurrent = function () {
    var retval = [];
    var laList = JSON.parse(localStorage.escapeFromEvilCorpAchievments);
    for (var i = 0; i < this.achivementList.length; i++) {
        var la = laList[this.achivementList[i].name];
        if (la == undefined || la.done == undefined || la.done == false) {
            for (var j in la) {
                this.achivementList[i][j] = la[j];
            }
            retval.push(this.achivementList[i]);

        }
        if (retval.length == 3) {
            for (var i in retval) {
                if (retval[i].save) {
                    retval[i].save();
                }
            }
            return retval;
        }
    }
    for (var i in retval) {
        if (retval[i].save) {
            retval[i].save();
        }
    }
    return retval;
}
gm.Achievments.prototype.create = function () {
    if (localStorage.escapeFromEvilCorpAchievments == undefined)
        localStorage.escapeFromEvilCorpAchievments = "{}";
    this.addAchievment("atLeast100", "Score at Least 100", function () {
        if (objects.Director.Director.score >= 100)
            return true;
    });
    this.addAchievment("nearDeath5", "Experience Near Death 5 Times", function () {
        var cl = objects.Main.Main.findClosest("obstacle");
        if (cl.len < 256 && this.offs.indexOf(cl.obj.cutter.id) == -1) {
            this.offs.push(cl.obj.cutter.id);
            exclamation(objects.Main.position.x, objects.Main.position.y, cl.obj.position.x, cl.obj.position.y,0xff6600);
        }
        this.progress = this.offs.length;
        if (this.progress >= 5)
            return true;
    }, function () {
        this.offs = new Array()
    });
    this.addAchievment("dieFlying", "Die to flying saw", function () {
        try {
            var e = getByTagName("Explode");
            if (e != undefined && e.length > 0) {
                var checkY = objects.Director.Director.floorY;
                var chk = e[0].position.other.position.y < (checkY - 300)
                if (chk)
                    exclamation(e[0].position.other.position.x, e[0].position.other.position.y, undefined, undefined, 0x00ff00);
                return chk;
            }
        } catch (e) {

        }
    });
    this.addAchievment("between100150", "Score between 100 and 150", function () {
        var e = getByTagName("Explode");
        if (e != undefined && e.length > 0) {
            if (objects.Director.Director.score >= 100 && objects.Director.Director.score <= 150)
                return true;
        }
    });

    this.addAchievment("close5", "Push 5 buttons in a row", function () {
        try {
            if (this.offs == undefined)
                this.offs = new Array();
            var e = getByTagName("Vial");
            if (e != undefined && e.length > 0) {
                for (var i = 0; i < e.length; i++) {
                    var l = e[i];
                    var contains = -1;
                    for (var j = 0; j < this.offs.length; j++) {
                        if (this.offs[j].x == l.position.x)
                            contains = j;
                    }
                    if (contains == -1) {
                        this.offs.push({ x: l.position.x, on: l.sprite.path == "light.png" });
                    }
                    else {
                        this.offs[contains].on = l.sprite.path == "light.png"
                    }

                }
                this.offs = this.offs.sort(function (a, b) {
                    return a.x - b.x;
                });
                var cnt = 0;
                var cntMax = 0;
                for (var j in this.offs) {

                    if (this.offs[j].on == false)
                        cnt++;
                    else
                        cnt = 0;
                    if (cnt > cntMax)
                        cntMax = cnt;
                }
                if (cntMax >= 5)
                    return true;
            }
        } catch (e) {

        }
    }, function () {
        this.offs = new Array()
    });
    this.addAchievment("Jump20", "Jump over 20 saw in same game", function () {
        if (objects.Main.Main.onRope != true) {
            var cl = objects.Main.Main.findClosest("obstacle");
            if (cl.len < 512 && this.offs.indexOf(cl.obj.cutter.id) == -1
                && cl.obj.position.y > objects.Main.position.y &&
                Math.abs(objects.Main.position.x - cl.obj.position.x) < 64) {
                exclamation(objects.Main.position.x, objects.Main.position.y, cl.obj.position.x, cl.obj.position.y);
                this.offs.push(cl.obj.cutter.id);
            }
            this.progress = this.offs.length;
            if (this.progress >= 20)
                return true;
        }
    }, function () {
        this.offs = new Array()
    });


    this.addAchievment("foot200", "Score 200 while running on foot", function () {
        if (objects.MainSprite0 && objects.MainSprite0.objectAnimator && objects.MainSprite0.objectAnimator.playing == "walk") {
            if (!this.progress)
                this.progress = 0;
            if (this.lastX != -1) {
                this.progress +=
                    (objects.Main.position.x - this.lastX) / 100;
            }
            this.lastX = objects.Main.position.x;
            if (this.progress >= 200)
                return true;
        }
        else if (objects.MainSprite0 && objects.MainSprite0.objectAnimator)
            this.lastX = -1;

    });

    this.addAchievment("atLeast1000", "Score total of 1000", function () {
        if (this.lastScore == undefined)
            this.lastScore = 0;
        if (objects.Director.Director.score > this.lastScore)
            this.progress += objects.Director.Director.score - this.lastScore;
        this.lastScore = objects.Director.Director.score;
        if (this.progress >= 1000)
            return true;
    });

    this.addAchievment("atLeast300", "Score at Least 300", function () {
        if (objects.Director.Director.score >= 300)
            return true;
    });
    this.addAchievment("close20", "Push 20 buttons", function () {
        try {
            if (this.progress == undefined)
                this.progress = 0;
            if (this.offs == undefined)
                this.offs = new Array();
            var e = getByTagName("Vial");
            if (e != undefined && e.length > 0) {
                for (var i = 0; i < e.length; i++) {
                    var l = e[i];
                    if (l.sprite.path == "lightoff.png" && this.offs.indexOf(l.position.x) == -1) {
                        this.offs.push(l.position.x);
                        this.progress++;
                    }
                }
                if (this.progress >= 20)
                    return true;

            }
        } catch (e) {

        }
    }, function () {
        this.offs = [];
    });

    this.addAchievment("nearDeath5Swing", "Experience Near Death 5 Times After Swinging", function () {
        if (objects.MainSprite0.objectAnimator.lastPlayed == "swingback" || objects.MainSprite0.objectAnimator.lastPlayed == "swingforward") {
            var cl = objects.Main.Main.findClosest("obstacle");
            if (cl.len < 256 && this.offs.indexOf(cl.obj.cutter.id)) {
                this.offs.push(cl.obj.cutter.id);
                exclamation(objects.Main.position.x, objects.Main.position.y, cl.obj.position.x, cl.obj.position.y,0xff6600);
            }
            this.progress = this.offs.length;
            if (this.progress >= 5)
                return true;
        }
    }, function () {
        this.offs = new Array()
    });
    this.addAchievment("dieMoving", "Die to moving saw", function () {
        try {
            var e = getByTagName("Explode");
            if (e != undefined && e.length > 0) {
                var checkY = objects.Director.Director.floorY;
                var chk = e[0].position.other.cutter.horizantalMove == true;
                if (chk)
                    exclamation(e[0].position.other.position.x, e[0].position.other.position.y, undefined, undefined,0x00ff00);
                return chk;
            }
        } catch (e) {

        }
    });
    this.addAchievment("jump100", "Score 100 while jumping", function () {
        if (objects.MainSprite0 && objects.MainSprite0.objectAnimator && objects.MainSprite0.objectAnimator.playing == "jump") {
            if (!this.progress)
                this.progress = 0;
            if (this.lastX != -1) {
                this.progress +=
                    (objects.Main.position.x - this.lastX) / 100;
            }
            this.lastX = objects.Main.position.x;
            if (this.progress >= 100)
                return true;
        }
        else if (objects.MainSprite0 && objects.MainSprite0.objectAnimator)
            this.lastX = -1;

    });

    this.addAchievment("atLeast500", "Score at Least 500", function () {
        if (objects.Director.Director.score >= 500)
            return true;
    });
    this.addAchievment("Swing20", "Swing over 20 saw in same game", function () {
        if (objects.Main.Main.onRope == true) {
            var cl = objects.Main.Main.findClosest("obstacle");
            if (cl.len < 512 && this.offs.indexOf(cl.obj.cutter.id) == -1
                && cl.obj.position.y > objects.Main.position.y &&
                Math.abs(objects.Main.position.x - cl.obj.position.x) < 128) {
                this.offs.push(cl.obj.cutter.id);
                exclamation(objects.Main.position.x, objects.Main.position.y, cl.obj.position.x, cl.obj.position.y);
            }
            this.progress = this.offs.length;
            if (this.progress >= 20)
                return true;
        }
    }, function () {
        this.offs = new Array()
    });
    this.addAchievment("rope100", "Score 100 while swinging", function () {
        if (objects.MainSprite0 && objects.MainSprite0.objectAnimator && (objects.MainSprite0.objectAnimator.playing == "swingback" || objects.MainSprite0.objectAnimator.playing == "swingforward")) {
            if (!this.progress)
                this.progress = 0;
            if (this.lastX != -1 && objects.Main.position.x > this.lastX) {
                this.progress +=
                    (objects.Main.position.x - this.lastX) / 100;
            }
            this.lastX = objects.Main.position.x;
            if (this.progress >= 100)
                return true;
        }
        else if (objects.MainSprite0 && objects.MainSprite0.objectAnimator)
            this.lastX = -1;

    });
    this.addAchievment("atLeast10000", "Score total of 10000", function () {
        if (this.lastScore == undefined)
            this.lastScore = 0;
        if (objects.Director.Director.score > this.lastScore)
            this.progress += objects.Director.Director.score - this.lastScore;
        this.lastScore = objects.Director.Director.score;
        if (this.progress >= 1000)
            return true;
    });


    /*hard*/
    this.addAchievment("close25", "Push 20 buttons in same game", function () {
        try {
            if (this.offs == undefined)
                this.offs = new Array();
            var e = getByTagName("Vial");
            if (e != undefined && e.length > 0) {
                for (var i = 0; i < e.length; i++) {
                    var l = e[i];
                    if (l.sprite.path == "lightoff.png" && this.offs.indexOf(l.position.x) == -1)
                        this.offs.push(l.position.x);
                }
                this.progress = this.offs.length;
                if (this.progress >= 20)
                    return true;

            }
        } catch (e) {

        }
    }, function () {
        this.offs = [];
    });
    this.addAchievment("foot500", "Score 500 while running on foot", function () {
        if (objects.MainSprite0 && objects.MainSprite0.objectAnimator && objects.MainSprite0.objectAnimator.playing == "walk") {
            if (!this.progress)
                this.progress = 0;
            if (this.lastX != -1) {
                this.progress +=
                    (objects.Main.position.x - this.lastX) / 100;
            }
            this.lastX = objects.Main.position.x;
            if (this.progress >= 500)
                return true;
        }
        else if (objects.MainSprite0 && objects.MainSprite0.objectAnimator)
            this.lastX = -1;

    });
    this.addAchievment("atLeast1000", "Score at Least 1000", function () {
        if (objects.Director.Director.score >= 1000)
            return true;
    });
    this.current = this.getCurrent();
    this.laList = JSON.parse(localStorage.escapeFromEvilCorpAchievments);

}
gm.Achievments.prototype.update = function (dt) {

    for (var i = 0; i < this.current.length; i++) {
        var c = this.current[i];
        if (c.done != true) {
            try {
                var retval = c.controlFunction();
                c.done = retval;
            } catch (e) {

            }
        }
        this.laList[c.name] = c;
    }
}
gm.Achievments.prototype.dispose = function () {
    this.save();
}
gm.Achievments.prototype.save = function () {

    localStorage.escapeFromEvilCorpAchievments = JSON.stringify(this.laList);

}

function exclamation(x, y, x2, y2, c) {
    if (x2)
        x = (x + x2) / 2;
    if (y2)
        y = (y + y2) / 2;
    var ex = objects[addPrefab("exclamation.prefab", {
        position: {
            x: x,
            y: y
        },
        tint: {
            tint: (c == undefined ? 0xffffff : c)
        }
    })[0]];
    setTimeout(function () {
        ex.remove();
    }, 1000);
}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
