function soundOff() {
    soundoff = true;
    var snd = GetComponents("Sound");
    for (var i = 0; i < snd.length; i++) {
        var s = snd[i];
        s.Stop();
    }
}
function soundOn() {
    soundoff = false;
}
var soundoff = false;
gm.Sound = function () {
    this.comboBoxes = {};
    this.path = "";
    this.autoPlay = true;
    this.Loop = true;
    this.volume = 100;
    this.reloadInEditor = { path: true }
    this.onFinish = [];
    this.customDiv = {
        centerMe: function (container) {
            var $this = this;
            addMenu("<i class='glyphicon glyphicon-play' />", function () {

                var snd = resources[$this.path].sound;
                if (snd.isPlaying) {
                    snd.stop();
                    $(".btnPlaySound").html("<i class='glyphicon glyphicon-play' />");
                }
                else {
                    snd.play(function () {
                        $(".btnPlaySound").html("<i class='glyphicon glyphicon-play' />");
                    });
                    $(".btnPlaySound").html("<i class='glyphicon glyphicon-stop' />");
                }
            }, "", container, "btnPlaySound");
        }
    }
    this.Play = function () {
        if (!soundoff) {
            this.snd = resources[this.path].sound;
            this.snd.volume = this.volume / 100;
            var $this = this;
            this.snd.play(function () {
                if ($this.onFinish != undefined)
                    for (var i = 0; i < $this.onFinish.length; i++) {
                        $this.onFinish[i]($this);
                    }
                if ($this.Loop)
                    $this.Play();
            });
        } else {
            var $this = this;
            if ($this.onFinish != undefined)
                for (var i = 0; i < $this.onFinish.length; i++) {
                    $this.onFinish[i]($this);
                }
        }
    }
    this.Stop = function () {
        var snd = this.snd;
        if (snd != undefined && snd.isPlaying == true) {
            snd.stop();
            if (this.onFinish != undefined)
                for (var i = 0; i < this.onFinish.length; i++) {
                    this.onFinish[i]($this);
                }
        }
    }
    if ("assetList" in window) {
        this.comboBoxes.path = new Array();
        for (var i = 0; i < assetList.length; i++) {
            if (assetList[i].isFolder == false && isSound(assetList[i].name))
                this.comboBoxes.path.push({
                    text: assetList[i].name, value: assetList[i].name
                })
        }
    }
}
gm.Sound.prototype.create = function () {
    if (this.autoPlay) {
        this.Play();
    }
}
gm.Sound.prototype.update = function (dt) {
    if (this.snd && this.snd.isPlaying == true) {
        this.snd.volume = this.volume / 100;
    }
}
gm.Sound.prototype.dispose = function () {

}
