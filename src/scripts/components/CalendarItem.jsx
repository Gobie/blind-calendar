'use strict';

var React = require('react/addons');
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
      timePlace.push(this.props.event.timerange);
    }
    if (this.props.event.place) {
      timePlace.push(this.props.event.place);
    }

    var timePlaceNode = '';
    if (timePlace.length) {
      timePlaceNode = <div className='col-xs-12 time-and-place'><strong>{timePlace.join(', ')}</strong></div>;
    }

    return (
      <div className='row calendar-item'>
        {timePlaceNode}
        <div className='col-xs-10 description'>{this.props.event.description}</div>
        <div className='col-xs-2'>
          <button className='btn btn-danger btn-small pull-right' onClick={this._onDelete}>Smazat</button>
        </div>
      </div>
    );
  }
});

module.exports = CalendarItem;
