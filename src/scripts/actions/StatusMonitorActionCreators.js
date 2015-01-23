var AppDispatcher = require('../dispatcher/AppDispatcher');
var StatusMonitorActionConstants = require('./StatusMonitorActionConstants');

var StatusMonitorActionCreators = {

  online: function() {
    AppDispatcher.handleServerAction({
      type: StatusMonitorActionConstants.ONLINE
    });
  },

  offline: function() {
    AppDispatcher.handleServerAction({
      type: StatusMonitorActionConstants.OFFLINE
    });
  }

};

module.exports = StatusMonitorActionCreators;
