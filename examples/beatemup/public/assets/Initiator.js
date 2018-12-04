gm.Initiator = function(){ 
	this.worksInEditor=true;
}
gm.Initiator.prototype.create = function () {
    if (objects.main == undefined) {
        addPrefab("main.prefab", {}, true, "main");
        var JSONReadyGO = goBack(objects.main);
        socketemit("addGameObject", JSONReadyGO);
    }
    if (objects.Menu == undefined) {
        addPrefab("Menu.prefab", {}, true, "Menu");
        var JSONReadyGO = goBack(objects.Menu);
        socketemit("addGameObject", JSONReadyGO);
    }
    if (objects.Director == undefined) {
        addPrefab("Director.prefab", {}, true, "Director");
        var JSONReadyGO = goBack(objects.Director);
        socketemit("addGameObject", JSONReadyGO);
    }
}
gm.Initiator.prototype.update = function (dt) {
    if (INEDITOR) {
        this.create();
    }

}
gm.Initiator.prototype.dispose=function () {

}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
