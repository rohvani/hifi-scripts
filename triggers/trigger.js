(function() {
  var _this;
 
  function getScriptModule() {
    return Script.require('./modules/' + getActionName() + '.js');
  }
  
  function getUserData() {
    var props = Entities.getEntityProperties(_this.entityID);
    return JSON.parse(props.userData);
  }
  
  function getActionName() {
    var properties = getUserData();
    return properties.name;
  }
  
  function getActionProperties() {
    var userdata = getUserData();
    
    // temporary
    var pos = Entities.getEntityProperties(_this.entityID, ["position"]).position;
    userdata.properties.position = pos;
    
    return userdata.properties;
  }

  function Trigger() {
    _this = this;
  }

  Trigger.prototype = {
    
    preload: function(id) {
      _this.entityID = id;
    },
    
    unload: function() {
    },
    
    enterEntity: function(entityID) {
      _this.triggerAction();
    },
    
    triggerAction: function() {
      /*  Script modules will take a userdata object containing the necesscary attributes to perform */
      var script = getScriptModule();
      script.performAction(getActionProperties());
    }
  };

  return new Trigger();
});