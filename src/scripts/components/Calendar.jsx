'use strict';

var React = require('react/addons');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('../../../bower_components/bootstrap/dist/css/bootstrap.min.css');
require('../../../bower_components/bootstrap/dist/css/bootstrap-theme.min.css');
require('../../styles/Calendar.styl');

var Calendar = React.createClass({
  mixins: [Navigation],
  /** TODO mixin */
  componentDidMount: function() {
    combokeys.bind('ctrl+alt+s', this._navigateToList);
    combokeys.bind('ctrl+alt+p', this._navigateToAdd);
  },
  componentWillUnmount: function() {
    combokeys.unbind('ctrl+alt+p');
    combokeys.unbind('ctrl+alt+s');
  },
  _navigateToList: function() {
    this.transitionTo('/');
  },
  _navigateToAdd: function() {
    this.transitionTo('/add');
  },
  render: function() {
    return (
      <div className='main container-fluid'>
        <header>
          <ul className='nav nav-pills'>
            <li role='presentation' ><Link to='/'>Seznam událostí</Link></li>
            <li role='presentation' ><Link to='add'>Vytvořit událost</Link></li>
          </ul>
        </header>

        <RouteHandler {...this.props}/>
      </div>
    );
  }
});

module.exports = Calendar;
