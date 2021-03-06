'use strict';

var React = require('react/addons');
var classSet = React.addons.classSet;
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
      this.refs.event.getDOMNode().focus();
    }
  },
  onFocus: function() {
    this.props.onSelect(this.props.event.uid);
    combokeys.bind(['d', 'del'], this.onDelete);
    combokeys.bind(['e', 'enter'], this.onEdit);
  },
  onBlur: function() {
    combokeys.unbind(['d', 'del']);
    combokeys.unbind(['e', 'enter']);
  },
  onDelete: function() {
    this.props.onDelete(this.props.event.uid);
  },
  onEdit: function() {
    this.props.onEdit(this.props.event);
  },
  render: function () {
    var timeNode = 'Poznámka';
    var momentTimerange = moment(this.props.event.from, 'x');

    if (momentTimerange.isValid()) {
      timeNode = momentTimerange.format('dddd, D MMMM YYYY H:mm');
    }

    var tabIndex = this.props.active ? '0' : '-1';
    var rowStyles = classSet({
      'row calendar-item': true,
      'selected': this.props.active,
      'today': momentTimerange.isValid() && momentTimerange.isSame(moment(), 'd'),
      'tomorrow': momentTimerange.isValid() && momentTimerange.isSame(moment().add(1, 'd'), 'd'),
      'note': !this.props.event.from,
      'duplicate': this.props.event.duplicate
    });

    return (
      <div className={rowStyles} tabIndex={tabIndex} aria-selected={this.props.active} role='option' ref='event' onFocus={this.onFocus} onBlur={this.onBlur}>
        <div className='col-sm-12'>
          <div className='time'><strong>{timeNode}</strong></div>
          <div className='event-content'>{this.props.event.description}</div>
        </div>
      </div>
    );
  }
});

module.exports = CalendarItem;
