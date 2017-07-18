/*
//  main.js
//
//  Created by Robbie Uvanni on 2017-07-17
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

var ZONE_TRIGGER_CHANNEL = "zoneTriggers";

var data = {
  actions: [ ],
  selectedAction: { }
};

var controller = {
  // called when we select a trigger type to customize
  selectAction: function(e, model) {   
    // commented out until hack for dropdowns is fixed
    /*data.selectedAction = data.actions.filter(function(element){ 
      return element.name === data.selectedActionName;
    })[0];*/
    
    // use dropdown hack
    data.selectedAction = data.actions.filter(function(element){ 
      return element.name === $("#selectedAction").find("span")[0].innerHTML;
    })[0];
    // end hack
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
    // if we're in a standalone browser, we should just output what we'd send
    if (typeof Eventbridge !== "undefined") {
      EventBridge.emitWebEvent(JSON.stringify(event));
    } else {
      print(JSON.stringify(event));
    }
  }
};

function print(message) {
  $("#output").append('> ' + message + '<br>');
}

// hack for dropdowns/select, needs to be removed once they are fixed
function replaceDropdowns() {
  function setDropdownText(dropdown) {
        var lis = dropdown.parentNode.getElementsByTagName("li");
        var text = "";
        for (var i = 0; i < lis.length; i++) {
            if (String(lis[i].getAttribute("value")) === String(dropdown.value)) {
                text = lis[i].textContent;
            }
        }
        dropdown.firstChild.textContent = text;
    }

    function toggleDropdown(event) {
        var element = event.target;
        if (element.nodeName !== "DT") {
            element = element.parentNode;
        }
        element = element.parentNode;
        var isDropped = element.getAttribute("dropped");
        element.setAttribute("dropped", isDropped !== "true" ? "true" : "false");
    }

    function setDropdownValue(event) {
        var dt = event.target.parentNode.parentNode.previousSibling;
        dt.value = event.target.getAttribute("value");
        dt.firstChild.textContent = event.target.textContent;

        dt.parentNode.setAttribute("dropped", "false");

        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", true, true);
        dt.dispatchEvent(evt);
    }
    
  try {

    var elDropdowns = document.getElementsByTagName("select");
    for (var i = 0; i < elDropdowns.length; i++) {
        var options = elDropdowns[i].getElementsByTagName("option");
        var selectedOption = 0;
        for (var j = 0; j < options.length; j++) {
            if (options[j].getAttribute("selected") === "selected") {
                selectedOption = j;
            }
        }
        var div = elDropdowns[i].parentNode;

        var dl = document.createElement("dl");
        div.appendChild(dl);

        var dt = document.createElement("dt");
        dt.name = elDropdowns[i].name;
        dt.id = elDropdowns[i].id;
        dt.addEventListener("click", toggleDropdown, true);
        dl.appendChild(dt);

        var span = document.createElement("span");
        span.setAttribute("value", options[selectedOption].value);
        span.textContent = options[selectedOption].firstChild.textContent;
        dt.appendChild(span);

        var span = document.createElement("span");
        span.textContent = "5"; // caratDn
        dt.appendChild(span);

        var dd = document.createElement("dd");
        dl.appendChild(dd);

        var ul = document.createElement("ul");
        dd.appendChild(ul);

        for (var j = 0; j < options.length; j++) {
            var li = document.createElement("li");
            li.setAttribute("value", options[j].value);
            li.textContent = options[j].firstChild.textContent;
            li.addEventListener("click", setDropdownValue);
            ul.appendChild(li);
        }
    }

    elDropdowns = document.getElementsByTagName("select");
    while (elDropdowns.length > 0) {
        var el = elDropdowns[0];
        el.parentNode.removeChild(el);
        elDropdowns = document.getElementsByTagName("select");
    }
  } catch(e) { print(e); }
}
// end hack


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

  // temporary hack for dropdowns, comes from entityProperties.js:1550
  setInterval(function() { replaceDropdowns(); }, 200);
  // end hack
}
$(document).ready(main);