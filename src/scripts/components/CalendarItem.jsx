'use strict';

var React = require('react/addons');
var moment = require('moment');
var CalendarActionCreators = require('../actions/CalendarActionCreators');

require('../../styles/CalendarItem.styl');

var CalendarItem = React.createClass({
  _onDelete: function() {
    CalendarActionCreators.remove({
      uid: this.props.event.uid
    });
  },
  render: function () {
    var timePlace = [];
    if (this.props.event.timerange) {
      timePlace.push(moment.utc(this.props.event.timerange, 'x').format('D.M.YYYY, dddd'));
    }
    if (this.props.event.place) {
      timePlace.push(this.props.event.place);
    }

    var timePlaceNode = '';
    if (timePlace.length) {
      timePlaceNode = <div className='time-and-place'><strong>{timePlace.join(', ')}</strong></div>;
    }

    return (
      <div className='row calendar-item'>
        <div className='col-xs-10'>
          {timePlaceNode}
          <div className='description'>{this.props.event.description}</div>
        </div>
        <div className='col-xs-2'>
          <button className='btn btn-danger btn-small pull-right' onClick={this._onDelete}>Smazat</button>
        </div>
      </div>
    );
  }
});

module.exports = CalendarItem;
