gm.PauseMenu = function () {
    //this.worksInEditor=false;
}
gm.PauseMenu.prototype.create = function () {

}
gm.PauseMenu.prototype.update = function (dt) {
    if (camera.scale * 16 != this.gameObject.text.fontSize)
        this.gameObject.text.fontSize = camera.scale * 16;
}
gm.PauseMenu.prototype.dispose = function () {

}
gm.PauseMenu.prototype.clickMe = function () {
    delete localStorage.gameEngineStatesAutoSave;
    loadScene(currentSceneName);
}
	//other events are : 
	//Secondary Create : afterCreate 
	//Physics : beginContact,endContact,impact 
	//Mouse/Touch On GameObject : clickMe,mouseDownOnMe,mouseUpOnMe,mouseMoveOnMe 
	//Drag Events : dragStart,dragStop,drag  ---- Also you can use dragDisabled function to control 
	//Mouse/Touch On Anywhere : click,mouseDown,mouseUp,mouseMove 
