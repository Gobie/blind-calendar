'use strict';

var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var CalendarFirebaseStore = require('../stores/CalendarFirebaseStore');
var CalendarItem = require('./CalendarItem');

require('../../styles/CalendarList.styl');

var getStateFromStore = function() {
  return {
    events: CalendarFirebaseStore.getAll()
  }
}

var CalendarList = React.createClass({
  getInitialState: function() {
    return getStateFromStore();
  },
  componentDidMount: function() {
    CalendarFirebaseStore.listen(this._onChange);
    combokeys.bind(['up', 'down'], this._onMove);
  },
  componentWillUnmount: function() {
    combokeys.unbind(['up','down']);
    CalendarFirebaseStore.unlisten(this._onChange);
  },
  _onChange: function() {
    this.setState(getStateFromStore());
  },
  _onMove: function(e, shortcut) {
    switch (shortcut) {
      case 'up':
        console.log('up');
        break;
      case 'down':
        console.log('down');
        break;
      default:
        throw new Error('unhandled shortcut' + shortcut);
    }
  },
  render: function () {
    var nodes = this.state.events.map(function(event) {
      return <CalendarItem event={event} key={event.uid} />
    });
    return (
      <div className='col-xs-12'>
        <h1>Seznam událostí</h1>
        <div className='calendar-items col-xs-12'>
          {nodes}
        </div>
      </div>
    );
  }
});

module.exports = CalendarList;
