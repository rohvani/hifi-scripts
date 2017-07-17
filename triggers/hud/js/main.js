var ZONE_TRIGGER_CHANNEL = "zoneTriggers";

var data = {
  actions: [ ],
  selectedAction: { }
};

var controller = {
  // called when we select a trigger type to customize
  selectAction: function(e, model) {
    console.log(data.selectedAction);
    console.log(model);
    data.selectedAction = model.data.actions[model.index];
  },
  // called when we click 'Create' button for a trigger
  createTrigger: function(e, model) {
    var customizedTrigger = { };
    customizedTrigger.name = data.selectedAction.name;
    customizedTrigger.properties = { };
    
    // grab values for all the attributes for this trigger type
    for (var i in data.selectedAction.attributes) {
      var attribute = { };
      attribute.name = data.selectedAction.attributes[i].name;
      
      // make sure that this is a real attribute that we've grabbed...
      if (attribute.name.length > 0) {
        attribute.value = $("#" + attribute.name).val();
        customizedTrigger.properties[attribute.name] = attribute.value;
      }
    }

    // send the trigger information to tablet to be created
    var event = {
      "type" : ZONE_TRIGGER_CHANNEL,
      "reason" : "createTrigger",
      "data" : customizedTrigger
    };
    EventBridge.emitWebEvent(JSON.stringify(event));
  }
};

function print(message) {
  $("#output").append('> ' + message + '<br>');
}

function main() {
  
  try {
    EventBridge.scriptEventReceived.connect(function (message) {   
      message = JSON.parse(message);
    
      if (message.type === ZONE_TRIGGER_CHANNEL) {
        switch (message.reason) {
          case 'sendTriggerTypes':
            for(var i in message.data.actions) {
              data.actions.push(message.data.actions[i]);
            }
            break;
        }
      }
    });
    // let the tablet know that we're ready
    EventBridge.emitWebEvent("Document Ready");
  } catch (e) {
    // for debugging in a standalone browser
    print(e);
    data.actions = [
      {
        "name":"spawner",
        "description":"spawns an object when zone is entered",
        "attributes": [
          {
            "name":"object_url",
            "description":"URL to JSON that describes what to spawn",
          },
          {
            "name":"position_uuid",
            "description":"UUID of the entity to spawn the object at",
          }
        ]
      },
      {
        "name":"sound",
        "description":"plays a sound when zone is entered",
        "attributes": [
          {
            "name":"audio_url",
            "description":"URL to audio file to be played",
          },
          {
            "name":"position_uuid",
            "description":"UUID of the entity to play the sound at",
          }
        ]
      }
    ];
  }
  
  rivets.bind($('#zoneTriggerCreator'), { 
    data: data,
    controller: controller
  });
}
$(document).ready(main);