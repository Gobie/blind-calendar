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
      addVisible: false
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
    this.setState({addVisible: true});
  },
  hideAdd: function() {
    this.setState({addVisible: false});
  },
  render: function () {
    return (
      <div className='calendar-list'>
        <CalendarAdd visible={this.state.addVisible} onSave={this.hideAdd} />
        <CalendarItems focus={!this.state.addVisible} />
      </div>
    );
  }
});

module.exports = CalendarList;
