/*
//  custom_tree_grow.js
//
//  Created by Robbie Uvanni on 2017-07-17
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

/*
  userdata.extra_objects:
    "Tree Spawner"
*/

var stage = 0;
var timeToGrow = 200; //msec
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
var wallPiecesSearchName = "AnimatedModel";
var wallPiecesSearchLocation = { "x": 0, "y": 0, "z": 0 };

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
  destroyTree();
  initialTreeProperties.modelURL = trees[++stage];
  tree = Entities.addEntity(initialTreeProperties);
  adjustPositionRelativeToHeight(tree);
}

function grow() {
  if(stage < (trees.length - 1)) {
    createNextTree();
    // if we've reached the final stage we should go ahead and 
    // make the castle (in polyworld) blow up and then get rid
    // of our setInterval
    if (stage == (trees.length - 1)) {
      var entities = Entities.findEntities(wallPiecesSearchLocation, wallPiecesSearchDistance);
      
      for (var i = 0; i < entities.length; i++) {
        var name = Entities.getEntityProperties(entities[i], ["name"]).name;
        if (name === wallPiecesSearchName) {
          Entities.editEntity(entities[i], newWallProperties);
        }
      }
      
      Script.clearInterval(treeInterval);
    }
  }
}

/*    Module Function   */
module.exports.onEnter = function(userdata) {
  spawner = userdata.extra_objects["Tree Spawner"];
  
  var spawnerPosition = Entities.getEntityProperties(spawner, ["position"]).position;
  wallPiecesSearchLocation = spawnerPosition;
  
  // reset default properties incase this is a second spawn
  stage = 0;
  initialTreeProperties.modelURL = trees[stage];
  
  // if the tree was already in the process of growing, lets cancel it
  destroyTree();
  Script.clearInterval(treeInterval);
  
  // update where tree will spawn
  initialTreeProperties.position = spawnerPosition;
  tree = Entities.addEntity(initialTreeProperties);
  adjustPositionRelativeToHeight(tree);
  
  // start growing buddy
  treeInterval = Script.setInterval(function() { grow(); }, timeToGrow); 
}