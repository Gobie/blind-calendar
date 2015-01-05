var AppDispatcher = require('../dispatcher/AppDispatcher');
var CalendarActionConstants = require('./CalendarActionConstants');

module.exports = {

  receive: function(data) {
    AppDispatcher.handleServerAction({
      type: CalendarActionConstants.LOAD,
      data: data
    });
  },

  create: function(data) {
    AppDispatcher.handleViewAction({
      type: CalendarActionConstants.CREATE,
      data: data
    });
  },

  update: function(data) {
    AppDispatcher.handleViewAction({
      type: CalendarActionConstants.UPDATE,
      data: data
    });
  },

  remove: function(data) {
    AppDispatcher.handleViewAction({
      type: CalendarActionConstants.REMOVE,
      data: data
    });
  },

};
