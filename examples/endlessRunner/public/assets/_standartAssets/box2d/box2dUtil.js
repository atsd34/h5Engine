window.PhysicsInitialized = false;
console.log("using box2d");
//p2 and box2d physics are very simmiliar
gm.Physics = function () {
//Liquid variables
    this.isLiquid = false;
    this.maxParticleInOneFrame = 50;
    this.particleRadius = 5;
    this.particleType = box2d.b2ParticleFlag.b2_waterParticle;
    this.particleImage = "";
    this.particleImageShadow = 5;
    this.particleImageShadows = [];
    this.particleImageWidth = 16;
//quick drawing objects
    this.debugDraw = false;
    this.fillColor = "FFFFFF";
    this.lineColor = "000000";

    this.reloadInEditor = { reloadME: true }
    this.reloadME = 0;
    this.previousType = undefined;
    this.worksInEditor = true;
    this.dontSerialize = { Editing: true, reloadME: true, selectedVerticesIndex: true }
    this.serializeObject = { vertices: true }
 //concave are handled with decomp.js
    this.comboBoxes = {
        colliderType: ["box", "circle", "polygon", "concave"],
        particleType: [{ text: "Water", value: box2d.b2ParticleFlag.b2_waterParticle }
            , { text: "Spring", value: box2d.b2ParticleFlag.b2_springParticle }
            , { text: "Elastic", value: box2d.b2ParticleFlag.b2_elasticParticle }
            , { text: "Viscous", value: box2d.b2ParticleFlag.b2_viscousParticle }
            , { text: "Tensile", value: box2d.b2ParticleFlag.b2_tensileParticle }
            , { text: "Wall", value: box2d.b2ParticleFlag.b2_wallParticle }
        ]
    };
    //Liquid image
    if ("assetList" in window) {
        this.comboBoxes.particleImage = new Array();
        for (var i = 0; i < assetList.length; i++) {
            if (assetList[i].isFolder == false && (isImage(assetList[i].name) || assetList[i].name.endsWith(".anim")))
                this.comboBoxes.particleImage.push({
                    text: assetList[i].name, value: assetList[i].name
                })
        }
    }
    this.colliderType = "box";
    this.private = { preX: true, preY: true, preRot: true, angle: true, Editing: true, reloadME: true };
    this.radius = 1;
    this.width = 0;
    this.height = 0;
    this.damping = 0.1;
    this.friction = 0;
    this.restitution = 0;
    this.density = 5;
    this.preX = 0;
    this.preY = 0;
    this.preRot = 0;
    this.static = false;
    this.isLiquid = false;
    this.isSensor = false;
    this.isBullet = false;
    this.fixedRotation = false;
    this.angle = 0;
    this.Editing = false;
    this.bodyDifference = { x: 0, y: 0 }
    this.vertices = [{ x: -50, y: -50 },
    { x: 50, y: -50, c: 0x00ff00 },
    { x: 50, y: 50 },
    { x: -50, y: 50 }]
    this.resetBox = function () {
        this.width = this.gameObject.position.width;
        this.height = this.gameObject.position.height;
        this.colliderType = "box";
        this.vertices = [{ x: -50, y: -50 },
        { x: 50, y: -50, c: 0x00ff00 },
        { x: 0, y: 50 }];
        var go = goBack(this.gameObject);
        socketemit("gameobject", { action: "change", name: this.gameObject.name.value, plugin: "Physics", newval: go.Physics });
    }
    this.customDiv = {
        centerMe: function (container) {
            var $this = this;
            addMenu("Reset BOX", function () {
                $this.resetBox();
            }, "", container, "");
            addMenu("Edit", function () {
                $(".btnPhysicsEdit").removeClass("btn-danger");
                if ($this.Editing != true) {
                    $this.Editing = true;
                    lockedSelection = true;
                    $(".btnPhysicsEdit").html('Stop');
                    $(".btnPhysicsEdit").addClass("btn-danger");
                }
                else {
                    lockedSelection = false;
                    $this.Editing = false;
                    $(".btnPhysicsEdit").html('Edit');
                    var go = goBack($this.gameObject);
                    socketemit("gameobject", { action: "change", name: $this.gameObject.name.value, plugin: "Physics", newval: go.Physics });
                }
            }, "", container, "btnPhysicsEdit");
            if (this.Editing == true) {
                $(".btnPhysicsEdit").html('Stop');
                $(".btnPhysicsEdit").addClass("btn-danger");
            }
        }
    }
}
//Update shown/hidden properties depending liquid/shape
gm.Physics.prototype.editorPrivates = function () {
    this.private.selectedVerticesIndex = true;
    if (this.isLiquid) {
        this.private.friction = true;
        this.private.restitution = true;
        this.private.static = true;
        this.private.isSensor = true;
        this.private.isBullet = true;
        this.private.fixedRotation = true;
        this.private.debugDraw = true;
        this.debugDraw = false;

        this.private.particleRadius = false;
        this.private.particleType = false;
        this.private.particleImage = false;
        this.private.particleImageWidth = false;
        this.private.particleImageShadow = false;
        this.private.maxParticleInOneFrame = false;
        
    } else {
        this.private.friction = false;
        this.private.restitution = false;
        this.private.static = false;
        this.private.isSensor = false;
        this.private.isBullet = false;
        this.private.fixedRotation = false;
        this.private.debugDraw = false;

        this.private.particleRadius = true;
        this.private.particleType = true;
        this.private.particleImage = true;
        this.private.particleImageWidth = true;
        this.private.particleImageShadow = true;
        this.private.maxParticleInOneFrame = true;

    }
    if (this.colliderType == "box") {
        this.private.radius = true;
        this.private.width = false;
        this.private.height = false;
        if (selectedSprite == this.gameObject) {
            var JSONReadyGO = goBack(selectedSprite);
            socketemit("selectgameobject", JSONReadyGO);
        }
    }
    else if (this.colliderType == "circle") {
        this.private.width = true;
        this.private.height = true;
        this.private.radius = false;
        if (selectedSprite == this.gameObject) {
            var JSONReadyGO = goBack(selectedSprite);
            socketemit("selectgameobject", JSONReadyGO);
        }
    }
    else if (this.colliderType == "polygon" || this.colliderType == "concave") {
        this.private.width = true;
        this.private.height = true;
        this.private.radius = true;
        if (selectedSprite == this.gameObject) {
            var JSONReadyGO = goBack(selectedSprite);
            socketemit("selectgameobject", JSONReadyGO);
        }
    }

}
//Create physics body with box2d mwthods
gm.Physics.prototype.createBody = function () {
    if (this.isLiquid) {

        var particleSystemDef = new box2d.b2ParticleSystemDef()
        this.m_particleSystem = world.CreateParticleSystem(particleSystemDef);
        this.m_particleSystem.SetDensity(this.density);
        this.m_particleSystem.SetRadius(this.particleRadius);
        this.m_particleSystem.SetDamping(this.damping);
        this.pd = new box2d.b2ParticleGroupDef();
        this.pd.flags = this.particleType;

    }
    switch (this.colliderType) {
        case "box":

            var shape;
            var shape = new box2d.b2PolygonShape();
            shape.SetAsBox(this.width * Math.abs(this.gameObject.position.scaleX) / 2, this.height * Math.abs(this.gameObject.position.scaleY) / 2, new box2d.b2Vec2, 0.0);

            if (this.isLiquid) {
                this.pd.position = new box2d.b2Vec2(this.gameObject.position.getX(),
                    this.gameObject.position.getY());
                this.pd.shape = shape;
                this.group = this.m_particleSystem.CreateParticleGroup(this.pd);
            }
            else {
                var fd = new box2d.b2FixtureDef();
                fd.density = this.density;
                fd.shape = shape;
                this.body.CreateFixture(fd);
            }
            break;
        case "circle":
            var shape;
            var shape = new box2d.b2CircleShape();
            shape.m_p.Copy(new box2d.b2Vec2(0, 0));
            shape.m_radius = this.radius * this.gameObject.position.scaleX;
            if (this.isLiquid) {
                this.pd.position = new box2d.b2Vec2(this.gameObject.position.getX(),
                    this.gameObject.position.getY());
                this.pd.shape = shape;
                this.group = this.m_particleSystem.CreateParticleGroup(this.pd);
            }
            else {
                var fd = new box2d.b2FixtureDef();
                fd.density = this.density;
                fd.shape = shape;
                this.body.CreateFixture(fd);
            }
            break;
        case "polygon":
            var vertices = box2d.b2Vec2.MakeArray(this.vertices.length);
            for (var i = 0; i < this.vertices.length; i++) {
                vertices[i].Set(this.vertices[i].x * this.gameObject.position.scaleX, this.vertices[i].y * this.gameObject.position.scaleY);
            }
            
            AddPolygonShapeToBody(vertices, this.density, this.body, this.isLiquid, this);

            break;
        case "concave":
            var vertices = [];
            for (var i = 0; i < this.vertices.length; i++) {
                vertices[i] = [this.vertices[i].x, this.vertices[i].y];

            }
            //decomp only works with counter clockwise shapes
            decomp.makeCCW(vertices);
            //concave polygon divided into multiple convex
            var convexPolygons = decomp.quickDecomp(vertices);
            for (var i = 0; i < convexPolygons.length; i++) {
                var verticesB = box2d.b2Vec2.MakeArray(convexPolygons[i].length);
                for (var j = 0; j < convexPolygons[i].length; j++) {
                    verticesB[j].Set(convexPolygons[i][j][0] * this.gameObject.position.scaleX, convexPolygons[i][j][1] * this.gameObject.position.scaleY);
                }
                //1 body multiple polygon is supported by box2d
                AddPolygonShapeToBody(verticesB, this.density, this.body, this.isLiquid, this);

            }

            break;
        default:

    }

    if (!this.isLiquid) {
        this.body.gameObjectName = this.gameObject.name.value;
    }
}
function AddPolygonShapeToBody(vert, density, body, liquid, $this) {
    var shape = new box2d.b2PolygonShape();
    if (vert.length > box2d.b2_maxPolygonVertices) {
        var newvert = vert.splice(0, vert.length - box2d.b2_maxPolygonVertices);
        var start = new box2d.b2Vec2();
        start.Copy(vert[vert.length - 1]);
        newvert.splice(0, 0, start);
        var end = new box2d.b2Vec2();
        end.Copy(vert[0]);
        newvert.push(end);
        AddPolygonShapeToBody(newvert, density, body, liquid, $this)
    }
    shape.Set(vert, vert.length);
    if (liquid) {
        $this.pd.position = new box2d.b2Vec2($this.gameObject.position.getX(),
            $this.gameObject.position.getY());
        $this.pd.shape = shape;
        $this.group = $this.m_particleSystem.CreateParticleGroup($this.pd);

    } else {
        var fd = new box2d.b2FixtureDef();
        fd.density = density;
        fd.shape = shape;
        body.CreateFixture(fd);
    }
}
//observable component variables ,in case of changing body must be redefined
gm.Physics.prototype.changeAttributes = function () {
    var $this = this;
    newObservable(this, "colliderType", undefined, function () {
        $this.reloadME++;
    });
    newObservable(this, "isBullet", undefined, function () {
        setBody($this);
    });
    newObservable(this, "static", undefined, function () {
        setBody($this);
    })();
    function setBody($this1) {
        if ($this1.isBullet) {
            $this1.body.SetType(box2d.b2BodyType.b2_bulletBody);
        }
        else if ($this1.static)
            $this1.body.SetType(box2d.b2BodyType.b2_staticBody);
        else
            $this1.body.SetType(box2d.b2BodyType.b2_dynamicBody);

    }
    newObservable(this, "isSensor", undefined, function () {
        $this.body.m_fixtureList.SetSensor($this.isSensor);
    })();
    newObservable(this, "friction", undefined, function () {
        $this.body.m_fixtureList.SetFriction($this.friction);
    })();
    newObservable(this, "restitution", undefined, function () {
        $this.body.m_fixtureList.SetRestitution($this.restitution);
    })();
    newObservable(this, "density", undefined, function () {
        // $this.body.m_fixtureList.SetDensity( $this.density); //doesnt work
        $this.reloadME++;
    });
    newObservable(this, "fixedRotation", undefined, function () {
        $this.body.SetFixedRotation(false);
    })();
    newObservable(this, "debugDraw", undefined, function () {
        $this.reloadME++;
    })();

    newObservable(this, "velocityY", undefined, function () {
        var v = $this.body.GetLinearVelocity()
        $this.body.SetLinearVelocity(new box2d.b2Vec2(v.x, $this.velocityY));
    })();
    newObservable(this, "velocityX", undefined, function () {
        var v = $this.body.GetLinearVelocity()
        $this.body.SetLinearVelocity(new box2d.b2Vec2($this.velocityX, v.y));
    })();
    newObservable(this, "damping", undefined, function () {
        $this.body.m_linearDamping = parseFloat($this.damping);
    })();
}
gm.Physics.prototype.create = function () {
//In game
    if (!INEDITOR) {
        if (this.isLiquid) {
            this.liquidContainer = new PIXI.ParticleContainer();
            this.liquidContainer.zOrder = 999;
            gameContainer.addChild(this.liquidContainer);
        }
        //box2d bug workaround
        if (world.IsLocked()) {
            world.m_flag_locked = false;
        }
        //Solid
        if (!this.isLiquid) {
            var $this = this;
            this.gameObject.position.scaleXFunctions.Physics = function () {
                $this.reloadME++;
            }
            this.gameObject.position.scaleYFunctions.Physics = function () {
                $this.reloadME++;
            }
            var bd = new box2d.b2BodyDef();

            this.body = world.CreateBody(bd);
            this.body.SetPosition(new box2d.b2Vec2(this.gameObject.position.getX(), this.gameObject.position.getY()));
            this.preX = this.gameObject.position.getX();
            this.preY = this.gameObject.position.getY();
            this.body.SetAngle(this.gameObject.position.rotation * Math.PI / 180);
        }
        this.createBody();

        if (!this.isLiquid) {
            this.changeAttributes();
        }

        this.graphics = new PIXI.Graphics();
        //PIXI drawing
        if (this.debugDraw) {
            var fc = parseInt("0x" + this.fillColor);
            var lc = parseInt("0x" + this.lineColor);
            this.graphics.beginFill(fc, 1);

            if (this.colliderType == "box") {
                DrawBox(0, 0,
                    this.width, this.height,
                    0, this.graphics
                    , 0.5
                    , 0.5
                    , lc, 1, true, this.gameObject.position.container, true);
                this.gameObject.position.container.addChild(this.graphics);
            }
            if (this.colliderType == "circle") {
                DrawCircle(0, 0,
                    this.radius,
                    0, this.graphics
                    , 0.5
                    , 0.5
                    , lc, 1, this.gameObject.position.container, true);
            }
            if (this.colliderType == "polygon" || this.colliderType == "concave") {

                DrawPolygon(0, 0,
                    this.vertices,
                    0, this.graphics, lc, 1, false, this.gameObject.position.container);


            }

            this.graphics.endFill();
        }
    }
    else {
        if (this.width == 0 && this.height == 0 && this.colliderType == "box") {
            this.resetBox();
        }
        var $this = this;
        newObservable(this, "colliderType", undefined, function () {

            $this.editorPrivates();
        })();

        newObservable(this, "isLiquid", undefined, function () {

            $this.editorPrivates();
        })();

        newObservable(this, "debugDraw", undefined, function () {

            if ($this.debugDraw) {
                $this.private.fillColor = false;
                $this.private.lineColor = false;
            } else {

                $this.private.fillColor = true;
                $this.private.lineColor = true;
            }
            if (selectedSprite == $this.gameObject) {
                var JSONReadyGO = goBack(selectedSprite);
                socketemit("selectgameobject", JSONReadyGO);
            }
        })();
        this.selectedVerticesIndex = -1;
        //polygon painting
        this.mouseDown = function (m, e) {

            this.selectedVerticesIndex = -1;
            if (selectedSprite == this.gameObject && this.Editing) {
                for (var i = 0; i < this.vertices.length; i++) {
                    delete this.vertices[i].c;
                }
                for (var i = 0; i < this.vertices.length; i++) {
                    var v = this.vertices[i];
                    var dx = m.x - v.x - this.gameObject.position.x;
                    var dy = m.y - v.y - this.gameObject.position.y;
                    if (Math.sqrt(dx * dx + dy * dy) < 16) {
                        v.c = 0x00ff00;
                        this.selectedVerticesIndex = i;

                    }
                }
                if (this.selectedVerticesIndex == -1) {
                    for (var i = 0; i < this.vertices.length; i++) {
                        var v1 = this.vertices[i];
                        var v2;
                        if (i == this.vertices.length - 1)
                            v2 = this.vertices[0];
                        else
                            v2 = this.vertices[i + 1];
                        var dx1 = m.x - v1.x - this.gameObject.position.x;
                        var dy1 = m.y - v1.y - this.gameObject.position.y;
                        var dx2 = m.x - v2.x - this.gameObject.position.x;
                        var dy2 = m.y - v2.y - this.gameObject.position.y;
                        var dx = v1.x - v2.x;
                        var dy = v1.y - v2.y;
                        var len = Math.sqrt(dx * dx + dy * dy);
                        var len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
                        var len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                        if (Math.abs(len1 + len2 - len) < 16) {
                            ;
                            var vnew = {
                                x: parseInt(m.x - this.gameObject.position.x),
                                y: parseInt(m.y - this.gameObject.position.y),
                                c: 0x00ff00
                            }
                            this.vertices.splice(i + 1, 0, vnew);
                            this.selectedVerticesIndex = i + 1;
                            return;
                        }
                    }
                }

            }
        }
        this.mouseMove = function (m, e) {
            if (selectedSprite == this.gameObject && this.Editing && this.selectedVerticesIndex > -1) {
                this.vertices[this.selectedVerticesIndex].x = parseInt(m.x - this.gameObject.position.x);
                this.vertices[this.selectedVerticesIndex].y = parseInt(m.y - this.gameObject.position.y);
            }
        }
        this.mouseUp = function (m, e) {
            this.selectedVerticesIndex = -1;
        }

        this.graphics = new PIXI.Graphics();
    }

}
gm.Physics.prototype.update = function (dt) {

    if (!INEDITOR) {
        if (this.isLiquid) {
        //Update PIXI particle
            var preparedParticle = 0;
            var buff = this.m_particleSystem.m_positionBuffer.data
            for (var i = 0; i < this.m_particleSystem.m_count; i++) {

                if (this.particleImageShadow > 1) {
                    var sh = this.particleImageShadows[i];
                    if (sh == undefined) {
                        this.particleImageShadows[i] = new Array();
                        sh = this.particleImageShadows[i]
                    }
                    for (var j = 0; j < sh.length; j++) {
                            sh[j].g.width = this.particleImageWidth * (j * 0.3);
                            sh[j].g.height = this.particleImageWidth * (j * 0.3);
                        }

                    var s = {}
                    var add = false;
                    if (sh.length > this.particleImageShadow) {
                        var s = sh.splice(0, 1)[0];
                        sh.push(s);

                    } else {
                        s = {
                            g: new PIXI.Sprite(resources[this.particleImage].texture)
                        };
                        
                        s.g.anchor.x = 0.5;
                        s.g.anchor.y = 0.5;
                        sh.push(s);
                        add = true;
                        preparedParticle++;
                        if (preparedParticle >= this.maxParticleInOneFrame)
                            return;

                    }
                    s.g.x = buff[i].x;
                    s.g.y = buff[i].y;
                    s.g.width = this.particleImageWidth;
                    s.g.height = this.particleImageWidth;
                    if (add)
                        this.liquidContainer.addChild(s.g);
                } else {
                    var g = this.liquidContainer.children[i];
                    if (g == undefined) {
                        g = new PIXI.Sprite(resources[this.particleImage].texture);
                        g.width = this.particleImageWidth;
                        g.height = this.particleImageWidth;
                        this.liquidContainer.addChild(g);
                    }
                    g.x = buff[i].x;
                    g.y = buff[i].y;
                }
            }
            //if (this.m_particleSystem.m_count * this.particleImageShadow > this.liquidContainer.children.length) {
            //    for (var i = this.m_particleSystem.m_count; i < this.liquidContainer.children.length; i++) {
            //        var g = this.liquidContainer.children[i];
            //        this.liquidContainer.removeChild(g);
            //    }
            //}

        } else {
        //update gameObject.position according to physics simulation or vise versa
            var parentScaleX = this.gameObject.position.getParentScaleX();
            var parentScaleY = this.gameObject.position.getParentScaleY();
            var parentX = 0;
            var parentY = 0;
            if (this.gameObject.position.parent)
                parentX = objects[this.gameObject.position.parent].position.getX();
            if (this.gameObject.position.parent)
                parentY = objects[this.gameObject.position.parent].position.getY();
            var bodyPos = this.body.GetPosition();
            var bodyA = this.body.GetAngle();
            var changed = false;
            if (this.gameObject.position.getX() == this.preX)
                this.gameObject.position.x = bodyPos.x / parentScaleX - parentX;
            else {
                changed = true;
                var tempX = this.gameObject.position.getX();
                this.body.SetPosition(new box2d.b2Vec2(tempX, bodyPos.y));
                bodyPos.x = tempX;
            }
            if (this.gameObject.position.getY() == this.preY)
                this.gameObject.position.y = bodyPos.y / parentScaleY - parentY;
            else {
                this.body.SetPosition(new box2d.b2Vec2(bodyPos.x, this.gameObject.position.getY()));
                changed = true;
            }
            if (this.gameObject.position.rotation == this.preRot) {
                this.gameObject.position.rotation = bodyA * 180 / Math.PI;
            }
            else {
                this.body.SetAngle(this.gameObject.position.rotation * Math.PI / 180);
                changed = true;
            }
            this.preX = this.gameObject.position.getX();
            this.preY = this.gameObject.position.getY();
            this.preRot = this.gameObject.position.rotation;
            if (changed)
                this.body.SetAwake(true);
        }
    }
    if (INEDITOR) {

        this.gameObject.position.container.removeChild(this.graphics);
        delete this.graphics;
        this.graphics = new PIXI.Graphics();

        this.graphics.beginFill(0xFF3300, 0.01);
        if (this.colliderType == "box") {
            DrawBox(0, 0,
                this.width, this.height,
                0, this.graphics
                , 0.5
                , 0.5
                , 0xff0000, 0.6, false, this.gameObject.position.container);
        }
        if (this.colliderType == "circle") {
            DrawCircle(0, 0,
                this.radius,
                0, this.graphics
                , 0.5
                , 0.5
                , 0xff0000, 0.6, this.gameObject.position.container);
        }
        if (this.colliderType == "polygon" || this.colliderType == "concave") {

            DrawPolygon(0, 0,
                this.vertices,
                0, this.graphics, 0xff0000, 0.6, true, this.gameObject.position.container);
            if (this.Editing && lastKey != undefined && lastKey.keyCode == 46) {
                lastKey = undefined;
                var newVertices = new Array();
                for (var i = 0; i < this.vertices.length; i++) {
                    if (this.vertices[i].c == undefined)
                        newVertices.push(this.vertices[i]);
                }
                this.vertices = newVertices;
            }
        }
        this.graphics.endFill();
    }
}
gm.Physics.prototype.dispose = function () {
    if (world.IsLocked()) {
        world.m_flag_locked = false;
    }
    if (this.body)
        world.DestroyBody(this.body)
    if (this.isLiquid) {
        gameContainer.removeChild(this.liquidContainer);
        world.DestroyParticleSystem(this.m_particleSystem);
    }
    if (this.graphics) {
        this.gameObject.position.container.removeChild(this.graphics);
        delete this.graphics;
    }

}
var mousedown;


gm.revoluteConstraint = function () {
    this.requires = "Physics";
    this.reloadInEditor = {
        otherGameObjectName: true,
        AnchorX: true,
        AnchorY: true,
        motorSpeed: true
    }
    this.otherGameObjectName = "";
    this.AnchorX = 0;
    this.AnchorY = 0;
}
gm.revoluteConstraint.prototype.afterCreate = function () {
    if (world.IsLocked()) {
        world.m_flag_locked = false;
    }
    var rjd = new box2d.b2RevoluteJointDef();
    other = objects[this.otherGameObjectName].Physics.body;
    rjd.Initialize(this.gameObject.Physics.body, other, new box2d.b2Vec2(this.AnchorX + objects[this.otherGameObjectName].position.x, this.AnchorY + objects[this.otherGameObjectName].position.y));
    rjd.collideConnected = false;
    this.revolute = world.CreateJoint(rjd);
}
gm.revoluteConstraint.prototype.dispose = function () {
    try {
        if (world.IsLocked()) {
            world.m_flag_locked = false;
        }
        world.DestroyJoint(this.revolute);
    } catch (e) {

    }

}

function getGameObject(body) {
    return objects[body.gameObjectName];
}