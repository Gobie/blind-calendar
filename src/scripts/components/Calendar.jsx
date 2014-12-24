'use strict';

var React = require('react/addons');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;
var keymaster = require('keymaster');
var CalendarFirebaseStore = require('../stores/CalendarFirebaseStore');
var CalendarItem = require('./CalendarItem');

require('../../styles/Calendar.styl');

var getStateFromStore = function() {
  return {
    events: CalendarFirebaseStore.getAll()
  }
}

var Calendar = React.createClass({
  mixins: [Navigation],
  getInitialState: function() {
    return getStateFromStore();
  },
  componentDidMount: function() {
    CalendarFirebaseStore.listen(this._onChange);
    keymaster('up, down', this._onMove);
    keymaster('ctrl+alt+p', this._onAdd);
  },
  componentWillUnmount: function() {
    keymaster.unbind('ctrl+alt+p');
    keymaster.unbind('up');
    keymaster.unbind('down');
    CalendarFirebaseStore.unlisten(this._onChange);
  },
  _onChange: function() {
    this.setState(getStateFromStore());
  },
  _onAdd: function() {
    this.transitionTo('/add');
  },
  _onMove: function(e, handler) {
    switch (handler.shortcut) {
      case 'up':
        console.log('up');
        break;
      case 'down':
        console.log('down');
        break;
      default:
        throw new Error('unhandled shortcut' + handler.shortcut);
    }
  },
  render: function () {
    var nodes = this.state.events.map(function(event) {
      return <CalendarItem event={event} key={event.created} />
    });
    return (
      <div className='col-xs-12'>
        <h1>Kalendář</h1>
        <Link to='add' className='btn btn-primary col-xs-12' role='button'>Přidat událost</Link>
        <div className='calendar-items col-xs-12'>
          {nodes}
        </div>
      </div>
    );
  }
});

module.exports = Calendar;
