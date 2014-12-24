var CalendarActionCreators = require('../actions/CalendarActionCreators');

module.exports = {

  loadDataFromLocalStorage: function() {
    var data = JSON.parse(localStorage.getItem('calendar')) || [];

    CalendarActionCreators.receive(data);
  },

  saveDataToLocalStorage: function(events) {
    localStorage.setItem('calendar', JSON.stringify(events));
  },

};
