'use strict';

var React = require('react/addons');
var Router = require('react-router');
var Navigation = Router.Navigation;
var CalendarActionCreators = require('../actions/CalendarActionCreators');

require('../../styles/CalendarAdd.styl');

var CalendarAdd = React.createClass({
  mixins: [Navigation],
  handleSubmit: function () {
    var timerange = this.refs.timerange.getDOMNode().value.trim()
    var place = this.refs.place.getDOMNode().value.trim()
    var description = this.refs.description.getDOMNode().value.trim()
    CalendarActionCreators.save({
      timerange: timerange,
      place: place,
      description: description
    });
    this.transitionTo('/');
  },
  componentDidMount: function() {
    this.refs.timerange.getDOMNode().focus();
  },
  render: function () {
    return (
      <div className='col-12'>
        <h1>Kalendář - Vytvořit událost</h1>
        <form className='calendar-form form-horizontal' role='form' onSubmit={this.handleSubmit}>
          <div className='form-group'>
              <label htmlFor='timerange' className='control-label col-sm-1'>Kdy?</label>
              <div className='col-sm-11'>
                <input type='text' className='form-control' id='timerange' ref='timerange' placeholder='1.1.2014' aria-required='false' />
              </div>
          </div>
          <div className='form-group'>
              <label htmlFor='place' className='control-label col-sm-1'>Kde?</label>
              <div className='col-sm-11'>
                <input type='text' className='form-control' id='place' ref='place' placeholder='Praha' aria-required='false' />
              </div>
          </div>
          <div className='form-group'>
              <label htmlFor='description' className='control-label col-sm-1'>Co?</label>
              <div className='col-sm-11'>
                <textarea className='form-control' rows='5' id='description' ref='description' required aria-required='true' />
              </div>
          </div>
          <div className='col-sm-11 col-sm-offset-1'>
            <button className='btn btn-primary'>Uložit</button>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = CalendarAdd;
