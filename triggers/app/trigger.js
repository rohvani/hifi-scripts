/*
// trigger.js
//
// Created by Robbie Uvanni on 2017-07-17
// Copyright 2017 High Fidelity, Inc.
//
// Distributed under the Apache License, Version 2.0.
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

(function() {
    var _this;
 
    function getScriptModule() {
        return Script.require('./modules/' + getActionName() + '.js');
    }
    
    function getUserData() {
        var userdata = JSON.parse(Entities.getEntityProperties(_this.entityID).userData);
        
        // inherented userdata
        var pos = Entities.getEntityProperties(_this.entityID, ["position"]).position;
        userdata.properties.trigger_position = pos;
        
        return userdata;
    }
    
    function getActionName() {
        // TODO: we should probably sanitize this so that people don't go loading
        // files outside our modules directory
        var properties = getUserData();
        return properties.name;
    }

    function Trigger() {
        _this = this;
    }

    Trigger.prototype = {
        preload: function(id) {
            _this.entityID = id;
        },
        
        unload: function() { },
        
        enterEntity: function(entityID) {
            var script = getScriptModule();
            if (script.onEnter) {
                script.onEnter(getUserData());
            }
        },
        
        leaveEntity: function(entityID) {
            var script = getScriptModule();
            if (script.onLeave) {
                script.onLeave(getUserData());
            }
        }
    };

    return new Trigger();
});