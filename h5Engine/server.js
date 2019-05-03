//All Server functions are located here 
//Some game engine logic, commits, file system related codes 

var path = require('path');
var wrench = require('wrench');
var fs = require('fs');
var path = require('path');
var AdmZip = require('adm-zip');
var http = require('http');
var plugins = {};
var watch = require('node-watch');
var UglifyJS = require("uglify-js");
var os = require('os');
var prettydiff = require("prettydiff2");
var generaloptions = { projectFolder: "c:\\autoCreatedProject" }
var currentScene = "";
var port = process.env.PORT || 8989;
try {
    generaloptions = JSON.parse(fs.readFileSync("generalOptions", "utf-8"));
} catch (e) {

}
var projectFolder = generaloptions.projectFolder;
//When new project created default folders created 
function SetProjectFolder() {
    var splitted = projectFolder.split("\\");
    var cDir = splitted[0];
    if (splitted.length > 1)
        for (var i = 1; i < splitted.length; i++) {
            cDir = cDir + "\\" + splitted[i];
            if (!fs.existsSync(cDir)) {
                fs.mkdirSync(cDir);
            }
        }
    if (projectFolder != undefined && projectFolder != "" && !projectFolder.endsWith("\\"))
        projectFolder = projectFolder + "\\";
    if (!fs.existsSync(projectFolder + "solution"))
        fs.mkdirSync(projectFolder + "solution");
    if (!fs.existsSync(projectFolder + "undos"))
        fs.mkdirSync(projectFolder + "undos");
    if (!fs.existsSync(projectFolder + "properties"))
        fs.mkdirSync(projectFolder + "properties");
    if (!fs.existsSync(projectFolder + "public"))
        fs.mkdirSync(projectFolder + "public");
    if (!fs.existsSync(projectFolder + "public\\assets"))
        fs.mkdirSync(projectFolder + "public\\assets");
    if (!fs.existsSync(projectFolder + "thrash"))
        fs.mkdirSync(projectFolder + "thrash");
    if (!fs.existsSync(projectFolder + "public\\assets\\_standartAssets"))
        fs.mkdirSync(projectFolder + "public\\assets\\_standartAssets");
    var recentChanged = false;
    if (generaloptions.recent == undefined)
        generaloptions.recent = [];
    if (generaloptions.recent.indexOf(projectFolder) != (generaloptions.recent.length - 1)) {
        if (generaloptions.recent.indexOf(projectFolder) != -1)
            generaloptions.recent = generaloptions.recent.filter(i => i != projectFolder);
        generaloptions.recent.push(projectFolder);
        if (generaloptions.recent.length > 10) {
            generaloptions.recent.splice(0, (generaloptions.recent.length - 10));
        }
        fs.writeFileSync("generalOptions", JSON.stringify(generaloptions));
    }
}
function CheckFolder() {
    if (!fs.existsSync(generaloptions.projectFolder)) {
        //If current project deleted- we want to create temp project
        generaloptions.projectFolder = os.tmpdir() + "\\autoCreatedProject\\";
        generaloptions["Standart Assets"] = true;
        generaloptions["PIXI renderer"] = true;
        projectFolder = generaloptions.projectFolder;
        SetProjectFolder();
        for (var i in generaloptions) {
            if (generaloptions[i] == true)
                try {
                    importPlugin(i);
                } catch (e) {

                }
        }
    }


}
CheckFolder();
//When any asset added from GUI or file system or from visual studio we watch folder changes
watch(projectFolder + "public\\assets", { recursive: true }, (eventType, filename) => {
    if (eventType == "update") {
        emitAssets(io.clients(), [filename]);
    }
});
function getHelpText() {
    var retval = "var helptext={};\n";
    var fls = readDirectory(__dirname + "\\help").map(i => i.name);
    for (var i = 0; i < fls.length; i++) {
        var nm = fls[i];
        var shortName = nm.split('\\');
        shortName = shortName[shortName.length - 1];
        var content = fs.readFileSync(nm,  'utf-8');
        retval += "helptext['" + shortName + "'] = " + JSON.stringify(content) + "\n";
    }
    return retval;
}
//Simple http server
var app = http.createServer(function (request, response) {
    var filePath = request.url;
    filePath = filePath.split('?')[0].split('#')[0];
    filePath = decodeURIComponent(filePath);
    if (filePath == '/')
        filePath = '/index.html';
    if (filePath == "/helptext.js") { //special file
        response.writeHead(200, { 'Content-Type': "text/javascript" });
        var txt = getHelpText();
        response.end(txt, 'utf-8');
        fs.writeFile(__dirname + "/public" + filePath, txt, 'utf-8');
        return;
    }
    if (filePath.startsWith("/assets/") && fs.existsSync(projectFolder + "/public" + filePath))
        filePath = projectFolder + "/public" + filePath;
    else if (fs.existsSync(__dirname + "/public" + filePath))
        filePath = __dirname + "/public" + filePath;
    if (filePath.startsWith("/plugins/") && fs.existsSync(__dirname + filePath))
        filePath = __dirname + filePath;

    var extname = path.extname(filePath);
    var contentType = undefined;
    switch (extname) {
        case '.html':
        case '.htm':
            contentType = 'text/html';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        default:
            contentType = 'text/plain';
            break;
    }

    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.writeHead(200, contentType ? { 'Content-Type': contentType } : {});
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(port);
//Main communication engine 
var io = require('socket.io')(app);
var gameobjects = {};
var sceneOrder = [];
var undos = [];
var redos = [];
var gameRunning = false;
//Default project settings
var settings = {
    PixelPerfect: true,
    AutoWidth: true,
    Width: 800,
    AutoHeight: true,
    Height: 600,
    Header: "Header",
    BackgroundColor: "FFFFFF",
    MinWidthHeightRatio: 1.5,
    MaxWidthHeightRatio: 2
};
if (projectFolder != undefined && projectFolder != "" && !projectFolder.endsWith("\\"))
    projectFolder = projectFolder + "\\";
try {
    plugins = JSON.parse(fs.readFileSync("plugins\\pluginList.json", 'utf-8'));
} catch (e) {

}
//Load current solution
function loadApp() {

    SetProjectFolder();
    var content;
    try {

        content = fs.readFileSync(projectFolder + 'properties' + '\\' + 'properties.json', 'utf-8')
        gameobjects = JSON.parse(content);

    } catch (e) {

    } try {

        content = fs.readFileSync(projectFolder + 'undos' + '\\' + 'undo.json', 'utf-8');
        undos = JSON.parse(content);
    } catch (e) {

    } try {

        content = fs.readFileSync(projectFolder + 'undos' + '\\' + 'redo.json', 'utf-8');
        undos = JSON.parse(content);
    } catch (e) {

    } try {

        content = fs.readFileSync(projectFolder + "solution\\solutionOptions.json", 'utf-8');
        var options = JSON.parse(content);
        currentScene = options.lastSceneName;

    } catch (e) {

    }

}
loadApp();

var assetListClient = [];
var assetListTemp = [];
io.on('connection', function (client) {
    //When new client connects immediately check folder, Send assetlist,recent projects list and undo/redo available.
    CheckFolder();
    SetProjectFolder();
    emitAssets(client, []);
    emitRecentList();
    checkRedo(client);
    function emitRecentList() {
        client.emit("recentFiles", generaloptions.recent);
    }
    var prefabs = {};
    //Then game is loaded and send via "objectproperties"
    for (var i in assetListTemp) {
        if (assetListTemp[i].name.endsWith(".prefab")) {
            var pref = fs.readFileSync(assetListTemp[i].name);
            prefabs[assetListTemp[i].name.replace(projectFolder, "").substring(14)] = JSON.parse(pref);
        }
    }
    var opening = new Array();

    try {
        settings = JSON.parse(fs.readFileSync(projectFolder + "properties\\settings.json", 'utf-8'));
    } catch (e) {

    }

    try {
        sceneOrder = JSON.parse(fs.readFileSync(projectFolder + "properties\\sceneOrder.json", 'utf-8'));
    } catch (e) {

    }
    client.emit("objectproperties", { GO: gameobjects, assetList: assetListClient, prefabs: prefabs, settings: settings, plugins: plugins, sceneOrder: sceneOrder });
    //And Solution options read-send to client
    try {
        fs.readFile(projectFolder + "solution\\solutionOptions.json", 'utf-8', function (err, content) {

            try {
                var sp = JSON.parse(content);
                sp.general = generaloptions;
                sp.dir = projectFolder;
                client.emit("solutionOptionsServer", sp);
                currentScene = sp.lastSceneName;
            } catch (e) {

            }
        });
    } catch (e) {

    }
    ///Client initiated actions
    //If prefab added from client prefab system creates new file and informs client that it is success
    client.on("addPrefab", function (data) {
        fs.writeFileSync(projectFolder + "public\\assets\\" + data.name + ".prefab", JSON.stringify(data.data));
        emitAssets(client, [projectFolder + "public\\assets\\" + data.name + ".prefab"]);
    });
    //Project settings change
    // data = settings object
    client.on("saveSettings", function (data) {
        fs.writeFileSync(projectFolder + "properties\\settings.json", JSON.stringify(data));
        settings = data;
        io.clients().emit("settingsSaved", data);
    });
    //Scene order change
    // data = scene order names string array
    client.on("saveSceneOrder", function (data) {
        fs.writeFileSync(projectFolder + "properties\\sceneOrder.json", JSON.stringify(data));
        sceneOrder = data;
    });

    //Open new project by selecting folder
    // data = {Folder: string name }
    client.on("ProjectFolderOpen", function (data) {
        if (fs.existsSync(data.Folder)) {
            changeFolder(data);
            client.emit("eval", "window.location.href=window.location.href");
        } else {
            client.emit("eval", "message('Folder doesnt exists, cannot open!');");
        }

    });
    function ProjectFolder(data) {
        if (!fs.existsSync(data.Folder)) {
            changeFolder(data);
            for (var i in data) {
                if (data[i] == true)
                    try {
                        importPlugin(i);
                    } catch (e) {

                    }
            }
            client.emit("eval", "window.location.href=window.location.href");
        } else {
            client.emit("eval", "message('Folder exists, cannot create new project there,Try to open project!');");
        }
    }
    function changeFolder(data) {
        projectFolder = data.Folder;
        SetProjectFolder();
        gameobjects = {};
        undos = [];
        redos = [];
        loadApp();
        generaloptions.projectFolder = projectFolder;
        fs.writeFileSync("generalOptions", JSON.stringify(generaloptions));
    }
    //Create new project
    // data = {Folder : string folder name}
    client.on("ProjectFolderSave", function (data) {
        ProjectFolder(data);
        emitRecentList();
    });
    //Add new asset with string content
    client.on("addFile", function (data) {
        try {
            data.name = data.name.replace(/ /g, '');
            fs.writeFileSync(projectFolder + "public\\assets" + (data.folder ? data.folder : "") + "\\" + data.name, data.content);
            emitAssets(client, [projectFolder + "public\\assets" + data.name]);
            if (settings.connectedVisualStudio) {
                exportGame();
                copyVS();
            }
        } catch (e) {

        }
    });

    //Creates new game code and run with first scene
    client.on("export", function () {
        if (sceneOrder.length == 0) {
            exportcurrent();
            return;
        }
        var from = projectFolder + "public\\assets\\" + sceneOrder[0];
        var copyGO = JSON.stringify(gameobjects);
        gameobjects = JSON.parse(fs.readFileSync(from));
        exportGame();
        var childProc = require('child_process');
        var exec = require('child_process').exec;
        gameobjects = JSON.parse(copyGO);
        exec('start "Google Chrome" http://localhost:' + port + '/export.html?reset=' + sceneOrder[0], function () { });
    });

    //Creates new game code and run with scene that user works on
    client.on("exportcurrent", function () {
        exportcurrent();
    });
    function exportcurrent() {
        if (!currentScene)
            currentScene = "";
        exportGame();
        var childProc = require('child_process');
        var exec = require('child_process').exec;
        exec('start "Google Chrome" http://localhost:' + port + '/export.html', function () { });
    }

    // Creates new visual studio solution and start that solution
    client.on("VisualStudio", function () {
        settings.connectedVisualStudio = true;
        fs.writeFileSync(projectFolder + "properties\\settings.json", JSON.stringify(settings));
        exportGame();
        copyVS();
        fs.writeFileSync(projectFolder + "public.sln", visualStudioSLN());
        fs.writeFileSync(projectFolder + "public\\Web.config", visualStudioConfig());
        var childProc = require('child_process');
        var exec = require('child_process').exec;
        exec('start "Visual Studio" "' + projectFolder + "public.sln" + '"', function () { });
    });
    //Creates/ copies all solution to new folder , javascript files minified obsecured
    client.on("exportSave", function () {
        try {

            var zip = new AdmZip();
            var from = projectFolder + "public\\assets\\" + sceneOrder[0];
            var copyGO = JSON.stringify(gameobjects);
            gameobjects = JSON.parse(fs.readFileSync(from));
            exportGame();
            if (!fs.existsSync(projectFolder + "minified"))
                fs.mkdirSync(projectFolder + "minified");
            else {
                wrench.rmdirSyncRecursive(projectFolder + "minified", true);
                fs.mkdirSync(projectFolder + "minified");
            }
            addMinified("exportProperties.js", "", "public");
            addMinified("export.html", "", "public");
            addMinified("jquery-3.2.1.js", "", "public");
            addMinified("export.js", "", "public");

            var assetList = readDirectory(projectFolder + "public\\assets");
            for (var i = 0; i < assetList.length; i++) {
                if (!assetList[i].isFolder && assetList[i].name.indexOf(".prefab") == -1) {
                    addMinified(assetList[i].onlyName, assetList[i].folder.replace(projectFolder, "").substring(7) + "\\", assetList[i].name.replace(assetList[i].onlyName, ""));

                }
            }
            gameobjects = JSON.parse(copyGO);
            require('child_process').exec('start "" "' + projectFolder + "minified" + '"');
        } catch (e) {

        }

    });
    //creates minified version of javascript file
    function addMinified(filename, folder, source) {
        var folderFull = projectFolder + "minified\\";
        var foldersplitted = folder.split('\\');
        for (var i = 0; i < foldersplitted.length; i++) {
            folderFull = folderFull + foldersplitted[i] + "\\";
            if (!fs.existsSync(folderFull))
                fs.mkdirSync(folderFull);
        }

        if (filename.endsWith(".js") && !filename.endsWith(".min.js") && filename.indexOf("jquery") == -1) {
            var cntnt = fs.readFileSync(source + "\\" + filename, "utf-8");
            try {
                cntnt = UglifyJS.minify(cntnt).code;
            } catch (e) {
                var terst = e;
            }
            fs.writeFileSync(projectFolder + "minified\\" + folder + filename, cntnt);
        }
        else {
            fs.writeFileSync(projectFolder + "minified\\" + folder + filename, fs.readFileSync(source + "\\" + filename));
        }

    }
    //Client changes solution options 
    // data = solution options JSON
    client.on("solutionOptions", function (data) {
        try {
            fs.writeFileSync(data.dir + "solution\\solutionOptions.json", JSON.stringify(data));
        } catch (e) {

        }
    });
    //Asset hierarch changed
    // data = {folder :"The folder of asset before change",newFolder:"Where it is moved", name:" Asset name.extension without folder"
    client.on("fileMoved", function (data) {
        try {
            var from = path.resolve(projectFolder + "public\\assets\\" + data.folder.substring(1), data.name);
            var target = path.resolve(projectFolder + "public\\assets\\" + data.newFolder.substring(1), data.name);
            addUndo(function (from, target) {
                fs.renameSync(target, from)
                emitAssets(client, [from]);
            }, [from, target], function (from, target) {
                fs.renameSync(from, target)
                emitAssets(client, [target]);
            }, client);

        } catch (e) {
        }

    });
    //Trigger undo if available
    client.on("undo", function () {
        undo(client);
    });
    //Trigger redo if available
    client.on("redo", function () {
        reDo(client);
    });
    //Create asset folder
    // data = {folder: "Where new folder created",name:"New Folder's name"}
    client.on("AddDirectory", function (data) {
        try {

            data.name = data.name.replace(/ /g, '');
            var dir = path.resolve(projectFolder + "public\\assets" + data.folder + "\\" + data.name);

            addUndo(function (dir) {
                fs.rmdirSync(dir);
                emitAssets(client, []);
            }, [dir], function (dir) {
                fs.mkdirSync(dir);
                emitAssets(client, []);
            }, client);

        } catch (e) {
        }
    });
    //Rename asset
    // data = {folder:"Asset's folder path" , name :"Asset's name before change", newName :"Asset's name after change" }
    client.on("fileRename", function (data) {
        try {

            data.newName = data.newName.replace(/ /g, '');
            var from = path.resolve(projectFolder + "public\\assets\\" + data.folder.substring(1), data.name);
            var target = path.resolve(projectFolder + "public\\assets\\" + data.folder.substring(1), data.newName);

            addUndo(function (from, target) {
                fs.renameSync(target, from)
                emitAssets(client, [from]);
            }, [from, target], function (from, target) {
                fs.renameSync(from, target)
                emitAssets(client, [target]);
            }, client);

        } catch (e) {
        }

    });
    // Delete asset
    // data = {folder:"Asset's folder path" , name :"Asset's name"}
    client.on("deleteFile", function (data) {
        try {
            var from = path.resolve(projectFolder + "public\\assets\\" + data.folder.substring(1), data.name);
            var target1 = path.resolve(projectFolder + "thrash\\", data.folder.substring(1).replace(/\\/g, "_") + "_" + data.name);
            var target = target1;
            var i = 0;
            while (fs.existsSync(target)) {
                target = target1 + i;
                i++;
            }

            addUndo(function (from, target) {
                fs.renameSync(target, from)
                emitAssets(client, [from]);
            }, [from, target], function (from, target) {
                fs.renameSync(from, target)
                emitAssets(client, []);
            }, client);

        } catch (e) {
        }

    });
    //Create or override scene data with current gameobject states
    client.on("SaveScene", function (data) {
        try {
            var from = path.resolve(projectFolder + "public\\assets\\", data);
            fs.writeFileSync(from, JSON.stringify(gameobjects));
            emitAssets(client, [from]);
        } catch (e) {

        }
    });
    //Import plugin 
    //data :{"Asset name that needs to be included in plugin":true, "Asset name that needs to be excluded in plugin":false}
    client.on("ImportPlugin", function (data) {
        for (var i in data) {
            if (data[i] == true)
                try {
                    importPlugin(i);
                    var arr = new Array();
                    for (var j in plugins[data["Plugin Name"]]) {
                        if (plugins[data["Plugin Name"]][j] == true)
                            arr.push(projectFolder + "public\\assets\\" + j);
                    }
                    emitAssets(client, arr);
                } catch (e) {

                }
        }

    });
    client.on("ExportPluginFile", function (data) {

        client.emit("eval", "window.location=window.location.origin+'/plugins/" + data + ".zip'");


    });

    //When existing plugin overriden this fucktion changes differences
    function CheckPlugin(client, data, retval) {
        var zip = new AdmZip("plugins\\" + data["Plugin Name"] + ".zip");
        var folder = projectFolder + "temp\\";
        if (!fs.existsSync(folder))
            fs.mkdirSync(folder);
        else {
            wrench.rmdirSyncRecursive(folder, true);
            fs.mkdirSync(folder);
        }
        zip.extractAllTo(folder, true);
        var filesExisting = readDirectory(folder).map(i => {
            var rv = i.name.replace(folder, "");
            if (rv.startsWith("\\"))
                rv = rv.substring(1);
            return rv;
        });
        var newFiles = [];
        for (var i in data) {
            if (data[i] === true) {
                newFiles.push(i);
            }
        }
        for (var i = 0; i < filesExisting.length; i++) {
            var it = filesExisting[i];
            if (newFiles.indexOf(it) != -1) {
                var oldF = fs.readFileSync(folder + it, "utf-8");
                var newF = fs.readFileSync(projectFolder + "public\\assets\\" + it, "utf-8");
                if (oldF != newF) {
                    retval.changed[it] = {};

                }
            } else {
                retval.deleted[it] = {};
            }
        }
        for (var i = 0; i < newFiles.length; i++) {
            var it = newFiles[i];
            if (filesExisting.indexOf(it) == -1)
                retval.added[it] = {};
        }

    }
    //If existing plugin change contains file change; You can compare files with this.
    client.on("PluginChanges", function (data) {
        var folder = projectFolder + "temp\\";
        var oldF = fs.readFileSync(folder + data, "utf-8");
        var newF = fs.readFileSync(projectFolder + "public\\assets\\" + data, "utf-8");
        var args = {
            source: oldF,
            diff: newF,
            lang: "javascript",
            sourcelabel: "Old Version",
            difflabel: "New Version"

        };
        var output = prettydiff(args);
        client.emit("eval", "var htmlNEW=\"<div>\"+" + JSON.stringify(output) + '+"</div>";$(htmlNEW).dialog({modal:true,width:1000,height:800});');
    });

    client.on("SavePluginFile", function (data) {
        fs.writeFileSync(__dirname + "/plugins/" + data.name + ".zip", data.str);
        var newPlug = newPlugCreate(__dirname + "/plugins/" + data.name + ".zip");
        plugins[data.name] = newPlug;
        fs.writeFileSync("plugins\\pluginList.json", JSON.stringify(plugins));
        client.emit("pluginList", plugins);
    });
    function newPlugCreate(pth) {
        var retval = {};
        var zip = new AdmZip(pth); 
        var folder = projectFolder + "temp\\";
        if (!fs.existsSync(folder))
            fs.mkdirSync(folder);
        else {
            wrench.rmdirSyncRecursive(folder, true);
            fs.mkdirSync(folder);
        }
        zip.extractAllTo(folder, true);
        var filesExisting = readDirectory(folder).map(i => {
            var rv = i.name.replace(folder, "");
            if (rv.startsWith("\\"))
                rv = rv.substring(1);
            return rv;
        });
        for (var i = 0; i < filesExisting.length; i++) {
            retval[filesExisting[i]] = true;
        }
        return retval;
    }
    

    client.on("DeletePlugin", function (data) {
        delete plugins[data["Plugin Name"]];
        fs.writeFileSync("plugins\\pluginList.json", JSON.stringify(plugins));
        client.emit("pluginList", plugins);
    });
    //Create / Overwrite plugin
    client.on("SavePlugin", function (data) {
        var newPlug = {};
        var zip = new AdmZip();
        var fileName = "plugins\\" + data["Plugin Name"] + ".zip";
        var exists = fs.existsSync(fileName);
        if (exists && !data["Overwrite Existing Plugin"]) {
            var retval = {
                deleted: {},
                added: {},
                changed: {}
            };
            CheckPlugin(client, data, retval);
            if (propList(retval.added).length > 0 || propList(retval.changed).length > 0 || propList(retval.deleted).length > 0) {
                client.emit("changedPluginDetails", { data: data, retval: retval });
                return;
            }
        }
        for (var i in data) {
            if (i != "Plugin Name") {
                if (data[i] == true && i != "Overwrite Existing Plugin") {
                    var name = projectFolder + "public\\assets\\" + i;
                    var zipnames = i.split("\\");
                    var zipname = "";

                    for (var j = 0; j < zipnames.length - 1; j++) {
                        zipname = zipname + zipnames[j] + "\\";
                    }


                    zip.addLocalFile(name, zipname);
                    newPlug[i] = data[i];
                }
            }
        }
        zip.writeZip("plugins\\" + data["Plugin Name"] + ".zip");
        plugins[data["Plugin Name"]] = newPlug;
        fs.writeFileSync("plugins\\pluginList.json", JSON.stringify(plugins));
        client.emit("pluginList", plugins);
    });
    //Create new scene send changes to editor
    client.on("NewScene", function () {
        try {
            undos = [];
            redos = [];
            fs.writeFileSync(path.resolve(projectFolder + "undos", "undo.json"), JSON.stringify(undos));
            fs.writeFileSync(path.resolve(projectFolder + "undos", "redo.json"), JSON.stringify(redos));
            gameobjects = {};
            fs.writeFileSync(projectFolder + "properties\\properties.json", JSON.stringify(gameobjects));
            client.emit("refresh", gameobjects);
            currentScene = "";
            checkRedo(client);
        } catch (e) {

        }
    });

    //Open existing scene overwrite gameobjects array in server and client
    client.on("OpenScene", function (data) {
        try {
            undos = [];
            redos = [];
            fs.writeFileSync(path.resolve(projectFolder + "undos", "undo.json"), JSON.stringify(undos));
            fs.writeFileSync(path.resolve(projectFolder + "undos", "redo.json"), JSON.stringify(redos));
            var from = projectFolder + "public\\assets" + data;
            gameobjects = JSON.parse(fs.readFileSync(from));
            client.emit("refresh", gameobjects);
            fs.writeFileSync(projectFolder + "properties\\properties.json", JSON.stringify(gameobjects));
            currentScene = data;
            checkRedo(client);
        } catch (e) {

        }
    });
    //Create new Asset
    client.on("AddAsset", function (data) {
        try {
            data.name = data.name.replace(/[^0-9a-zA-Z\.]/g, '');
            var from = path.resolve(projectFolder + "public\\assets" + data.folder + "\\", data.name);
            fs.writeFileSync(from, data.text);
            emitAssets(client, [from]);
            redos = [];
            checkRedo(client);
        } catch (e) {

        }
    });
    //A game object changed (Component added, removed or property changes)
    // Property change data = {    action: "change",        name: "gameobject name", plugin: "Component Name", newval: {        value: NewValue    } }
    // Add component data = {    action: "addPlugin",        name: "gameobject name", plugin:  "Component Name", newval: defaultValuesObject }
    // Remove component data ={    action: "removePlugin",        name:  "gameobject name", plugin: "Component Name" }
    client.on('gameobject', function (data) {
        try {


            if (data.action == 'addPlugin') {
                addUndo(function (data) {
                    delete gameobjects[data.name][data.plugin];
                    if (!gameRunning)
                        fs.writeFile(projectFolder + "properties\\properties.json", JSON.stringify(gameobjects));
                    io.clients().emit("objectpropertieschange", { action: 'removePlugin', name: data.name, plugin: data.plugin });
                }, [data], function (data) {
                    gameobjects[data.name][data.plugin] = {};
                    for (var i in data.newval) {
                        for (var j in gameobjects) {
                            if (gameobjects[j].name.value == data.name) {
                                gameobjects[j][data.plugin][i] = data.newval[i];
                            }
                        }
                    }
                    if (!gameRunning)
                        fs.writeFile(projectFolder + "properties\\properties.json", JSON.stringify(gameobjects));
                    io.clients().emit("objectpropertieschange", data);
                }, client);
            }
            else if (data.action == "change") {

                addUndo(function (data, old) {

                    for (var i in old) {
                        if (data.plugin == "name" && data.newval.value)
                            gameobjects[data.newval.value][data.plugin][i] = old[i];
                        else
                            gameobjects[data.name][data.plugin][i] = old[i];
                    }
                    var newData = JSON.parse(JSON.stringify(data));
                    newData.newval = old;
                    if (data.plugin == "name" && data.newval.value) {
                        gameobjects[data.name] = gameobjects[data.newval.value];
                        delete gameobjects[data.newval.value];
                    }

                    if (!gameRunning)
                        fs.writeFile(projectFolder + "properties\\properties.json", JSON.stringify(gameobjects));
                    io.clients().emit("objectpropertieschange", newData);
                }, [data, JSON.parse(JSON.stringify(gameobjects[data.name][data.plugin]))], function (data) {
                    for (var i in data.newval) {
                        gameobjects[data.name][data.plugin][i] = data.newval[i];
                    }

                    if (data.plugin == "name" && data.newval.value) {
                        gameobjects[data.newval.value] = gameobjects[data.name];
                        delete gameobjects[data.name];
                    }

                    if (!gameRunning)
                        fs.writeFile(projectFolder + "properties\\properties.json", JSON.stringify(gameobjects));
                    io.sockets.emit("objectpropertieschange", data);
                }, client);
            }
            else if (data.action == "removePlugin") {
                for (var j in gameobjects) {
                    if (gameobjects[j].name.value == data.name) {
                        delete gameobjects[j][data.plugin];
                    }
                    if (!gameRunning)
                        fs.writeFile(projectFolder + "properties\\properties.json", JSON.stringify(gameobjects));
                    io.clients().emit("objectpropertieschange", data);
                }
            }
        } catch (e) {

        }

    });
    //Select game object
    client.on('selectgameobject', function (data) {
        io.clients().emit("gameobjectselected", data);
    });
    //Creates new empty gameobject
    client.on('addGameObject', function (data) {
        var obj = {};
        if (data && data.name && data.name.value) {
            obj = data;
            gameobjects[obj.name.value] = (obj);
        }
        else {
            var i = 0;
            while (i != -1) {
                var contains = false;
                for (var j in gameobjects) {
                    if (gameobjects[j].name.value == "GameObject" + i) {
                        contains = true;
                    }
                }
                if (!contains) {
                    obj = {
                        "name": { "value": "GameObject" + i },
                        "sprite": { "path": "" },
                        "position": {
                            "x": 0,
                            "y": 0,
                            "parent": ""
                        }
                    };
                    gameobjects[obj.name.value] = (Object.assign(obj, data));

                    i = -1;

                } else {
                    i++;
                }
            }
        }
        addUndo(function (obj) {
            delete gameobjects[obj.name.value];
            if (!gameRunning)
                fs.writeFile(projectFolder + "properties\\properties.json", JSON.stringify(gameobjects));
            io.clients().emit("deleteGameObjectDone", [obj.name.value]);
        }, [obj], function (obj) {

            if (!gameRunning)
                fs.writeFile(projectFolder + "properties\\properties.json", JSON.stringify(gameobjects));
            io.clients().emit("addGameObjectServer", [obj]);
        }, client);
    });
    //Delete game objects
    //data = gameobject name array to be deleted
    client.on('deleteGameObject', function (data) {
        try {
            var arr = data.map(i => {
                return {
                    name: i, obj: JSON.parse(JSON.stringify(gameobjects[i]))
                }
            });
            addUndo(function (data, arr) {
                for (var i = 0; i < arr.length; i++) {
                    var it = arr[i];
                    gameobjects[it.name] = (it.obj);
                }
                if (!gameRunning)
                    fs.writeFile(projectFolder + "properties\\properties.json", JSON.stringify(gameobjects));
                io.clients().emit("addGameObjectServer", arr.map(i => i.obj));
            }, [data, arr], function (data, arr) {
                for (var i = 0; i < arr.length; i++) {
                    var it = arr[i];
                    delete gameobjects[it.name];
                }
                if (!gameRunning)
                    fs.writeFile(projectFolder + "properties\\properties.json", JSON.stringify(gameobjects));
                io.clients().emit("deleteGameObjectDone", data);
            }, client);
        } catch (e) {

        }

    });
});
//Emit asset list to client 
function emitAssets(client, changedfiles) {
    var assetList = readDirectory(projectFolder + "public\\assets");
    for (var i = 0; i < assetList.length; i++) {
        if (assetList[i].name.endsWith(".js")) {
            if (changedfiles == undefined || changedfiles.indexOf(assetList[i].name) != -1)
                fs.readFile(assetList[i].name, 'utf-8', function (err, content) {
                    io.clients().emit("eval", content);
                });
        }
        assetList[i].name = assetList[i].name.replace(projectFolder, '').substring(14);
    }
    client.emit("assetList", assetList);
    assetListTemp = readDirectory(projectFolder + "public\\assets");

    assetListTemp = assetListTemp.sort(function (a, b) {
        if (a.name.indexOf("_standartAssets") != -1 && b.name.indexOf("_standartAssets") == -1)
            return -1;
        if (a.name.indexOf("_standartAssets") == -1 && b.name.indexOf("_standartAssets") != -1)
            return 1;

        if (a.onlyName < b.onlyName) return -1;
        if (a.onlyName > b.onlyName) return 1;
        return 0;
    });

    assetListClient = [];
    for (var i = 0; i < assetListTemp.length; i++) {
        var it = JSON.parse(JSON.stringify(assetListTemp[i]));
        it.name = it.name.replace(projectFolder, "");
        assetListClient.push(it);
    }

}
//Read directory contents recursively
function readDirectory(dir) {
    var list = fs.readdirSync(dir);
    var files = new Array();
    for (var i = 0; i < list.length; i++) {
        var file = path.resolve(dir, list[i]);
        var stat = fs.statSync(file);
        if (!stat.isDirectory())
            files.push({ name: dir + "\\" + list[i], isFolder: false, folder: dir, onlyName: list[i] });
        else {
            var temp = readDirectory(dir + "\\" + list[i]);
            if (temp == undefined || temp.length == 0) {
                files.push({ name: dir + "\\" + list[i], isFolder: true });

            } else {
                for (var j in temp) {
                    files.push(temp[j]);
                }
            }
        }
    }
    return files;

}
var undoWriting = false;
//Execute undo
function undo(client) {
    try {

        var undo = undos.pop();
        var fn = eval("(" + undo.fun + ")");
        fn.apply(this, undo.args);
        if (settings.connectedVisualStudio == true) {
            exportGame();
            copyVS();
        }
        fs.writeFileSync(path.resolve(projectFolder + "undos", "undo.json"), JSON.stringify(undos));
        redos.push(undo);
        fs.writeFileSync(path.resolve(projectFolder + "undos", "redo.json"), JSON.stringify(redos));

        checkRedo(client);
    } catch (e) {
        console.log(e);
    }

}
//Execute redo
function reDo(client) {
    try {

        var undo = redos.pop();
        var fn = eval("(" + undo.redo + ")");
        fn.apply(this, undo.args);
        if (settings.connectedVisualStudio == true) {
            exportGame();
            copyVS();
        }

        fs.writeFileSync(path.resolve(projectFolder + "undos", "redo.json"), JSON.stringify(redos));
        undos.push(undo);
        fs.writeFileSync(path.resolve(projectFolder + "undos", "undo.json"), JSON.stringify(undos));
        checkRedo(client);

    } catch (e) {
        console.log(e);

    }

}
//Check redo or undo is available
function checkRedo(client) {
    if (redos.length > 0)
        client.emit("redoActive", true);
    else
        client.emit("redoActive", false);
    if (undos.length > 0)
        client.emit("undoActive", true);
    else
        client.emit("undoActive", false);
}
//Executes current action and pushes new undo function to list
function addUndo(fun, args, redo, client) {
    try {
        if (redo) {
            redo.apply(this, args);
            if (settings.connectedVisualStudio == true) {
                exportGame();
                copyVS();
            }
        }
        if (undos.length > 500) {
            undos.splice(undos.length - 500);
        }


        undos.push({ fun: fun.toString(), args: args, redo: redo.toString() });
        fs.writeFileSync(path.resolve(projectFolder + "undos", "undo.json"), JSON.stringify(undos));
        redos = [];
        fs.writeFileSync(path.resolve(projectFolder + "undos", "redo.json"), JSON.stringify(redos));
        checkRedo(client);

    } catch (e) {
        console.log(e);

    }
}
var imageFormats = ["BMP", "GIF", "IMG", "JBG", "JPE", "JPEG", "JPG", "PNG", "RAS", "TGA", "TIFF", "SVG"];
var soundFormats = ["WAV", "MP3", "OGG"];
var isImage = function (fullname) {
    for (var i in imageFormats) {
        if (fullname.toUpperCase().endsWith(imageFormats[i])) {
            return true;
        }
    }
}
var isSound = function (fullname) {
    for (var i in soundFormats) {
        if (fullname.toUpperCase().endsWith(soundFormats[i])) {
            return true;
        }
    }
}

//var childProc = require('child_process');
//var exec = require('child_process').exec;
//exec('start "Google Chrome" http://localhost:8989', function () { });

//import plugin
function importPlugin(name) {

    var zip = new AdmZip("plugins\\" + name + ".zip");
    zip.extractAllTo(projectFolder + "public\\assets\\", true);

}
//Creates new visual studio SLN file as text
function visualStudioSLN() {
    return '\n' +
        'Microsoft Visual Studio Solution File, Format Version 12.00\n' +
        '# Visual Studio 12\n' +
        'VisualStudioVersion = 15.0.26228.4\n' +
        'MinimumVisualStudioVersion = 10.0.40219.1\n' +
        'Project("{E24C65DC-7377-472B-9ABA-BC803B73C61A}") = "public", "public\", "{FCB4F73E-7DB3-472F-BD39-CE78448E9E2C}"\n' +
        '	ProjectSection(WebsiteProperties) = preProject\n' +
        '		TargetFrameworkMoniker = ".NETFramework,Version%3Dv4.0"\n' +
        '		Debug.AspNetCompiler.VirtualPath = "/localhost_57878"\n' +
        '		Debug.AspNetCompiler.PhysicalPath = "..\..\..\..\..\..\endlessRunner\public\"\n' +
        '		Debug.AspNetCompiler.TargetPath = "PrecompiledWeb\localhost_57878\"\n' +
        '		Debug.AspNetCompiler.Updateable = "true"\n' +
        '		Debug.AspNetCompiler.ForceOverwrite = "true"\n' +
        '		Debug.AspNetCompiler.FixedNames = "false"\n' +
        '		Debug.AspNetCompiler.Debug = "True"\n' +
        '		Release.AspNetCompiler.VirtualPath = "/localhost_57878"\n' +
        '		Release.AspNetCompiler.PhysicalPath = "..\..\..\..\..\..\endlessRunner\public\"\n' +
        '		Release.AspNetCompiler.TargetPath = "PrecompiledWeb\localhost_57878\"\n' +
        '		Release.AspNetCompiler.Updateable = "true"\n' +
        '		Release.AspNetCompiler.ForceOverwrite = "true"\n' +
        '		Release.AspNetCompiler.FixedNames = "false"\n' +
        '		Release.AspNetCompiler.Debug = "False"\n' +
        '		VWDPort = "57878"\n' +
        '	EndProjectSection\n' +
        'EndProject\n' +
        'Global\n' +
        '	GlobalSection(SolutionConfigurationPlatforms) = preSolution\n' +
        '		Debug|Any CPU = Debug|Any CPU\n' +
        '	EndGlobalSection\n' +
        '	GlobalSection(ProjectConfigurationPlatforms) = postSolution\n' +
        '		{FCB4F73E-7DB3-472F-BD39-CE78448E9E2C}.Debug|Any CPU.ActiveCfg = Debug|Any CPU\n' +
        '		{FCB4F73E-7DB3-472F-BD39-CE78448E9E2C}.Debug|Any CPU.Build.0 = Debug|Any CPU\n' +
        '	EndGlobalSection\n' +
        '	GlobalSection(SolutionProperties) = preSolution\n' +
        '		HideSolutionNode = FALSE\n' +
        '	EndGlobalSection\n' +
        'EndGlobal\n'


}
//Creates new visual studio Config file as text
function visualStudioConfig() {
    return '<?xml version="1.0"?>\n' +
        '<configuration>\n' +
        '  <system.web>\n' +
        '    <compilation debug="true" targetFramework="4.0"/>\n' +
        '  </system.web>\n' +
        '</configuration>\n';
}
function copyVS() {
    //Creates copy of important files needed to run game and not included in standart assets
    fs.writeFileSync(projectFolder + "public\\index.html", fs.readFileSync("public\\export.html", "utf-8"));
    fs.writeFileSync(projectFolder + "public\\exportProperties.js", fs.readFileSync("public\\exportProperties.js", "utf-8"));
    fs.writeFileSync(projectFolder + "public\\export.js", fs.readFileSync("public\\export.js", "utf-8"));
    fs.writeFileSync(projectFolder + "public\\jquery-3.2.1.js", fs.readFileSync("public\\jquery-3.2.1.js", "utf-8"));
}
//Creates game HTML and simple javascript
function exportGame() {
    var prefabs = {};
    for (var i in assetListTemp) {
        if (assetListTemp[i].name.endsWith(".prefab")) {
            var pref = fs.readFileSync(assetListTemp[i].name);
            prefabs[assetListTemp[i].name.replace(projectFolder, "").substring(14)] = JSON.parse(pref);
        }
    }
    var assetsToExport = [];
    for (var i = 0; i < assetListClient.length; i++) {
        if (assetListClient[i].name.indexOf(".prefab") == -1) {
            assetsToExport.push(assetListClient[i]);
        }
    }
    var js = "";
    if (currentScene) {
        var scn = currentScene.startsWith("\\") ? currentScene.substr(1) : currentScene;
        js = "var currentSceneName='" + scn + "';\n";
    }
    for (var i = 0; i < assetListClient.length; i++) {
        if (assetListClient[i].name.indexOf(".ttf") != -1) {

            js += "$(\"<style> @font-face {  -webkit-font-smoothing: none;   font-family: "
                + assetListClient[i].name.replace("public\\assets\\", "").replace(/\./, "").replace(/\//, "").replace(/\\/, "")
                + ";    src: url('"
                + assetListClient[i].name.replace("public\\", "").replace(/\\/, "/") + "') }</style>\").appendTo('head');"
            js += "\n";
        }
    }
    js += "var data=" + JSON.stringify({ GO: gameobjects, assetList: assetsToExport, prefabs: prefabs, settings: settings, sceneOrder: sceneOrder });


    fs.writeFileSync("public\\exportProperties.js", js);
    var html = '<html xmlns="http://www.w3.org/1999/xhtml">\n' +
        '<head>\n' +
        '<meta charset="utf-8" />\n' +
        '<meta name="viewport" content="width=device-width; initial-scale=0.5; maximum-scale=0.5; "> \n' +
        '<title></title>\n' +
        '<script src="jquery-3.2.1.js"></script>\n' +
        '<script src="exportProperties.js"></script>\n' +
        '<script src="export.js"></script>\n';

    for (var i = 0; i < assetListClient.length; i++) {
        if (assetListClient[i].name.endsWith(".js") && assetListClient[i].name.indexOf(".editorOnly") == "-1") {
            html += '<script src="' + assetListClient[i].name.substring(7) + '"></script>\n';
            //compressor.minify({
            //    compressor: 'uglifyjs',
            //    input: projectFolder +assetListClient[i].name,
            //    output: projectFolder + assetListClient[i].name,
            //    callback: function (err, min) {
            //        var aa = err;
            //    }
            //});

        }
    }

    html += '</head>\n' +
        '<body style="margin-top: 0px;margin-right: 0px;margin-bottom: 0px;margin-left: 0px;overflow-x:hidden;overflow-y:hidden;">\n' +
        '<meta name="apple-mobile-web-app-capable" content="yes">\n' +
        '<div  style="margin-top: 0px;margin-right: 0px;margin-bottom: 0px;margin-left: 0px;display:block" id="game"></div>\n' +
        '</body>\n' +
        '</html>\n';
    fs.writeFileSync("public\\export.html", html);
}

function propList(obj) {
    var r = [];
    if (typeof (obj) == "object") {
        for (var i in obj) {
            r.push(i);
        }
    }
    return r;
}