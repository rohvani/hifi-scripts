/*
//  hud.js
//
//  Created by Robbie Uvanni on 2017-07-17
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

(function() {
  var APP_NAME = "ZONE EDITOR";
  var APP_URL  = Script.resolvePath("./hud/page.html");
  var APP_ICON = Script.resolvePath("./hud/images/icon.png");
  
  var ZONE_TRIGGER_CHANNEL = "zoneTriggers";

  var actions = Script.require('./actions.json');
  var triggerScript = Script.resolvePath("./trigger.js");
  
  var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
  var button = tablet.addButton({
    text: APP_NAME,
    icon: APP_ICON
  });
 
  function clicked(){
    tablet.gotoWebScreen(APP_URL);
    tablet.emitScriptEvent(JSON.stringify({
        type: ZONE_TRIGGER_CHANNEL,
        data: actions
    })); 
  }
  
  function cleanup() {
    tablet.removeButton(button);
  }
  
  function createTrigger(customizedTrigger) {
    
    var properties = {                                
      "type": 'Box',
      "shapeType": 'box',

      "name": "Zone Trigger",
      "description": "Created via Zone Editor tool",       

      "script" : triggerScript,
      "collidesWith": "",
      "collisionMask": 0,
      "position": MyAvatar.position,
      "userData": JSON.stringify(customizedTrigger)
    };
    
    var zoneTrigger = Entities.addEntity(properties);
  }
 
  function onWebEventReceived(event) {
    // tablet is letting us know they're ready
    if (event === "Document Ready") {
      tablet.emitScriptEvent(JSON.stringify({
        type: ZONE_TRIGGER_CHANNEL,
        reason:'sendTriggerTypes',
        data: actions
      })); 
    // event wasn't deserialized so we should do so now
    } else if (typeof event === "string") {
      event = JSON.parse(event);
    }

    // process custom events
    if (event.type === ZONE_TRIGGER_CHANNEL) {
      switch (event.reason)
      {
        case 'createTrigger':
          createTrigger(event.data);
          break;
          
        default:
          print('Unknown web event: ' + event.reason);
          break;
      }
    }
  }
  
  button.clicked.connect(clicked);
  Script.scriptEnding.connect(cleanup);
  tablet.webEventReceived.connect(onWebEventReceived);
}());