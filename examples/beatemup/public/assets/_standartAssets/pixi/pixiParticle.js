
gm.particle = function () {
    this.particles = [];
    this.maxLife = 5;
    this.minSpeed = 10;
    this.maxSpeed = 10;
    this.velocityX = 0;
    this.velocityY = 0;
    this.velocityRandomness = 0;
    this.startSize = 0.01;
    this.endSize = 0.1;
    this.minRotation = 0;
    this.maxRotation = 720;
    this.maxRotationRandomness = 360;
    this.maxParticle = 100;
    this.particleSpawnSpeed = 5;
    this.tintByLife = "['#ffff00','#ff0000']";
    this.private = { timer: true };

    this.path = "";
    this.AnimationSpeed = 0.5;
    $this = this;
    newObservable(this, "AnimationSpeed", undefined, function (val, object) {
        try {
            object.sprite.animationSpeed = parseFloat(object.AnimationSpeed);
        } catch (e) {

        }
    });
    this.worksInEditor = true;
    this.reloadInEditor = { path: true, isText: true }
    this.comboBoxes = {};
    if ("assetList" in window) {
        this.comboBoxes.path = new Array();
        for (var i = 0; i < assetList.length; i++) {
            if (assetList[i].isFolder == false && (isImage(assetList[i].name) || assetList[i].name.endsWith(".anim")))
                this.comboBoxes.path.push({
                    text: assetList[i].name, value: assetList[i].name
                })
        }
    }
    this.getSprite = function () {
        try {
            if (this.path.endsWith("anim")) {
                var arr = new Array();
                var lst = JSON.parse(resources[this.path].data);
                for (var i in lst) {
                    arr.push(resources[lst[i]].texture);
                }
                var sprite = new PIXI.extras.AnimatedSprite(arr);
                sprite.animationSpeed = parseFloat(this.AnimationSpeed);
                if (!INEDITOR)
                    sprite.play();

                return sprite;

            } else
                return new PIXI.extras.AnimatedSprite([resources[this.path].texture]);
        } catch (e) {
            return { anchor: {} };
        }
    }
    this.create = function () {
        this.color = ['#ffffff'];
        try {
            this.color = JSON.parse(this.tintByLife.replace(/'/g, '"'));
        } catch (e) {

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
    }
    this.timer = 0;
    this.update = function (dt) {
        dt = dt / 100;
        if (this.timer < 0.5)
            this.timer += dt;
        if (!INEDITOR || selectedSprite == this.gameObject) {
            if (this.particles.length < parseInt(this.maxParticle)) {
                this.spawnNewPartice(dt);
            }
            this.changeParticles(dt);
        }
    }
    this.changeParticles = function (dt) {
        var remove = new Array();
        for (var i = 0; i < this.particles.length; i++) {
            (function (i, $this, remove, dt) {
                var p = $this.particles[i];
                var newspeedx = p.speedx + parseFloat($this.velocityX) * dt;
                var newspeedy = p.speedy + parseFloat($this.velocityY) * dt;
                var newspeed = Math.sqrt(newspeedx * newspeedx + newspeedy * newspeedy);

                if (newspeed < $this.maxSpeed) {
                    p.speedx = newspeedx;
                    p.speedy = newspeedy;
                }
                p.sprite.x += p.speedx * dt;
                p.sprite.y += p.speedy * dt;
                var scale = parseFloat($this.startSize) + (parseFloat($this.endSize) - parseFloat($this.startSize)) * parseFloat(p.life) / parseFloat($this.maxLife);
                p.sprite.width = p.oWidth * scale;
                p.sprite.height = p.oHeight * scale;
                p.sprite.rotation = p.minRotation + (p.maxRotation - p.minRotation) * p.life / parseFloat($this.maxLife);
                if ($this.color.length > 1) {
                    p.sprite.tint = colorFind(p.life, parseFloat($this.maxLife), $this.color);
                }
                p.life += dt;
                if ($this.maxLife != 0) {
                    if (p.life > $this.maxLife) {
                        remove.push(i);
                    }

                }
            })(i, this, remove, dt);
        };
        for (var i = 0; i < remove.length; i++) {

            this.gameObject.position.container.removeChild(this.particles[remove[i]].sprite);
            this.particles.splice(remove[i], 1);
        }
    }
    this.spawnNewPartice = function (dt) {
        this.timer += dt;
        var spCount = parseInt(this.particleSpawnSpeed);
        var spFloat = spCount * this.timer;
        if (spFloat > 1)
            this.timer = 0;
        else
            return;
        var spawn = Math.floor(spFloat);
        if (spawn > (this.maxParticle - this.particles.length))
            spawn = this.maxParticle - this.particles.length;
        for (var i = 0; i < spawn; i++) {
            var sprite = this.getSprite();
            var me = {
                sprite: sprite,
                speed: Math.random() * (parseFloat(this.maxSpeed) - parseFloat(this.minSpeed)) + parseFloat(this.minSpeed),
                angle: Math.random() * 2 * Math.PI,
                size: parseFloat(this.startSize),
                color: this.color[0],
                x: 0,
                y: 0,
                life: 0,
                oWidth: sprite.width,
                oHeight: sprite.height,
                maxRotation: (parseFloat(this.maxRotation) + parseFloat(this.maxRotationRandomness) - Math.random() * 2 * parseFloat(this.maxRotationRandomness)) * Math.PI / 180,
                minRotation: this.minRotation * Math.PI / 180


            }
            me.speedx = me.speed * Math.cos(me.angle);
            me.speedy = me.speed * Math.sin(me.angle);
            this.particles.push(me);
            sprite.x = this.gameObject.position.getScreenX();
            sprite.y = this.gameObject.position.getScreenY();
            sprite.anchor.y = 0.5;
            sprite.anchor.x = 0.5;
            sprite.width = me.oWidth * this.startSize;
            sprite.height = me.oHeight * this.startSize;
            sprite.tint = parseInt("0x" + this.color[0].replace('#', ''));
            this.gameObject.position.container.addChild(me.sprite);
        }

    }
    this.dispose = function () {
        try {

            for (var i = 0; i < this.particles.length; i++) {
                gameContainer.removeChild(this.particles[i].sprite);
                if (this.particles[i].sprite.destroy)
                    this.particles[i].sprite.destroy();
            }

        } catch (e) {

        }
        delete this.sprite;
    }

}

function colorFind(life, maxlife, colors, coef1) {
    try {

        var len = colors.length;
        var pieceLen = maxlife / (len - 1);
        for (var j = 0; j < (len - 1); j++) {
            if (life >= j * pieceLen && life < (j + 1) * pieceLen) {

                var coef = (life - pieceLen * j) / pieceLen;
                var c1 = colors[j];
                var c2 = colors[j + 1];
                var r = parseInt(parseInt("0x" + c1.substr(1, 2)) * (1 - coef) + parseInt("0x" + c2.substr(1, 2)) * coef);
                var g = parseInt(parseInt("0x" + c1.substr(3, 2)) * (1 - coef) + parseInt("0x" + c2.substr(3, 2)) * coef);
                var b = parseInt(parseInt("0x" + c1.substr(5, 2)) * (1 - coef) + parseInt("0x" + c2.substr(5, 2)) * coef);
                return parseInt(0x010000 * r + 0x000100 * g + 0x000001 * b)
            }
        }
        return parseInt("0x" + colors[colors.length - 1].substr(1));
    } catch (e) {

        return 0xffffff;
    }
}