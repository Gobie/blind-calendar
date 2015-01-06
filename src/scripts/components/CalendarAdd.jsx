'use strict';

var React = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;
var classSet = React.addons.classSet;
var CalendarActionCreators = require('../actions/CalendarActionCreators');
var moment = require('moment');
var Combokeys = require('combokeys');
var combokeys = new Combokeys(document);

require('../../styles/CalendarAdd.styl');

var validFormats = [
  'D.M',
  'D.M.',
  'D.M.YYYY',
  'D.M.YYYY H:mm',
  'D.M H:mm',
  'D.M. H:mm'
];

var timerangeToMoment = function(timerange) {
  return moment(timerange, validFormats, true);
}

var timestampToMoment = function(timerange) {
  return moment(timerange, 'x');
}

var formatMomentTimerange = function(momentTimerange) {
  return momentTimerange.format('D.MM.YYYY H:mm');
}

var defaultTimerange = formatMomentTimerange(moment({h:9, m:0, s:0}).add(1, 'd'));

var CalendarAdd = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    var timerange = this.props.event && this.props.event.timerange && formatMomentTimerange(timestampToMoment(this.props.event.timerange));
    var description = this.props.event && this.props.event.description;
    return {
      timerange: timerange || defaultTimerange,
      description: description || ''
    }
  },
  onSubmit: function (e) {
    e.preventDefault();
    if (!this.isValid()) {
      return;
    }

    var timerange = timerangeToMoment(this.state.timerange);
    timerange = timerange.isValid() ? timerange.format('x') : null;
    if (this.props.event) {
      CalendarActionCreators.update({
        uid: this.props.event.uid,
        timerange: timerange,
        description: this.state.description
      });
    } else {
      CalendarActionCreators.create({
        timerange: timerange,
        description: this.state.description
      });
    }
    this.props.onSave();
    this.setState(this.getInitialState());
  },
  isValid: function() {
    return this.isTimerangeValid() && this.isDescriptionValid();
  },
  isTimerangeValid: function() {
    return this.state.timerange === '' || timerangeToMoment(this.state.timerange).isValid();
  },
  isDescriptionValid: function() {
    return this.state.description !== '';
  },
  componentDidMount: function() {
    combokeys.stopCallback = function(e, element) {
      return element !== this.refs.timerange.getDOMNode();
    }.bind(this);
    combokeys.bind(['up', 'down', 'shift+up', 'shift+down'], this.updateTimerange);
    this.focusDate();
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.event !== this.props.event) {
      this.setState(this.getInitialState());
      this.focusDate();
    }
  },
  componentWillUnmount: function() {
    combokeys.stopCallback = function() {
      return true;
    }
    combokeys.unbind(['up', 'down', 'shift+up', 'shift+down']);
  },
  updateTimerange: function(e, key) {
    e.preventDefault();
    var momentTimerange = timerangeToMoment(this.state.timerange);
    if (!momentTimerange.isValid()) {
      return;
    }
    if (key === 'up') {
      momentTimerange.add(1, 'd');
    } else if (key === 'down') {
      momentTimerange.add(-1, 'd');
    } else if (key === 'shift+up') {
      momentTimerange.add(1, 'h');
    } else if (key === 'shift+down') {
      momentTimerange.add(-1, 'h');
    }
    this.setState({
      timerange: formatMomentTimerange(momentTimerange)
    });
  },
  focusDate: function() {
    var node = this.refs.timerange.getDOMNode();
    setTimeout(function() {
      node.focus();
    }, 200);
  },
  render: function () {
    var timerangeValid = this.isTimerangeValid();
    var descriptionValid = this.isDescriptionValid();

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
      'disabled': !this.isValid()
    });

    return (
      <div className='calendar-add'>
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
