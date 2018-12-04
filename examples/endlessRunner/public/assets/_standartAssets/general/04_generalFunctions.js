//Most used functions that are needed by core game engine

var prefabname = 0;
var dontInitializeThese = ["worksInEditor", "__isDragging", "requires", "__initialized"];
var textList = {};
var componentList = {}
var sceneOrder = [];

//Get all components derived from spesific component 
// Example : var arr=GetComponents("sprite"); arr[0].gameObject.position.x=0;
function GetComponents(componentName) {
    return componentList[componentName];
}
//Save current state in localstorage for later loading , AKA Quick save game
//Try to limit objects by naming object group with simmiliar things for example , if all static objects starts with "static" or "background" you can send second parameter "static,background"
function saveState(stateName, dontsaveIfstartsWith) {
    var state = {};
    var dont = dontsaveIfstartsWith == undefined ? [] : dontsaveIfstartsWith.split(',');
    for (var i in objects) {
        var cnt = haveAnyParent(i, dont);
        if (cnt)
            continue;
        state[i] = goBack(objects[i]);
    }
    state.___SceneName = currentSceneName;
    localStorage["gameEngineStates" + stateName] = JSON.stringify(state);
}
function haveAnyParent(name, dont) {
    var parentsList = parentsNameList(name);
    for (var j = 0; j < dont.length; j++) {
        for (var i = 0; i < parentsList.length; i++) {
            if (parentsList[i].startsWith(dont[j]))
                return true;
        }
    }
    return false;

}
function parentsNameList(name) {
    var arr = [];
    if (parents[name]) {
        arr = parentsNameList(parents[name]);
    }
    arr.push(name);
    return arr;

}
//Load current state from localstorage, AKA Quick load game
function loadState(stateName, condition) {
    resources[stateName + ".auto"] = { data: localStorage["gameEngineStates" + stateName] };
    var tempcurrentSceneName = currentSceneName;
    var result = loadScene(stateName + ".auto", condition);
    if (result != false)
        currentSceneName = result.___SceneName;
}
//Delete state when not overwritten but no longer needed
function deleteState(stateName) {
    delete localStorage["gameEngineStates" + stateName];
}
//Load next scene defined in Scene Order
function nextScene() {
    if (currentSceneName == undefined || !currentSceneName.endsWith(".scene") || SceneOrder == undefined || SceneOrder.length < 2)
        return;
    var ind = SceneOrder.indexOf(currentSceneName);
    if ((ind + 1) == SceneOrder.length)
        return;
    var tmp = SceneOrder[ind + 1];
    loadScene(tmp);
    currentSceneName = tmp;
}
//Load Scene 
// 1st Param : scene name like full asset name "Scene1.scene" or "Scenes\\Scene2.scene"
// or "currentScene" for reloading current scene
// 2nd Param : undefined or function that determines should it really be loaded , after scene object created you can check new and old scene properties to decide load or not EXAMPLE:
//function(objectsAboutToBeLoaded) {  //Be carefull this is only raw object that havent been initialized only values from level editor.
// if(objects.Main.name != objectsAboutToBeLoaded.Main.name)
//  return false;
// else
//  return true;
//}

function loadScene(SceneName, condition) {
    var obj = {};
    var oldScene = "";
    if (SceneName != "currentScene") {
        if (SceneName && resources[SceneName])
            obj = JSON.parse(resources[SceneName].data);
        if (condition != undefined && !condition(obj))
            return false;
        oldScene = currentSceneName;
        if (SceneName.endsWith(".scene"))
            currentSceneName = SceneName;
        else
            obj.___SceneName;
    }
    else {
        for (var i in objects) {
            obj[i] = goBack(objects[i]);
        }
        if ("lastSceneName" in this)
            currentSceneName = lastSceneName;
        obj.___SceneName = currentSceneName;
    }
    componentList = {};
    for (var i in PIXI.utils.TextureCache) {
        if (!textList[i])
            PIXI.utils.TextureCache[i].destroy();

    }
    for (var i = 0; i < actionFunctionArrayArray.length; i++) {
        actionFunctionArrayArray[i] = [];
    }

    for (var i in objects) {
        try {
            removeGameObject(objects, i, false);
        } catch (e) {
        }
    }
    for (var i in obj) {
        if (i != "___SceneName") {
            var o = obj[i];
            addGameObjectBase(o, false);
        }
    }
    if (constantGameObjects)
        for (var i = 0; i < constantGameObjects.length; i++) {
            var obj = JSON.parse(constantGameObjects[i]);
            objects[obj.name.value] = obj;
        }
    for (var i in objects) {
        try {

            var o = objects[i];
            initializeGameObject(o, false, true);
        } catch (e) {
        }
    }
    for (var i in objects) {
        var o = objects[i];
        warmUpObject(o, false);
    }
    for (var i in sceneChangeFunctions) {
        sceneChangeFunctions[i].fn(oldScene, SceneName);
    }
    return obj;
}

//Get objects have tName as their tag ; var actorsArray=getByTagName("actor");
function getByTagName(tName) {
    return tags[tName];
}
//Get objects have tNames as their tag ; var actorsArray=getByTagName(["friend","enemy"]);
function getByTagsName(tNames) {
    var arr = new Array();

    for (var i = 0; i < tNames.length; i++) {
        var os = getByTagName(tNames[i]);
        arr = arr.concat(os);
    }

    return arr;
}
//Create gameObject from raw object
function createGameObject(o, editor) { //OK

    var obj = addGameObjectBase(o, editor);
    initializeGameObject(obj, editor, false);
    return obj;
}
//remove gameObject , use objects.myobj.remove(); instead
function removeGameObject(oobjects, name, editor) { //OK
    if (editor)
        INEDITOR = true;
    for (var i in oobjects[name]) {
        disposeComponent(oobjects[name], i, editor);
    }
    delete oobjects[name];
    INEDITOR = false;
}
//add saved prefab copy as new gameObject 
// 1st Param : name of prefab's asset name 
// 2nd Param : if some properties needs to be set before initialization Example : {position:{x:100,y:200}}
// 3rd Param : always false or undefined when writing code for game only
// 4th Param : new gameobjects desired name, if undefined new name will be generated
function addPrefab(name, defaultValues, editor, mustName) {
    try {

        if (!editor)
            editor = false;
        var newObj = JSON.parse(JSON.stringify(prefabs[name]));
        if (defaultValues) {
            for (var i in defaultValues) {
                for (var j in defaultValues[i]) {
                    newObj[0][i][j] = defaultValues[i][j];
                }
            }
        }
        var nameChanges = {};
        var names = new Array();
        for (var i = 0; i < newObj.length; i++) {
            prefabname++;
            var oName = getGOName("PrefabGameObject");
            if (mustName && i == 0)
                oName = mustName;
            names.push(oName);
            nameChanges[newObj[i].name.value] = oName;
            newObj[i].name.value = oName;
            if (newObj[i].position.parent && nameChanges[newObj[i].position.parent]) {
                newObj[i].position.parent = nameChanges[newObj[i].position.parent];
            }
            createGameObject(newObj[i], editor);

        }
        return names;
    } catch (e) {

    }
}
var prefixCounter = 0;
//Create new name with prefix ; EX: getGOName("gameObject")=="gameObject0"; getGOName("gameObject")=="gameObject1"; getGOName("Custom")=="Custom0"; 
function getGOName(prefix) {
    var i = prefixCounter;
    var name = "";
    while (true) {
        i++;
        name = prefix + i;
        var contains = false;
        if (!(name in objects))
            break;
    }
    prefixCounter = i;
    return name;
}
//add component to gameObject , use objects.myobj.addComponent("componentName",newValues); instead
function addComponent(GameObject, pluginName, newValues, editor) {
    addComponentBase(GameObject, pluginName, newValues, editor);
    if (GameObject[pluginName].requires && (GameObject[GameObject[pluginName].requires] == undefined || GameObject[GameObject[pluginName].requires].__initialized != true)) {
        addComponent(GameObject, GameObject[pluginName].requires, {}, editor);
        if (editor) {
            componentAdded(GameObject.name.value, GameObject, GameObject[pluginName].requires);
        }
    }
    initializeComponent(GameObject, pluginName, editor);
}
//remove component from gameObject , use objects.myobj.removeComponent("componentName"); instead
function removeComponent(GameObject, pluginName, editor) {
    for (var i in GameObject) {
        if (GameObject[i].requires == pluginName) {
            removeComponent(GameObject, i, editor);
            pluginRemoved(GameObject.name.value, i);
        }
    }
    disposeComponent(GameObject, pluginName, editor)
    delete GameObject[pluginName];
    if (editor)
        reDrawPanel(GameObject);
    if (componentList[pluginName]) {
        var ind = componentList[pluginName].indexOf(GameObject[pluginName]);
        if (ind != -1) {
            componentList[pluginName].splice(ind, 1);
        }
    }
}
//add gameObject to objects array (scene) without initializing
function addGameObjectBase(o, editor) {
    if (objects[o.name.value])
        return objects[o.name.value];
    var oo = {};
    for (var i in o) {
        addComponentBase(oo, i, o[i], editor);
    }

    objects[o.name.value] = oo;
    objects[o.name.value].remove = function () {
        if (childrenGameObject[o.name.value])
            for (var i in childrenGameObject[o.name.value]) {
                try {
                    objects[childrenGameObject[o.name.value][i]].remove();
                } catch (e) {

                }
            }
        if (o.position.parent && childrenGameObject[o.position.parent]) {
            childrenGameObject[o.position.parent].splice(childrenGameObject[o.position.parent].indexOf(o.name.value), 1);
        }
        removeGameObject(objects, o.name.value, editor);
    }
    objects[o.name.value].addComponent = function (name, initValues) {
        if (!initValues)
            initValues = {};
        addComponent(objects[o.name.value], name, initValues, editor);
    }
    objects[o.name.value].removeComponent = function (name) {
        removeComponent(objects[o.name.value], name, editor);
    }
    objects[o.name.value].children = function () {
        var lst = childrenGameObject[o.name.value];
        var retval = new Array();
        if (lst != undefined) {
            for (var i = 0; i < lst.length; i++) {
                retval.push(objects[lst[i]]);
            }
        }
        return retval;

    }
    return objects[o.name.value];
}
//second part of adding object
function initializeGameObject(o, editor, prewarm) {
    var finishedComponents = new Array();
    initializeComponent(o, "name", editor);
    initializeComponent(o, "position", editor);

    for (var i in o) {
        if (i != "name" && i != "position") {
            tryToInitialize(o, i, editor, finishedComponents, prewarm);
        }
    }
}
//Try to initialize component and if requires another component initialize that first
function tryToInitialize(o, i, editor, finishedComponents, prewarm) {

    if (finishedComponents.indexOf(i) == -1) {
        if ("requires" in o[i]) {
            var reqs = o[i].requires.split(',');
            for (var j = 0; j < reqs.length; j++) {
                addComponentBase(o, reqs[j], {}, editor);
                tryToInitialize(o, reqs[j], editor, finishedComponents);
            }
        }
        initializeComponent(o, i, editor, prewarm);
        finishedComponents.push(i);
    }
}
//Dispose component from game object, use objects.myobj.removeComponent("componentName"); instead
function disposeComponent(GameObject, pluginName, editor) {
    if (editor)
        INEDITOR = true;
    var a = actionFunctions[GameObject.name.value];
    if (a != undefined) {
        var removeToo = new Array();
        for (var i = 0; i < a.length; i++) {
            if (a[i].component == GameObject[pluginName]) {
                try {


                    var arr = window[a[i].action];
                    var ind = -1;
                    for (var j = 0; j < arr.length; j++) {
                        if (arr[j] == a[i].fn || arr[j].fn == a[i].fn)
                            ind = j;
                    }
                    arr.splice(ind, 1);
                    removeToo.push(a[i]);
                } catch (e) {

                }
            }
        }
        for (var i = 0; i < removeToo.length; i++) {
            try {
                a.splice(a.indexOf(removeToo[i]), 1);
            } catch (e) {

            }
        }
        if (a.length == 0)
            delete actionFunctions[GameObject.name.value];
    }
    if (GameObject[pluginName].dispose && (!editor || GameObject[pluginName].worksInEditor))
        GameObject[pluginName].dispose();
    INEDITOR = false;

}
//First part of adding component
function addComponentBase(GameObject, pluginName, newValues, editor, justChange) {
    if (justChange != true) {
        GameObject[pluginName] = new gm[pluginName]();
        GameObject[pluginName].gameObject = GameObject;
        if (!("dontSerialize" in GameObject[pluginName]))
            GameObject[pluginName].dontSerialize = {};
        if (!("serializeObject" in GameObject[pluginName]))
            GameObject[pluginName].serializeObject = {}; //hata al?rsan d??ar?ya
    }
    if (newValues)
        for (var i in newValues) {
            if ((!(i in GameObject[pluginName]) || typeof (GameObject[pluginName][i]) != "object" ||
                GameObject[pluginName].serializeObject[i] == true) && GameObject[pluginName].dontSerialize[i] != true && dontInitializeThese.indexOf(i) == -1)
                GameObject[pluginName][i] = newValues[i];
        }

}
//Executes "afterCreate" event
function warmUpObject(GameObject, editor) {
    for (var pluginName in GameObject) {
        if (GameObject[pluginName].afterCreate && (!editor || GameObject[pluginName].worksInEditor)) {
            if (editor)
                INEDITOR = true;
            GameObject[pluginName].afterCreate();

            if (editor)
                INEDITOR = false;
        }
    }
}
//Second part of adding component
function initializeComponent(GameObject, pluginName, editor, prewarm) {
    if (!GameObject[pluginName].__initialized) {
        if (GameObject[pluginName].create && (!editor || GameObject[pluginName].worksInEditor)) {
            if (editor)
                INEDITOR = true;
            GameObject[pluginName].create();

            if (editor)
                INEDITOR = false;
        }
        if (prewarm != true) {
            if (GameObject[pluginName].afterCreate && (!editor || GameObject[pluginName].worksInEditor)) {
                if (editor)
                    INEDITOR = true;
                GameObject[pluginName].afterCreate();

                if (editor)
                    INEDITOR = false;
            }
        }
        GameObject[pluginName].__initialized = true;
        if (!editor || GameObject[pluginName].worksInEditor)
            inspectComponent(GameObject[pluginName]);
        if (GameObject[pluginName].reloadInEditor) {

            for (var r in GameObject[pluginName].reloadInEditor) {
                (function (GameObject, pluginName, r, editor) {
                    newObservable(GameObject[pluginName], r, undefined, function () {

                        if (editor)
                            INEDITOR = true;
                        changing = true;
                        if (GameObject[pluginName].dispose && (!editor || GameObject[pluginName].worksInEditor))
                            GameObject[pluginName].dispose();
                        if (GameObject[pluginName].create && (!editor || GameObject[pluginName].worksInEditor))
                            GameObject[pluginName].create();
                        if (GameObject[pluginName].afterCreate && (!editor || GameObject[pluginName].worksInEditor))
                            GameObject[pluginName].afterCreate();
                        changing = false;
                        INEDITOR = false;
                    });
                })(GameObject, pluginName, r, editor);
            }
        }
        if (!componentList[pluginName])
            componentList[pluginName] = new Array();
        componentList[pluginName].push(GameObject[pluginName]);
    }
}