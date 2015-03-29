'use strict';

var React = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;
var classSet = React.addons.classSet;
var CalendarActionCreators = require('../actions/CalendarActionCreators');
var moment = require('moment');
var Combokeys = require('combokeys');
var combokeys = new Combokeys(document);
var combokeysGlobal = new Combokeys(document);

require('../../styles/CalendarAdd.styl');

var validFormats = [
  'D.M',
  'D.M.',
  'D.M.YYYY',
  'D.M.YYYY H:mm',
  'D.M H:mm',
  'D.M. H:mm'
];

var datetimeToMoment = function(datetime) {
  return moment(datetime, validFormats, true);
}

var timestampToMoment = function(timestamp) {
  return moment(timestamp, 'x');
}

var formatDateTime = function(momentDateTime) {
  return momentDateTime.format('D.MM.YYYY H:mm');
}

var defaultFrom = formatDateTime(moment({h:9, m:0, s:0}).add(1, 'd'));

var CalendarAdd = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    var from = this.props.event && this.props.event.from && formatDateTime(timestampToMoment(this.props.event.from));
    var description = this.props.event && this.props.event.description;
    return {
      from: from || (!this.props.event && defaultFrom) || '',
      description: description || ''
    }
  },
  onSubmit: function (e) {
    e.preventDefault();
    if (!this.isValid()) {
      return;
    }

    var from = datetimeToMoment(this.state.from);
    from = from.isValid() ? from.format('x') : null;
    if (this.props.event) {
      CalendarActionCreators.update({
        uid: this.props.event.uid,
        from: from,
        description: this.state.description
      });
    } else {
      CalendarActionCreators.create({
        from: from,
        description: this.state.description
      });
    }
    this.setState(this.getInitialState());
    this.props.onSave();
  },
  isValid: function() {
    return this.isFromValid() && this.isDescriptionValid();
  },
  isFromValid: function() {
    return this.state.from === '' || datetimeToMoment(this.state.from).isValid();
  },
  isDescriptionValid: function() {
    return this.state.description !== '';
  },
  componentDidMount: function() {
    combokeys.stopCallback = function(e, element) {
      return element !== this.refs.from.getDOMNode();
    }.bind(this);
    combokeys.bind(['up', 'down', 'shift+up', 'shift+down'], this.updateFrom);

    combokeysGlobal.stopCallback = function(e, element) {
      return element !== this.refs.from.getDOMNode()
          && element !== this.refs.description.getDOMNode()
          && element !== this.refs.save.getDOMNode();
    }.bind(this);
    combokeysGlobal.bind(['esc'], this.props.onClose);
    combokeysGlobal.bind(['ctrl+enter'], this.onSubmit);

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
    combokeysGlobal.unbind(['esc', 'ctrl+enter']);
  },
  updateFrom: function(e, key) {
    e.preventDefault();
    var momentDateTime = datetimeToMoment(this.state.from);
    if (!momentDateTime.isValid()) {
      return;
    }
    if (key === 'up') {
      momentDateTime.add(1, 'd');
    } else if (key === 'down') {
      momentDateTime.add(-1, 'd');
    } else if (key === 'shift+up') {
      momentDateTime.add(1, 'h');
    } else if (key === 'shift+down') {
      momentDateTime.add(-1, 'h');
    }
    this.setState({
      from: formatDateTime(momentDateTime)
    });
  },
  focusDate: function() {
    var node = this.refs.from.getDOMNode();
    setTimeout(function() {
      node.focus();
    }, 200);
  },
  render: function () {
    var fromValid = this.isFromValid();
    var descriptionValid = this.isDescriptionValid();

    var stylesFrom = classSet({
      'form-group': true,
      'has-error': !fromValid
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
          <div className={stylesFrom}>
              <label id='from-labelledby' htmlFor='from' className='control-label col-sm-1'>Od</label>
              <div className='col-sm-11'>
                <input type='text' className='form-control' id='from' ref='from' aria-required='false' aria-invalid={fromValid ? undefined : true} aria-labelledby='from-labelledby' aria-describedby='from-describedby' valueLink={this.linkState('from')} />
              </div>
              <div id='from-describedby' className='col-sm-offset-1 col-sm-11 help-block'><small>Validní formáty jsou {validFormats.join(', ')}.</small></div>
          </div>
          <div className={stylesDescription}>
              <label id='description-labelledby' htmlFor='description' className='control-label col-sm-1'>Popis</label>
              <div className='col-sm-11'>
                <textarea className='form-control' rows='5' id='description' ref='description' required aria-required='true' aria-invalid={descriptionValid ? undefined : true} aria-labelledby='description-labelledby' aria-describedby='description-describedby' valueLink={this.linkState('description')} />
              </div>
              <div id='description-describedby' className='col-sm-offset-1 col-sm-11 help-block'><small>Popis události.</small></div>
          </div>
          <div className='col-sm-offset-1'>
            <button className={stylesSave} ref='save'>Uložit</button>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = CalendarAdd;
