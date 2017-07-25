/*
//  dummyServerScript.js
//
//  Created by Robbie Uvanni on 2017-07-24
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

(function() {
  var _this;

  function DummyServerScript() {
    _this = this;
  }

  DummyServerScript.prototype = {
    preload: function(id) { },
    unload: function() { }
  };

  return new DummyServerScript();
});