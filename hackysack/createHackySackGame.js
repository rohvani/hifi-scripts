/*
//  createHackySackGame.js
//
//  Created by Robbie Uvanni on 2017-07-17
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

var HACKY_SACK_JSON = Script.resolvePath("./hackySackGame.json");
var HACKY_SACK_SPAWN_OFFSET = { x: 0.0, y: 0.0, z: -10.0 };

var relativeOffset = Vec3.multiplyQbyV(MyAvatar.orientation, HACKY_SACK_SPAWN_OFFSET);
var spawnPosition = Vec3.sum(MyAvatar.position, relativeOffset);

Clipboard.importEntities(HACKY_SACK_JSON);
entities = Clipboard.pasteEntities(spawnPosition);