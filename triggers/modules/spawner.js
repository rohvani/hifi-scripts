/*
//  spawner.js
//
//  Created by Robbie Uvanni on 2017-07-17
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

/* userdata:
    object_url,
    position_uuid,
    lifetime
*/

module.exports.performAction = function(userdata) {
  var json = Script.require(userdata.object_url);
  
  json.position = Entities.getEntityProperties(userdata.position_uuid, ["position"]).position;
  json.lifetime = userdata.lifetime;
  
  var ent = Entities.addEntity(json);
}