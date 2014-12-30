'use strict';

var React = require('react/addons');
var moment = require('moment');
var Combokeys = require('combokeys');
var combokeys = new Combokeys(document);

require('../../styles/CalendarItem.styl');

var CalendarItem = React.createClass({
  componentDidMount: function() {
    this.focus();
  },
  componentDidUpdate: function() {
    this.focus();
  },
  focus: function() {
    if (this.props.active) {
      var node = this.refs.event.getDOMNode();
      setTimeout(function() {
        node.focus();
      }, 10);
    }
  },
  onFocus: function() {
    this.props.onSelect(this.props.event.uid);
    combokeys.bind(['d', 'del'], this.onDelete);
  },
  onBlur: function() {
    combokeys.unbind(['d', 'del']);
  },
  onDelete: function() {
    this.props.onDelete(this.props.event.uid);
  },
  render: function () {
    var timePlace = [];
    if (this.props.event.timerange) {
      timePlace.push(moment.utc(this.props.event.timerange, 'x').format('D MMMM YYYY H:mm, dddd'));
    }
    if (this.props.event.place) {
      timePlace.push(this.props.event.place);
    }

    var timePlaceNode = 'nevyplněno';
    if (timePlace.length) {
      timePlaceNode = timePlace.join(', ');
    }

    var tabIndex = this.props.active ? '0' : '-1';
    var stylesRow = 'row calendar-item' + (this.props.active ? ' selected' : '');

    return (
      <div className={stylesRow} tabIndex={tabIndex} aria-selected={this.props.active} role='option' ref='event' onFocus={this.onFocus} onBlur={this.onBlur}>
        <div className='col-sm-12'>
          <div className='time-and-place'><strong>{timePlaceNode}</strong></div>
          <div className='event-content'>{this.props.event.description}</div>
        </div>
      </div>
    );
  }
});

module.exports = CalendarItem;
