//Box2d world object
var box2dConstant = 0.01;
var world;
var beginContactFunctions = new Array();
var endContactFunctions = new Array();
//var impactFunctions = new Array();
CreateNewComponentEvent("beginContact");
CreateNewComponentEvent("endContact");
gm.Box2dWorld = function () {
    initiatePhysicsEngine();
}
gm.Box2dWorld.prototype.create = function () {
  // (function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = 'http://rawgit.com/mrdoob/stats.js/master/build/stats.min.js'; document.head.appendChild(script); })()

}
gm.Box2dWorld.prototype.update = function (d) {
    world.Step(d / 1000, 8, 3, 2);
}
if (!objects.Box2dWorld)
    addGameObjectBase({
        name: {
            value: 'Box2dWorld'
        },
        position: {
        },
        Box2dWorld: {
        }
    });
    //If Box2d is selected physics engine then every scene needs it
constantGameObjects.push(JSON.stringify({
    name: {
        value: 'Box2dWorld'
    },
    position: {
    },
    Box2dWorld: {
    }
}));

function initiatePhysicsEngine() {
    var contactListener = {
        BeginContact: function (contact) {
            var bodyA = contact.GetFixtureA().m_body;
            var bodyB = contact.GetFixtureB().m_body;
            for (var i = 0; i < beginContactFunctions.length; i++) {
                if (beginContactFunctions[i].gameObject && beginContactFunctions[i].gameObject && beginContactFunctions[i].gameObject.Physics
                    && beginContactFunctions[i].gameObject.Physics.body) {
                    if (beginContactFunctions[i].gameObject.Physics.body == bodyA)
                        beginContactFunctions[i].fn.apply(beginContactFunctions[i].component, [getGameObject(bodyB), bodyB, contact]);
                    else if (beginContactFunctions[i].gameObject.Physics.body == bodyB)
                        beginContactFunctions[i].fn.apply(beginContactFunctions[i].component, [getGameObject(bodyA), bodyA, contact]);
                }
            }
        },
        EndContact: function (contact) {
            var bodyA = contact.GetFixtureA().m_body;
            var bodyB = contact.GetFixtureB().m_body;
            for (var i = 0; i < endContactFunctions.length; i++) {
                if (endContactFunctions[i].gameObject && endContactFunctions[i].gameObject && endContactFunctions[i].gameObject.Physics
                    && endContactFunctions[i].gameObject.Physics.body) {
                    if (endContactFunctions[i].gameObject.Physics.body == bodyA)
                        endContactFunctions[i].fn.apply(endContactFunctions[i].component, [getGameObject(bodyB), bodyB, contact]);
                    else if (endContactFunctions[i].gameObject.Physics.body == bodyB)
                        endContactFunctions[i].fn.apply(endContactFunctions[i].component, [getGameObject(bodyA), bodyA, contact]);
                }
            }
        }
    }
    var gravity = new box2d.b2Vec2(0, 980);
    window.world = new box2d.b2World(gravity);
    box2d.b2_maxTranslation = 1000;
    box2d.b2_maxTranslationSquared = box2d.b2_maxTranslation * box2d.b2_maxTranslation;
    
    var cl = new box2d.b2ContactListener(contactListener);
    cl.BeginContact = contactListener.BeginContact;
    cl.EndContact = contactListener.EndContact;
    world.SetContactListener(cl);
    //world.on("impact", function (evt) {
    //    var bodyA = evt.bodyA,
    //        bodyB = evt.bodyB;
    //    for (var i = 0; i < impactFunctions.length; i++) {
    //        if (impactFunctions[i].gameObject && impactFunctions[i].gameObject && impactFunctions[i].gameObject.Physics
    //            && impactFunctions[i].gameObject.Physics.body) {
    //            if (impactFunctions[i].gameObject.Physics.body == bodyA)
    //                impactFunctions[i].fn.apply(impactFunctions[i].component, [getGameObject(bodyB), bodyB, evt]);
    //            else if (impactFunctions[i].gameObject.Physics.body == bodyB)
    //                impactFunctions[i].fn.apply(impactFunctions[i].component, [getGameObject(bodyA), bodyA, evt]);
    //        }
    //    }
    //});
    //world.on("beginContact", function (evt) {
    //    var bodyA = evt.bodyA,
    //        bodyB = evt.bodyB;
    //    for (var i = 0; i < beginContactFunctions.length; i++) {
    //        if (beginContactFunctions[i].gameObject && beginContactFunctions[i].gameObject && beginContactFunctions[i].gameObject.Physics
    //            && beginContactFunctions[i].gameObject.Physics.body) {
    //            if (beginContactFunctions[i].gameObject.Physics.body == bodyA)
    //                beginContactFunctions[i].fn.apply(beginContactFunctions[i].component, [getGameObject(bodyB), bodyB, evt]);
    //            else if (beginContactFunctions[i].gameObject.Physics.body == bodyB)
    //                beginContactFunctions[i].fn.apply(beginContactFunctions[i].component, [getGameObject(bodyA), bodyA, evt]);
    //        }
    //    }
    //});
    //world.on("endContact", function (evt) {
    //    var bodyA = evt.bodyA,
    //        bodyB = evt.bodyB;
    //    for (var i = 0; i < endContactFunctions.length; i++) {
    //        if (endContactFunctions[i].gameObject && endContactFunctions[i].gameObject && endContactFunctions[i].gameObject.Physics
    //            && endContactFunctions[i].gameObject.Physics.body) {
    //            if (endContactFunctions[i].gameObject.Physics.body == bodyA)
    //                endContactFunctions[i].fn.apply(endContactFunctions[i].component, [getGameObject(bodyB), bodyB, evt]);
    //            else if (endContactFunctions[i].gameObject.Physics.body == bodyB)
    //                endContactFunctions[i].fn.apply(endContactFunctions[i].component, [getGameObject(bodyA), bodyA, evt]);
    //        }
    //    }
    //});
}
