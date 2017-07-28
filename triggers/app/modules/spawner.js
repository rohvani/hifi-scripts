/*
//  spawner.js
//
//  Created by Robbie Uvanni on 2017-07-17
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

/* 
  userdata.properties:
    object_url,
    lifetime,
    cleanup
    
  userdata.extra_objects:
    "Object Spawner"
*/

var entities = [];

module.exports.onEnter = function(userdata) {
  var properties = userdata.properties;
  var objects = userdata.extra_objects;
  var position = Entities.getEntityProperties(objects["Object Spawner"], ["position"]).position;
  
  Clipboard.importEntities(properties.object_url);
  entities = Clipboard.pasteEntities(position);
  
  if (properties.lifetime > 0) {
    for (var i = 0; i < entities.length; i++) {
      Entities.editEntity(entities[i], { "lifetime": properties.lifetime });
    }
  }
}

module.exports.onLeave = function(userdata) {
  if (userdata.properties.cleanup == true) {
    for (var i = 0; i < entities.length; i++) {
      Entities.deleteEntity(entities[i]);
    }
  }
}