'use strict';

var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var config = require('../../../config');
var throttle = require('../utils/throttle');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var CalendarActionConstants = require('../actions/CalendarActionConstants');
var Firebase = require('firebase');
var calendarRef = new Firebase(config.firebase_url + '/calendar/active/');
var calendarArchiveRef = new Firebase(config.firebase_url + '/calendar/archive/');
var moment = require('moment');

var CHANGE_EVENT = 'change';

var _events = [];

var CalendarFirebaseStore = _.create(EventEmitter.prototype, {

  emitChange: throttle(function () {
    this.emit(CHANGE_EVENT);
  }, 50),

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
  },

  getNextEvent: function() {
    var now = +moment();
    var futureEvent = _.find(_events, function(event) {
      return event.from >= now;
    });

    if (futureEvent) {
      return futureEvent;
    } else if (_events.length) {
      return _events[_events.length - 1];
    }
    return null;
  }

});

CalendarFirebaseStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case CalendarActionConstants.LOAD:
      calendarRef.set(action.data);
      break;

    case CalendarActionConstants.CREATE:
      var event = action.data;
      event.created = _.now();
      event['.priority'] = -event.from;
      calendarRef.push(event);
      break;

    case CalendarActionConstants.UPDATE:
      var event = action.data;
      var eventRef = calendarRef.child(event.uid);
      eventRef.setPriority(-event.from);
      eventRef.update({
        from: event.from,
        description: event.description
      })
      break;

    case CalendarActionConstants.REMOVE:
      var event = action.data;
      calendarRef.child(event.uid).remove();
      break;

    default:
  }

});

calendarRef.orderByPriority().on('child_changed', function(snapshot) {
  var data = snapshot.val();
  data.uid = snapshot.key();
  data.priority = snapshot.getPriority();
  data.from = +data.from;
  var index = _.findIndex(_events, function(event) {
    return event.uid === data.uid;
  });
  if (index === -1) {
    return;
  }
  _events.splice(index, 1);

  var index = _.findIndex(_events, function(event) {
    return event.priority <= data.priority;
  });
  if (index === -1) {
    index = _events.length;
  }
  _events.splice(index, 0, data);
  CalendarFirebaseStore.emitChange();
}, function(err) {
  console.log('Failed to get child_changed event from Firebase: ' + err.code);
});

calendarRef.orderByPriority().on('child_removed', function(snapshot) {
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

calendarRef.orderByPriority().on('child_added', function(snapshot) {
  var data = snapshot.val();
  data.uid = snapshot.key();
  data.priority = snapshot.getPriority();
  data.from = +data.from;

  // archive notes older than 30 days
  if (data.from !== 0 && Date.now() - data.from > 30 * 24 * 3600 * 1000) {
    var eventRef = calendarArchiveRef.child(data.uid);
    eventRef.update({
      from: data.from,
      description: data.description,
      created: data.created
    });
    eventRef.setPriority(-data.from);

    return calendarRef.child(data.uid).remove();
  }

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
  CalendarFirebaseStore.emitChange();
}, function(err) {
  console.log('Failed to get child_added event from Firebase: ' + err.code);
});

module.exports = CalendarFirebaseStore;
