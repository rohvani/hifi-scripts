/*
//  server.js
//
//  Created by Robbie Uvanni on 2017-07-24
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

(function() {
  var MILLISECONDS_PER_SECOND = 1000;
  var SECONDS_PER_MINUTE = 60;
  var LIFETIME = SECONDS_PER_MINUTE * 300;
  
  var HACKY_SACK_LAST_HIT_TIME_THRESHOLD = 200;   // miliseconds
  var HACKY_SACK_UPDATE_TIMESTEP = 200;           // miliseconds
  
  var HACKY_SACK_CHANNEL_NAME = "com.highfidelity.hackysack";
  var HACKY_SACK_MESSAGE_PREFIX = "[Hacky Sack] ";
  
  var HACKY_SACK_MAX_DISTANCE = 5.5;              // meters
  var HACKY_SACK_SPAWN_OFFSET = { x: 0.0, y: -0.5, z: 0.0 };
  
  var HACKY_SACK_PROPERTIES = {
    "collisionsWillMove": 1,
    "dimensions": { "x": 0.26, "y": 0.25, "z": 0.26 },
    "dynamic": 1,
    "friction": 1.0,
    "damping": 0.8,
    "angularDamping": 0.8,
    "gravity": { "x": 0, "y": -3, "z": 0 },
    "lifetime": LIFETIME,
    "script": Script.resolvePath("./../shoes/hackySack.js"),
    "serverScripts":  Script.resolvePath("./../misc/dummyServerScript.js"),
    "modelURL": "https://hifi-content.s3.amazonaws.com/jimi/props/hackysack/hackySack.fbx",
    "name": "HackySack Ball",
    "rotation": {
        "w": 0.96583491563796997,
        "x": -0.029079413041472435,
        "y": -0.21907459199428558,
        "z": -0.13536463677883148
    },
    "shapeType": "sphere",
    "type": "Model"
  };
  
  var HACKY_SACK_SCOREBOARD_SPAWN_OFFSET = { x: 0.0, y: 0.0, z: -5.0 };
  var HACKY_SACK_SCOREBOARD_JSON = Script.resolvePath("./../objects/scoreboard.json");
  var HACKY_SACK_SCOREBOARD_PART_NAMES = [
    "highScoreText",
    "highPersonalStreak",
    "scoreText",
    "multiplierText",
    "billboard"
  ];
  
  var _this;
  var updateInterval;
  
  var hackySack;
  var scoreboard = { };
  
  var lastHits = { };
  var lastHitter = "";
  
  var score = 0;
  var scoreMultiplier = 0;
  var personalStreak = 0;
  
  function createHackySack() {
    HACKY_SACK_PROPERTIES.position = Vec3.sum(_this.getPosition(), HACKY_SACK_SPAWN_OFFSET);
    hackySack = Entities.addEntity(HACKY_SACK_PROPERTIES);
  }
  
  function moveHackySackToOrigin() {
    Entities.deleteEntity(hackySack);
    createHackySack();
  }
  
  function checkIfHackySackLeft() {
    var hackySackPosition = Entities.getEntityProperties(hackySack, ["position"]).position;
    var distance = Vec3.distance(_this.getPosition(), hackySackPosition);
    return distance > HACKY_SACK_MAX_DISTANCE;
  }
  
  function copyVector(v) {
    return { x:v.x, y:v.y, z:v.z };
  }
  
  function createScoreboard() {
    var entities = Script.require(HACKY_SACK_SCOREBOARD_JSON).Entities;
    var spawnOffset = Vec3.sum(_this.getPosition(), HACKY_SACK_SCOREBOARD_SPAWN_OFFSET);
    
    for (var i = 0; i < entities.length; i++) {
      // copy the position in case of a reset since the json will be cached
      // and we don't want to permanentely modify the json
      var originalPosition = copyVector(entities[i].position);
      var name = entities[i].name;
      
      entities[i].position = Vec3.sum(entities[i].position, spawnOffset);
      var entity = Entities.addEntity(entities[i]);
      
      // restore original position so that billboard will respawn in same
      // location
      entities[i].position = originalPosition;
      
      if (name) {
        if (arrayContainsElement(HACKY_SACK_SCOREBOARD_PART_NAMES, name)) {
          scoreboard[entities[i].name] = entity;
        }
      }
    }
  }
  
  function updateLeaderboard() {
    Entities.editEntity(scoreboard.scoreText, { text: score });
    Entities.editEntity(scoreboard.multiplierText, { text: scoreMultiplier });
    Entities.editEntity(scoreboard.highScoreText, { text: getHighScore() });
    Entities.editEntity(scoreboard.highPersonalStreak, { text: getHighPersonalStreak() });
  }
  
  function resetGame() {
    lastHits = { };
    lastHitter = "";
    
    score = 0;
    scoreMultiplier = 0;
    personalStreak = 0;
    
    Entities.deleteEntity(hackySack);
  }
  
  function getHighScore() {
    var userdata = JSON.parse(Entities.getEntityProperties(_this.entityID).userData);
    return userdata.highscore ? userdata.highscore : 0;
  }
  
  function getUserData() {
    return JSON.parse(Entities.getEntityProperties(_this.entityID).userData);
  }
  
  function setHighScore(newScore) {
    if (newScore > getHighScore()) {
      var userdata = getUserData();
      userdata.highscore = newScore;
      Entities.editEntity(_this.entityID, { userData: JSON.stringify(userdata) });
    }
  }
  
  function getHighPersonalStreak() {
    var userdata = JSON.parse(Entities.getEntityProperties(_this.entityID).userData);
    return userdata.highstreak ? userdata.highstreak : 0;
  }
  
  function setHighPersonalStreak(newStreak) {
    if (newStreak > getHighPersonalStreak()) {
      var userdata = getUserData();
      userdata.highstreak = newStreak;
      Entities.editEntity(_this.entityID, { userData: JSON.stringify(userdata) });
    }
  }
  
  function getLastHitTime() {
    return lastHitter.length > 0 ? lastHits[lastHitter] : 0;
  }

  function getNameForEntity(entityID) {
    return Entities.getEntityProperties(entityID, ["name"]).name;
  }
  
  function arrayContainsElement(array, element) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === element) {
        return true;
      }
    }
    return false;
  }
  
  function update() {
    if (checkIfHackySackLeft()) {
      moveHackySackToOrigin();
    }
    updateLeaderboard();
  }
  
  Messages.messageReceived.connect(function(channel, message, sender) {
    var data = JSON.parse(message);
    
    if (data.id !== hackySack) {
      print(HACKY_SACK_MESSAGE_PREFIX + "Dropping message due to hackysack ID mismatch: got " + data.id + ", expected " + hackySack);
      return;
    }
    
    switch (data.type) {
      case "hit":
        // find out if this collision is a valid hit from the player
        if ((Date.now() - getLastHitTime()) >= HACKY_SACK_LAST_HIT_TIME_THRESHOLD) {
          lastHits[data.hitter] = Date.now();
          
          if (data.hitter !== lastHitter) {
            scoreMultiplier++;
            personalStreak = 1;
          } else {
            personalStreak++;
          }
        
          score += scoreMultiplier;
          lastHitter = data.hitter;
          print(HACKY_SACK_MESSAGE_PREFIX + "New score: " + score);
          
          setHighPersonalStreak(personalStreak);
          setHighScore(score);
        }
        break;
        
      case "dropped":
        resetGame();
        break;
        
      default:
        print(HACKY_SACK_MESSAGE_PREFIX + "Unknown message type received: " + data.type);
        break;
    }
  });
  
  function HackySackServer() {
    _this = this;
  }

  HackySackServer.prototype = {
    preload: function(id) { 
      _this.entityID = id;
      Messages.subscribe(HACKY_SACK_CHANNEL_NAME);
      
      createHackySack();
      createScoreboard();
      
      updateInterval = Script.setInterval(update, HACKY_SACK_UPDATE_TIMESTEP);
    },
    
    unload: function() { 
      Script.clearInterval(updateInterval);
      
      // clean up all scoreboard components
      for (var i = 0; i < HACKY_SACK_SCOREBOARD_PART_NAMES.length; i++) {
        var name = HACKY_SACK_SCOREBOARD_PART_NAMES[i];
        Entities.deleteEntity(scoreboard[name]);
      }
      
      Entities.deleteEntity(hackySack);
    },
    
    getPosition: function() {
      return Entities.getEntityProperties(_this.entityID, ["position"]).position;
    }
  };

  return new HackySackServer();
});