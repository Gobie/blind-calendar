'use strict';

var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var CalendarActionConstants = require('../actions/CalendarActionConstants');
var Firebase = require('firebase');
var calendarRef = new Firebase('https://luminous-fire-3770.firebaseIO.com/calendar/');

var CHANGE_EVENT = 'change';

var _events = [];

var CalendarFirebaseStore = _.create(EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  listen: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  unlisten: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAll: function() {
    return _events;
  }

});

CalendarFirebaseStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case CalendarActionConstants.LOAD_DATA:
      calendarRef.set(action.data);
      break;

    case CalendarActionConstants.SAVE_DATA:
      var event = action.data;
      event.created = _.now();
      calendarRef.push(event);
      break;

    case CalendarActionConstants.REMOVE_DATA:
      var event = action.data;
      calendarRef.child(event.uid).remove();
      break;

    default:
  }

});

calendarRef.on('child_changed', function(snapshot) {
  var data = snapshot.val();
  data.uid = snapshot.key();
  var index = _.findIndex(_events, function(event) {
    return event.uid === data.uid;
  });
  if (index === -1) {
    return;
  }
  _events.splice(index, 1, data);
  CalendarFirebaseStore.emitChange();
}, function(err) {
  console.log('Failed to get child_changed event from Firebase: ' + err.code);
});

calendarRef.on('child_removed', function(snapshot) {
  var uid = snapshot.key();
  var index = _.findIndex(_events, function(event) {
    return event.uid === uid;
  });
  if (index === -1) {
    return;
  }
  _events.splice(index, 1);
  CalendarFirebaseStore.emitChange();
}, function(err) {
  console.log('Failed to get child_removed event from Firebase: ' + err.code);
});

calendarRef.on('child_added', function(snapshot) {
  var data = snapshot.val();
  data.uid = snapshot.key();
  var index = _.findIndex(_events, function(event) {
    return event.uid === data.uid;
  });
  if (index !== -1) {
    return;
  }
  _events.push(data);
  CalendarFirebaseStore.emitChange();
}, function(err) {
  console.log('Failed to get child_added event from Firebase: ' + err.code);
});

module.exports = CalendarFirebaseStore;
