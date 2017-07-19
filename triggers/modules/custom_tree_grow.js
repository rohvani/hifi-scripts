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
var timeToGrow = 500; //msec
var trees = [
  "https://hifi-content.s3.amazonaws.com/ozan/dev/sets/bitGem/polygon_knights/props/tree_dead_small.fbx",
  "https://hifi-content.s3.amazonaws.com/ozan/dev/sets/bitGem/polygon_knights/props/tree_dead_medium.fbx",
  "https://hifi-content.s3.amazonaws.com/ozan/dev/sets/bitGem/polygon_knights/props/tree_dead_big.fbx"
];
var treeHeights = [ 4.2578, 6.5748, 10.4070 ];
var initialTreeProperties = {  
  "shapeType": "simple-hull",
  "type": "Model",
  "lifetime": 20
};

var tree = "";
var spawner = "";
var treeInterval = null;

var wallPiecesSearchDistance = 20.0;
var wallPiecesName = "AnimatedModel";
var wallPiecesLocation = { "x": -9.27122, "y": -1.88673, "z": 12.9915 };
var newWallProperties = {
  "collidesWith": "static,dynamic,kinematic,myAvatar,otherAvatar",
  "dynamic": 1,
  "gravity": { "x": 0, "y": -9.8, "z": 0 },
  "velocity": { "x": 0.0, "y": 10.0, "z": 10.0 }
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
  if (tree.length > 0) {
    Entities.deleteEntity(tree);
  }
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
      var entities = Entities.findEntities(wallPiecesLocation, wallPiecesSearchDistance);
      
      for (var i = 0; i < entities.length; i++) {
        var name = Entities.getEntityProperties(entities[i], ["name"]).name;
        if (name === wallPiecesName) {
          Entities.editEntity(entities[i], newWallProperties);
        }
      }
      
      Script.clearInterval(treeInterval);
    }
  }
}

/*    Module Function   */
module.exports.performAction = function(userdata) {
  spawner = userdata.position_uuid;
  
  // reset default properties incase this is a second spawn
  stage = 0;
  initialTreeProperties.modelURL = trees[stage];
  
  // if the tree was already in the process of growing, lets cancel it
  destroyTree();
  Script.clearInterval(treeInterval);
  
  // update where tree will spawn
  initialTreeProperties.position = Entities.getEntityProperties(spawner, ["position"]).position;
  tree = Entities.addEntity(initialTreeProperties);
  adjustPositionRelativeToHeight(tree);
  
  // start growing buddy
  treeInterval = Script.setInterval(function() { grow(); }, timeToGrow); 
}