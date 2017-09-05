/*
//  client.js
//
//  Created by Robbie Uvanni on 2017-07-24
//  Copyright 2017 High Fidelity, Inc.
//
//  Original hackysack colliders script by Thijs Wenker
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

(function() {
    var SECONDS_PER_MINUTE = 60;
    var LIFETIME = SECONDS_PER_MINUTE * 300;
    var COLLIDERS_VISIBLE = false;
    
    var _this;
    var rezzedEntities = [];
    
    function addFootColliders(leftSide) {
        var jointPrefix = leftSide ? 'Left' : 'Right';
        var footJointName = jointPrefix + 'Foot';
        var footJointIndex = MyAvatar.getJointIndex(footJointName);
        
        if (footJointIndex === -1) {
            print('Could not find ' + footJointName);
            return;
        }
        
        var footEntity = Entities.addEntity({
            name: 'HackySack Collider',
            type: 'Sphere',
            localPosition: {x: 0, y: 0.1, z: 0},
            localRotation: Quat.fromPitchYawRollDegrees(-45,0,0),
            parentID: MyAvatar.sessionUUID,
            parentJointIndex: footJointIndex,
            friction: 1.0, // full foot friction
            dimensions: { x: 0.1, y: 0.1, z: 0.275 },
            lifetime: LIFETIME,
            visible: COLLIDERS_VISIBLE,
            userData: JSON.stringify({ ownerID: MyAvatar.sessionUUID })
        });

        rezzedEntities.push(footEntity);
    }
    
    function addLegColliders(leftSide) {
        var jointPrefix = leftSide ? 'Left' : 'Right';
        var jointName = jointPrefix + 'Leg';
        var jointIndex = MyAvatar.getJointIndex(jointName);
        
        if (jointIndex === -1) {
            print('Could not find ' + jointName);
            return;
        }
        
        var entity = Entities.addEntity({
            name: 'HackySack Collider',
            type: 'Sphere',
            localPosition: {x: 0, y: 0.25, z: -0.025},
            localRotation: Quat.fromPitchYawRollDegrees(0,0,0),
            parentID: MyAvatar.sessionUUID,
            parentJointIndex: jointIndex,
            friction: 1.0, // full foot friction
            dimensions: { x: 0.1, y: 0.5, z: 0.1 },
            lifetime: LIFETIME,
            visible: COLLIDERS_VISIBLE,
            userData: JSON.stringify({ ownerID: MyAvatar.sessionUUID })
        });

        rezzedEntities.push(entity);
    }
    
    function addUpLegColliders(leftSide) {
        var jointPrefix = leftSide ? 'Left' : 'Right';
        var jointName = jointPrefix + 'UpLeg';
        var jointIndex = MyAvatar.getJointIndex(jointName);
        
        if (jointIndex === -1) {
            print('Could not find ' + jointName);
            return;
        }
        
        var entity = Entities.addEntity({
            name: 'HackySack Collider',
            type: 'Box',
            localPosition: {x: 0, y: 0.2, z: 0},
            localRotation: Quat.fromPitchYawRollDegrees(0,0,0),
            parentID: MyAvatar.sessionUUID,
            parentJointIndex: jointIndex,
            friction: 1.0, // full foot friction
            dimensions: { x: 0.08, y: 0.4, z: 0.1 },
            lifetime: LIFETIME,
            visible: COLLIDERS_VISIBLE,
            userData: JSON.stringify({ ownerID: MyAvatar.sessionUUID })
        });

        rezzedEntities.push(entity);
    }

    function HackySackClient() { _this = this; }

    HackySackClient.prototype = {        
        preload: function(id) { _this.entityID = id; },
        
        unload: function() { },
        
        enterEntity: function(entityID) {
            addFootColliders(true);
            addFootColliders(false);
            
            addLegColliders(true);
            addLegColliders(false);
            
            addUpLegColliders(true);
            addUpLegColliders(false);
        },
        
        leaveEntity: function(entityID) {
            for (var i = 0; i < rezzedEntities.length; i++) {
                Entities.deleteEntity(rezzedEntities[i]);
            }
        }
    };

    return new HackySackClient();
});