'use strict';

var React = require('react/addons');
var Router = require('react-router');
var State = Router.State;
var RouteHandler = Router.RouteHandler;

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

require('../../styles/normalize.css');
require('../../../bower_components/bootstrap/dist/css/bootstrap.min.css');
require('../../../bower_components/bootstrap/dist/css/bootstrap-theme.min.css');
require('../../styles/Calendar.styl');

var Calendar = React.createClass({
  mixins: [State],
  getClassName: function(to) {
    var isActive = this.isActive(to, this.getParams(), this.getQuery());
    return isActive ? 'active' : '';
  },
  render: function() {
    return (
      <div role='application' className='calendar container-fluid'>
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
