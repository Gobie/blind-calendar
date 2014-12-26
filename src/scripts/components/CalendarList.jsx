'use strict';

var _ = require('lodash');
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
    var state = getStateFromStore();
    if (_.isUndefined(state.activeEventUid)) {
      var firstEvent = _.first(state.events);
      if (firstEvent) {
        state.activeEventUid = firstEvent.uid;
      }
    }
    return state;
  },
  componentDidMount: function() {
    CalendarFirebaseStore.listen(this.onChange);
    combokeys.bind(['up', 'down'], this.onMove);
  },
  componentWillUnmount: function() {
    combokeys.unbind(['up','down']);
    CalendarFirebaseStore.unlisten(this.onChange);
  },
  onChange: function() {
    this.setState(this.getInitialState());
  },
  onMove: function(e, shortcut) {
    var activeEventIndex = _.findIndex(this.state.events, function(event) {
      return event.uid === this.state.activeEventUid;
    }.bind(this))

    if (activeEventIndex === -1) {
      activeEventIndex = 0;
    } else {
      switch (shortcut) {
        case 'up':
          activeEventIndex = activeEventIndex > 0 ? activeEventIndex - 1 : this.state.events.length - 1
          break;
        case 'down':
          activeEventIndex = (activeEventIndex + 1) % this.state.events.length;
          break;
        default:
          throw new Error('Unhandled shortcut: ' + shortcut);
      }
    }

    this.setState({activeEventUid: this.state.events[activeEventIndex].uid});
  },
  render: function () {
    var nodes = this.state.events.map(function(event) {
      return <CalendarItem event={event} key={event.uid} active={event.uid === this.state.activeEventUid} />
    }.bind(this));

    return (
      <div>
        <h2>Seznam událostí</h2>
        <div className='calendar-items col-xs-12' tabIndex='0' role='listbox'>
          {nodes}
        </div>
      </div>
    );
  }
});

module.exports = CalendarList;
