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

var CLEANUP_TRUE_STRING = "1";
var CLEANUP_FALSE_STRING = "0";

var entity = "";

module.exports.onEnter = function(userdata) {
  var properties = userdata.properties;
  var objects = userdata.extra_objects;
  
  var json = Script.require(properties.object_url);
  
  json.position = Entities.getEntityProperties(objects["Object Spawner"], ["position"]).position;
  json.lifetime = properties.lifetime;
  
  entity = Entities.addEntity(json);
}

module.exports.onLeave = function(userdata) {
  if (userdata.properties.cleanup === CLEANUP_TRUE_STRING) {
    Entities.deleteEntity(entity);
  }
}