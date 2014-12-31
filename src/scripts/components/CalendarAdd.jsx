'use strict';

var React = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;
var classSet = React.addons.classSet;
var CalendarActionCreators = require('../actions/CalendarActionCreators');
var moment = require('moment');

require('../../styles/CalendarAdd.styl');

var validFormats = [
  'D.M',
  'D.M.',
  'D.M.YYYY',
  'D.M.YYYY H:mm'
];

var CalendarAdd = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return {
      timerange: '',
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
      description: this.state.description
    });
    this.props.onSave();
    this.setState(this.getInitialState());
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
  componentDidUpdate: function(prevProps, prevState) {
    if (!prevProps.visible && this.props.visible) {
      this.focusDate();
    }
  },
  focusDate: function() {
    var node = this.refs.timerange.getDOMNode();
    setTimeout(function() {
      node.focus();
    }, 200);
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
      'btn btn-primary btn-block': true,
      'disabled': !this.isValid()
    });

    var rootStyles = classSet({
      'calendar-add': true,
      'hidden': !this.props.visible
    });

    return (
      <div className={rootStyles}>
        <h2 className='sr-only'>Vytvořit událost</h2>
        <form className='calendar-form form-horizontal' role='form' onSubmit={this.onSubmit}>
          <div className={stylesTimerange}>
              <label id='timerange-labelledby' htmlFor='timerange' className='control-label col-sm-1'>Datum</label>
              <div className='col-sm-11'>
                <input type='text' className='form-control' id='timerange' ref='timerange' placeholder='1.1.2014' aria-required='false' aria-invalid={timerangeValid ? undefined : true} aria-labelledby='timerange-labelledby' aria-describedby='timerange-describedby' valueLink={this.linkState('timerange')} />
              </div>
              <div id='timerange-describedby' className='col-sm-offset-1 col-sm-11 help-block'><small>Validní formáty jsou {validFormats.join(', ')}.</small></div>
          </div>
          <div className={stylesDescription}>
              <label id='description-labelledby' htmlFor='description' className='control-label col-sm-1'>Popis</label>
              <div className='col-sm-11'>
                <textarea className='form-control' rows='5' id='description' ref='description' required aria-required='true' aria-invalid={descriptionValid ? undefined : true} aria-labelledby='description-labelledby' aria-describedby='description-describedby' valueLink={this.linkState('description')} />
              </div>
              <div id='description-describedby' className='col-sm-offset-1 col-sm-11 help-block'><small>Popis události.</small></div>
          </div>
          <div className='col-sm-offset-1'>
            <button className={stylesSave}>Uložit</button>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = CalendarAdd;
