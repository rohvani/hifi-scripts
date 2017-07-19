/*
//  custom_tree_grow.js
//
//  Created by Robbie Uvanni on 2017-07-17
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

/* userdata:
    position_uuid
*/

var stage = 0;

var timeToGrow = 2000; //msec
var trees = [
  "https://hifi-content.s3.amazonaws.com/ozan/dev/sets/bitGem/polygon_knights/props/tree_dead_small.fbx",
  "https://hifi-content.s3.amazonaws.com/ozan/dev/sets/bitGem/polygon_knights/props/tree_dead_medium.fbx",
  "https://hifi-content.s3.amazonaws.com/ozan/dev/sets/bitGem/polygon_knights/props/tree_dead_big.fbx"
];
var treeHeights = [
  4.2578,
  6.5748,
  10.4070
]

var initialTreeProperties = {  
  "modelURL": trees[stage],
  "shapeType": "simple-hull",
  "type": "Model"
};

var tree = "";
var spawner = "";

var wallPieces = [
  "{3dc3fc47-2a96-4cd7-945d-8764f2234c44}",
  "{e89e7bd2-a361-4e20-b22c-d893a494622f}",
  "{3abf5b33-4c90-448b-8b91-a2e403fbd3ed}",
  "{539293de-0075-4101-8e8a-0bd4b0c06dd9}",
  "{d0fb7d05-c933-40c8-a7a2-31640fd7e4d3}",
  "{eb5a80b3-68f4-4cd1-b36a-e5aebf00b34b}",
  "{3ddd2976-d265-4dfa-a7e1-0ab0ee0f149e}",
  "{170de3ee-7821-4fd7-b30d-8ae874eb8241}",
  "{0c0e7829-637f-419b-b4d0-4f5968830ed7}",
  "{1bae54cf-edef-4805-9c77-76f50f7d3cd0}"
];

var newWallProperties = {
  "dynamic": 1,
  "gravity": { "x": 0, "y": -9.8, "z": 0 },
  "velocity": { "x": 0, "y": 1.0, "z": 0 }
};

/*    Utility Functions   */
function getTreeHalfHeight() {
  return treeHeights[stage] / 2;
}

function adjustPositionRelativeToHeight(entity) {
  var newPos = Entities.getEntityProperties(spawner, ["position"]).position;
  newPos.y += getTreeHalfHeight();
  Entities.editEntity(entity, { "position": newPos } );
}

/*    Tree Functions   */
function destroyTree() {
  Entities.deleteEntity(tree);
}

function createNextTree() {
  initialTreeProperties.modelURL = trees[stage];
  var ent = Entities.addEntity(initialTreeProperties);
  adjustPositionRelativeToHeight(ent);
  return ent;
}

function grow(entity) {
  if(stage < (trees.length - 1)) {
    stage++;
    destroyTree();
    tree = createNextTree();
    
    if (stage == (trees.length - 1)) {
      for (var i = 0; i < wallPieces.length; i++) {
        Entities.editEntity(wallPieces[i], newWallProperties);
      }
    }
  }
}

/*    Module Function   */
module.exports.performAction = function(userdata) {
  spawner = userdata.position_uuid;
  
  // update where tree will spawn
  initialTreeProperties.position = Entities.getEntityProperties(spawner, ["position"]).position;
  tree = Entities.addEntity(initialTreeProperties);
  adjustPositionRelativeToHeight(tree);
  
  // start growing buddy
  Script.setInterval(function() { grow(); }, timeToGrow); 
}