var AppDispatcher = require('../dispatcher/AppDispatcher');
var CalendarActionConstants = require('./CalendarActionConstants');

module.exports = {

  receive: function(data) {
    AppDispatcher.handleServerAction({
      type: CalendarActionConstants.LOAD,
      data: data
    });
  },

  save: function(data) {
    AppDispatcher.handleServerAction({
      type: CalendarActionConstants.SAVE,
      data: data
    });
  },

  remove: function(data) {
    AppDispatcher.handleServerAction({
      type: CalendarActionConstants.REMOVE,
      data: data
    });
  },

};
