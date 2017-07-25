/*
//  client.js
//
//  Created by Robbie Uvanni on 2017-07-24
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

(function() {
  var SECONDS_PER_MINUTE = 60;
  var LIFETIME = SECONDS_PER_MINUTE * 300;
  var COLLIDERS_VISIBLE = true;
  
  var _this;
  var rezzedEntities = [];
  
  function addLegColliders(leftSide) {
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
        dimensions: { x: 0.1, y: 0.1, z: 0.275 }, //dimensions for sphere
        lifetime: LIFETIME,
        visible: COLLIDERS_VISIBLE,
        userData: JSON.stringify({ ownerID: MyAvatar.sessionUUID })
    });

    rezzedEntities.push(footEntity);
  }

  function HackySackClient() {
    _this = this;
  }

  HackySackClient.prototype = {    
    preload: function(id) { _this.entityID = id; },
    
    unload: function() { },
    
    enterEntity: function(entityID) {
      addLegColliders(true);
      addLegColliders(false);
    },
    
    leaveEntity: function(entityID) {
      for (var i = 0; i < rezzedEntities.length; i++) {
        Entities.deleteEntity(rezzedEntities[i]);
      }
    }
  };

  return new HackySackClient();
});