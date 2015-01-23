'use strict';

var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var StatusMonitorActionConstants = require('../actions/StatusMonitorActionConstants');

var CHANGE_EVENT = 'change';

var status = false;

var StatusMonitorStore = _.create(EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  listen: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  unlisten: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getStatus: function() {
    return status;
  }

});

StatusMonitorStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case StatusMonitorActionConstants.ONLINE:
      status = true;
      StatusMonitorStore.emitChange();
      break;

    case StatusMonitorActionConstants.OFFLINE:
      status = false;
      StatusMonitorStore.emitChange();
      break;

    default:
  }

});

module.exports = StatusMonitorStore;
