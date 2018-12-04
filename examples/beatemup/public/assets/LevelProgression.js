gm.LevelProgression = function () {
    //this.worksInEditor=false;
    this.progression = "[]";
    this.part = 0;
    this.minVisibleX = -400;
    this.maxVisibleX = 450;
    this.minVisibleY = 0;
    this.maxVisibleY = 0;
    this.saveOn = "1,2";
    this.currentSceneName = "";

}
gm.LevelProgression.prototype.create = function () {
    this.p = JSON.parse(this.progression);
    this.currentSceneName = currentSceneName;
}
gm.LevelProgression.prototype.afterCreate = function () {

}
gm.LevelProgression.prototype.update = function (dt) {
    if (localStorage["gameEngineStates" + "AutoSave"] != undefined && this.fromAutoState != true) {

        loadState("AutoSave", function (objNew) {
            return objNew.Director.LevelProgression.currentSceneName != objects.Director.LevelProgression.currentSceneName ||
                objNew.Director.LevelProgression.part > objects.Director.LevelProgression.part;
        });
    }
    var current = this.p[this.part];

    if (objects.main.life.remaining < 1)
        return;
    var d = objects.Director.Director;

    var monsters = getByTagName("enemy");
    if (monsters) {
        if (!current.type || current.type == "all") {
            for (var i = 0; i < monsters.length; i++) {
                if (monsters[i].life && monsters[i].life.activated && monsters[i].life.remaining > 0)
                    return;
            }
        }
    }
    if (current.type == "pos") {
        if (objects.main.Physics.grounded != true)
            return;
    }
    var m = objects.main.position;
    if ((current.mxx && m.x > current.mxx) ||
        (current.mnx && m.x < current.mnx) ||
        (current.mxy && m.y > current.mxy) ||
        (current.mny && m.y < current.mny))
        return;

    this.part++;
    if (!this.p[this.part]) {
        this.nextLevel();
    }
    if (current.mxx)
        d.maxVisibleX = current.mxx;
    if (current.mnx)
        d.minVisibleX = current.mnx;
    if (current.mxy)
        d.maxVisibleY = current.mxy;
    if (current.mny)
        d.minVisibleY = current.mny;
    if (this.saveOn.split(',').indexOf(this.part.toString()) != -1) {
        this.fromAutoState = true;
        this.SceneName = currentSceneName;
        objects.main.main.combo = 0;
        objects.main.main.currentE = new Array();
        if (objects.main.life.remaining < 2)
            objects.main.life.remaining = 2;
        saveState("AutoSave", "life,mana");
    }
}

gm.LevelProgression.prototype.dispose = function () {

}
gm.LevelProgression.prototype.nextLevel = function () {
    nextScene();
}
gm.LevelProgression.prototype.sceneChange = function (oldsc, newsc) {
    if (oldsc != newsc && newsc != "AutoSave.auto") {
        saveState("AutoSave", "life,mana");
        this.fromAutoState = true;
    }
}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
