'use strict';

var _ = require('lodash');
var React = require('react/addons');
var CalendarItems = require('./CalendarItems');
var CalendarArchiveItems = require('./CalendarArchiveItems');
var CalendarAdd = require('./CalendarAdd');
var Combokeys = require('combokeys');
var combokeys = new Combokeys(document);

require('../../styles/CalendarList.styl');

var CalendarList = React.createClass({
  getInitialState: function() {
    return {
      formVisible: false,
      formEvent: null,
      archive: false
    };
  },
  componentDidMount: function() {
    combokeys.bind(['n'], this.showAdd);
    combokeys.bind(['1', '2'], this.handleNavigation);
  },
  componentWillUnmount: function() {
    combokeys.unbind(['1', '2']);
    combokeys.unbind(['n']);
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
  handleNavigation: function(e, shortcut) {
    if (shortcut === '1') {
      this.state.archive = false;
    } else if (shortcut === '2') {
      this.state.archive = true;
    }
    this.state.formVisible = false;
    this.forceUpdate();
  },
  render: function () {
    return (
      <div className='calendar-list'>
        {this.state.formVisible ? <CalendarAdd onSave={this.hideAdd} onClose={this.hideAdd} event={this.state.formEvent} /> : ''}
        {this.state.archive ? <CalendarArchiveItems onEdit={function() {}} /> : <CalendarItems onEdit={this.showEdit} />}
      </div>
    );
  }
});

module.exports = CalendarList;
