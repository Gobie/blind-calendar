'use strict';

var _ = require('lodash');
var React = require('react/addons');
var CalendarArchiveFirebaseStore = require('../stores/CalendarArchiveFirebaseStore');
var CalendarActionCreators = require('../actions/CalendarActionCreators');
var CalendarItem = require('./CalendarItem');
var Combokeys = require('combokeys');
var combokeys = new Combokeys(document);

require('../../styles/CalendarArchiveItems.styl');

var getStateFromStore = function() {
  return {
    events: CalendarArchiveFirebaseStore.getAll()
  }
}

var CalendarArchiveItems = React.createClass({
  getInitialState: function() {
    var state = getStateFromStore();
    var firstEvent = _.first(state.events);
    if (firstEvent) {
      state.activeEventUid = firstEvent.uid;
    }
    return state;
  },
  componentDidMount: function() {
    CalendarArchiveFirebaseStore.listen(this.onChange);
  },
  componentWillUnmount: function() {
    CalendarArchiveFirebaseStore.unlisten(this.onChange);
  },
  onChange: function() {
    this.setState(getStateFromStore());
  },
  getIndex: function() {
    return _.findIndex(this.state.events, function(event) {
      return event.uid === this.state.activeEventUid;
    }.bind(this));
  },
  moveUp: function(eventUid) {
    var activeEventIndex = this.getIndex();
    if (activeEventIndex === -1) {
      activeEventIndex = 0;
    } else {
      activeEventIndex = (activeEventIndex ? activeEventIndex : this.state.events.length) - 1
    }

    this.selectEvent(this.state.events[activeEventIndex].uid);
  },
  moveDown: function(eventUid) {
    var activeEventIndex = this.getIndex();
    if (activeEventIndex === -1) {
      activeEventIndex = 0;
    } else {
      activeEventIndex = (activeEventIndex + 1) % this.state.events.length;
    }

    this.selectEvent(this.state.events[activeEventIndex].uid);
  },
  selectEvent: function(eventUid) {
    this.setState({activeEventUid: eventUid});
  },
  removeEvent: function(eventUid) {
    if (this.getIndex()) {
      this.moveUp(eventUid);
    } else {
      this.moveDown(eventUid);
    }

    CalendarActionCreators.remove({
      uid: eventUid
    });
  },
  onMove: function(e, shortcut) {
    if (shortcut === 'up') {
      this.moveUp(this.state.activeEventUid);
    } else if (shortcut === 'down') {
      this.moveDown(this.state.activeEventUid);
    }
  },
  onFocus: function() {
    combokeys.bind(['up', 'down'], this.onMove);
  },
  onBlur: function() {
    combokeys.unbind(['up', 'down']);
  },
  render: function () {
    var nodes = this.state.events.map(function(event) {
      var active = event.uid === this.state.activeEventUid;
      return <CalendarItem event={event} key={event.uid} active={active} onSelect={this.selectEvent} onDelete={this.removeEvent} onEdit={this.props.onEdit} />
    }.bind(this));

    return (
      <div className='calendar-items'>
        <h2 id='calendar-items-label' className='sr-only'>Události</h2>
        <div className='calendar-items-container' tabIndex='0' role='listbox' onFocus={this.onFocus} onBlur={this.onBlur} aria-labelledby='calendar-items-label' aria-live='polite'>
          {nodes}
        </div>
      </div>
    );
  }
});

module.exports = CalendarArchiveItems;
