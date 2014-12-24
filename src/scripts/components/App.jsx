'use strict';

var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('../../../bower_components/bootstrap/dist/css/bootstrap.min.css');
require('../../../bower_components/bootstrap/dist/css/bootstrap-theme.min.css');
require('../../styles/main.styl');

var App = React.createClass({
  render: function() {
    return (
      <div className='main container'>
        <header>
          <ul className='nav nav-pills'>
            <li role='presentation' ><Link to='/'>Kalendář</Link></li>
            <li role='presentation' ><Link to='add'>Přidat událost</Link></li>
          </ul>
        </header>

        <RouteHandler {...this.props}/>
      </div>
    );
  }
});

module.exports = App;
