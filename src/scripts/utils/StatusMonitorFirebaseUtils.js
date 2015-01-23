var config = require('../../../config');
var StatusMonitorActionCreators = require('../actions/StatusMonitorActionCreators');
var Firebase = require('firebase');

var StatusMonitorFirebaseUtils = function() {
  this.connectedRef = new Firebase(config.firebase_url + '/.info/connected');
};

StatusMonitorFirebaseUtils.prototype.monitor = function() {
  this.connectedRef.on('value', function(snap) {
    if (snap.val() === true) {
      console.log(new Date, 'connected');
      StatusMonitorActionCreators.online();
    } else {
      console.log(new Date, 'disconnected');
      StatusMonitorActionCreators.offline();
    }
  });
};

module.exports = StatusMonitorFirebaseUtils;
