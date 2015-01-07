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
  },
  componentWillUnmount: function() {
    combokeys.unbind(['c']);
  },
  showAdd: function() {
    this.showForm(true, null);
  },
  hideAdd: function() {
    this.showForm(false, null);
  },
  showEdit: function(event) {
    this.showForm(true, event);
  },
  showForm: function(visible, event) {
    this.setState({
      formVisible: visible,
      formEvent: event
    });
  },
  render: function () {
    return (
      <div className='calendar-list'>
        {this.state.formVisible ? <CalendarAdd onSave={this.hideAdd} onClose={this.hideAdd} event={this.state.formEvent} /> : ''}
        <CalendarItems onEdit={this.showEdit} />
      </div>
    );
  }
});

module.exports = CalendarList;
