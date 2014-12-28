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
      this.refs.event.getDOMNode().focus();
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
      timePlace.push(moment.utc(this.props.event.timerange, 'x').format('D MMMM YYYY, dddd'));
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
        <div className='col-sm-10'>
          <div className='time-and-place'><strong>{timePlaceNode}</strong></div>
          <div className='description'>{this.props.event.description}</div>
        </div>
        <div className='col-sm-2'>
          <div className='actions clearfix'>
            <button className='btn btn-danger btn-small pull-right col-sm-12 col-xs-6' tabIndex='-1' onClick={this.onDelete}>Smazat</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CalendarItem;
