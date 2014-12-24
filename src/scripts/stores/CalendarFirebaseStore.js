'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('react/lib/Object.assign');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var CalendarActionConstants = require('../actions/CalendarActionConstants');
var Firebase = require('firebase');
var calendarRef = new Firebase('https://luminous-fire-3770.firebaseIO.com/calendar/');

var CHANGE_EVENT = 'change';

var _events = [];

var CalendarFirebaseStore = assign(EventEmitter.prototype, {

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
      _events = action.data;
      calendarRef.set(_events);
      break;

    case CalendarActionConstants.SAVE_DATA:
      var event = action.data;
      event.created = Date.now();
      calendarRef.push(event);
      break;

    default:
  }

});

calendarRef.on('value', function(snapshot) {
  var events = [];
  var data = snapshot.val();
  for (var key in data) {
    data[key]['uid'] = key
    events.push(data[key]);
  }
  _events = events;
  CalendarFirebaseStore.emitChange();
}, function(err) {
  console.log('Failed to read from Firebase: ' + err.code);
});

module.exports = CalendarFirebaseStore;
