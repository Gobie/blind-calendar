'use strict';

var React = require('react/addons');

require('../../styles/CalendarItem.styl');

var CalendarItem = React.createClass({
  render: function () {
    return (
      <div className='row calendar-item'>
        <div className='col-xs-2 timerange'>{this.props.event.timerange}</div>
        <div className='col-xs-2 place'>{this.props.event.place}</div>
        <div className='col-xs-8 description'>{this.props.event.description}</div>
      </div>
    );
  }
});

module.exports = CalendarItem;
