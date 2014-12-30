'use strict';

var React = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;
var classSet = React.addons.classSet;
var Router = require('react-router');
var Navigation = Router.Navigation;
var CalendarActionCreators = require('../actions/CalendarActionCreators');
var moment = require('moment');

require('../../styles/CalendarAdd.styl');

var validFormats = ['D.M.YYYY', 'D M YYYY', 'D.M.YY', 'D M YY', 'D.M.', 'D M'];

var CalendarAdd = React.createClass({
  mixins: [Navigation, LinkedStateMixin],
  getInitialState: function() {
    return {
      timerange: '',
      place: '',
      description: ''
    }
  },
  onSubmit: function (e) {
    e.preventDefault();
    if (!this.isValid()) {
      return;
    }

    var timerange = moment.utc(this.state.timerange, validFormats);
    CalendarActionCreators.save({
      timerange: timerange.isValid() ? timerange.format('x') : null,
      place: this.state.place,
      description: this.state.description
    });
    this.transitionTo('/');
  },
  isValid: function() {
    return this.isTimerangeValid() && this.isDescriptionValid();
  },
  isTimerangeValid: function() {
    return this.state.timerange === '' || moment(this.state.timerange, validFormats, true).isValid();
  },
  isDescriptionValid: function() {
    return this.state.description !== '';
  },
  componentDidMount: function() {
      var node = this.refs.timerange.getDOMNode();
      setTimeout(function() {
        node.focus();
      }, 10);
  },
  render: function () {
    var timerangeValid = this.isTimerangeValid();
    var descriptionValid = this.isDescriptionValid()

    var stylesTimerange = classSet({
      'form-group': true,
      'has-error': !timerangeValid
    });

    var stylesDescription = classSet({
      'form-group': true,
      'has-error': !descriptionValid
    });

    var stylesSave = classSet({
      'btn btn-primary': true,
      'disabled': !this.isValid(),
      'col-xs-12': true
    });

    return (
      <div className='col-xs-12'>
        <h2 className='sr-only'>Vytvořit událost</h2>
        <form className='calendar-form form-horizontal' role='form' onSubmit={this.onSubmit}>
          <div className={stylesTimerange}>
              <label id='timerange-labeledby' htmlFor='timerange' className='control-label col-sm-1'>Datum</label>
              <div className='col-sm-11'>
                <input type='text' className='form-control' id='timerange' ref='timerange' placeholder='1.1.2014' aria-required='false' aria-invalid={!timerangeValid} aria-labeledby='timerange-labeledby' aria-describedby='timerange-describedby' valueLink={this.linkState('timerange')} />
              </div>
              <div id='timerange-describedby' className='col-sm-offset-1 col-sm-11 help-block'><small>Validní formáty jsou {validFormats.join(', ')}.</small></div>
          </div>
          <div className='form-group'>
              <label htmlFor='place' className='control-label col-sm-1'>Místo</label>
              <div className='col-sm-11'>
                <input type='text' className='form-control' id='place' ref='place' placeholder='Praha' aria-required='false' valueLink={this.linkState('place')} />
              </div>
          </div>
          <div className={stylesDescription}>
              <label id='description-labeledby' htmlFor='description' className='control-label col-sm-1'>Popis</label>
              <div className='col-sm-11'>
                <textarea className='form-control' rows='5' id='description' ref='description' required aria-required='true' aria-invalid={!descriptionValid} aria-labeledby='description-labeledby' aria-describedby='description-describedby' valueLink={this.linkState('description')} />
              </div>
              <div id='description-describedby' className='col-sm-offset-1 col-sm-11 help-block'><small>Popis události.</small></div>
          </div>
          <div className='col-sm-offset-1 row'>
            <button className={stylesSave}>Uložit</button>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = CalendarAdd;
