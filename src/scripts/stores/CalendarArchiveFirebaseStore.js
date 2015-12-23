'use strict';

var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var config = require('../../../config');
var throttle = require('../utils/throttle');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var CalendarActionConstants = require('../actions/CalendarActionConstants');
var Firebase = require('firebase');
var calendarArchiveRef = new Firebase(config.firebase_url + '/calendar/archive/');

var CHANGE_EVENT = 'change';

var _events = [];

var CalendarArchiveFirebaseStore = _.create(EventEmitter.prototype, {

  emitChange: throttle(function () {
    this.emit(CHANGE_EVENT);
  }, 500),

  listen: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  unlisten: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAll: function() {
    return _events.map(function(event) {
      if (event.from) {
        event.duplicate = _.where(_events, { from: event.from }).length !== 1;
      }
      return event;
    });
  }

});

CalendarArchiveFirebaseStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case CalendarActionConstants.REMOVE:
      var event = action.data;
      calendarArchiveRef.child(event.uid).remove();
      break;

    default:
  }

});

calendarArchiveRef.orderByPriority().on('child_removed', function(snapshot) {
  var uid = snapshot.key();
  var index = _.findIndex(_events, function(event) {
    return event.uid === uid;
  });
  if (index === -1) {
    return;
  }
  _events.splice(index, 1);
  CalendarArchiveFirebaseStore.emitChange();
}, function(err) {
  console.log('Failed to get child_removed event from Firebase: ' + err.code);
});

calendarArchiveRef.orderByPriority().on('child_added', function(snapshot) {
  var data = snapshot.val();
  data.uid = snapshot.key();
  data.priority = snapshot.getPriority();
  data.from = +data.from;

  var index = _.findIndex(_events, function(event) {
    return event.uid === data.uid;
  });
  if (index !== -1) {
    return;
  }
  var index = _.findIndex(_events, function(event) {
    return event.priority <= data.priority;
  });
  if (index === -1) {
    index = _events.length;
  }
  _events.splice(index, 0, data);
  CalendarArchiveFirebaseStore.emitChange();
}, function(err) {
  console.log('Failed to get child_added event from Firebase: ' + err.code);
});

module.exports = CalendarArchiveFirebaseStore;
