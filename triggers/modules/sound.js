/*
//  sound.js
//
//  Created by Robbie Uvanni on 2017-07-17
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

/* userdata:
    audio_url,
    position_uuid
*/

module.exports.performAction = function(userdata) {
  Audio.playSound(userdata.audio_url, {
    position: Entities.getEntityProperties(userdata.position_uuid, ["position"]).position;,
    localOnly: false
  });
}