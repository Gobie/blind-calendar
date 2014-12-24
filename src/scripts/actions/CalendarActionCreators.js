var AppDispatcher = require('../dispatcher/AppDispatcher');
var CalendarActionConstants = require('./CalendarActionConstants');

module.exports = {

  receive: function(data) {
    AppDispatcher.handleServerAction({
      type: CalendarActionConstants.LOAD_DATA,
      data: data
    });
  },

  save: function(data) {
    AppDispatcher.handleServerAction({
      type: CalendarActionConstants.SAVE_DATA,
      data: data
    });
  },

};
