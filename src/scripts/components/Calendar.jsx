'use strict';

var React = require('react/addons');
var classSet = React.addons.classSet;
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var StatusMonitorStore = require('../stores/StatusMonitorStore');

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

require('../../styles/normalize.css');
require('../../../bower_components/bootstrap/dist/css/bootstrap.min.css');
require('../../../bower_components/bootstrap/dist/css/bootstrap-theme.min.css');
require('../../styles/Calendar.styl');

var getStateFromStore = function() {
  return {
    status: StatusMonitorStore.getStatus()
  }
}

var Calendar = React.createClass({
  getInitialState: function() {
    var state = getStateFromStore();
    return state;
  },
  componentDidMount: function() {
    StatusMonitorStore.listen(this.onChange);
  },
  componentWillUnmount: function() {
    StatusMonitorStore.unlisten(this.onChange);
  },
  onChange: function() {
    this.setState(getStateFromStore());
  },
  render: function() {
    var rootStyles = classSet({
      'calendar container-fluid': true,
      'online': this.state.status,
      'offline': !this.state.status
    });

    return (
      <div role='application' className={rootStyles}>
        <header>
          <h1>
            <span className='glyphicon glyphicon-calendar' aria-hidden='true'></span>
            Kalendář
          </h1>
        </header>

        <main className='content' role='main'>
          <RouteHandler {...this.props}/>
        </main>
      </div>
    );
  }
});

module.exports = Calendar;
