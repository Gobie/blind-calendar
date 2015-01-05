'use strict';

var _ = require('lodash');
var React = require('react/addons');
var CalendarItems = require('./CalendarItems');
var CalendarAdd = require('./CalendarAdd');
var Combokeys = require('combokeys');
var combokeys = new Combokeys(document);

require('../../styles/CalendarList.styl');

var CalendarList = React.createClass({
  getInitialState: function() {
    return {
      formVisible: false,
      formEvent: null
    };
  },
  componentDidMount: function() {
    combokeys.bind(['c'], this.showAdd);
    combokeys.bind(['h'], this.hideAdd);
  },
  componentWillUnmount: function() {
    combokeys.unbind(['c', 'h']);
  },
  showAdd: function() {
    this.setState({formVisible: true});
  },
  hideAdd: function() {
    this.setState({formVisible: false});
  },
  updateEvent: function(event) {
    this.setState({
      formVisible: true,
      formEvent: event
    });
  },
  render: function () {
    return (
      <div className='calendar-list'>
        <CalendarAdd visible={this.state.formVisible} onSave={this.hideAdd} event={this.state.formEvent} />
        <CalendarItems focus={!this.state.formVisible} onEdit={this.updateEvent} />
      </div>
    );
  }
});

module.exports = CalendarList;
