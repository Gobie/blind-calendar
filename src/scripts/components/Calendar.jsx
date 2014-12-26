'use strict';

var React = require('react/addons');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;
var State = Router.State;
var RouteHandler = Router.RouteHandler;

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('../../../bower_components/bootstrap/dist/css/bootstrap.min.css');
require('../../../bower_components/bootstrap/dist/css/bootstrap-theme.min.css');
require('../../styles/Calendar.styl');

var Calendar = React.createClass({
  mixins: [Navigation, State],
  /** TODO mixin */
  componentDidMount: function() {
    combokeys.bind('ctrl+alt+s', this.navigateToList);
    combokeys.bind('ctrl+alt+p', this.navigateToAdd);
  },
  componentWillUnmount: function() {
    combokeys.unbind('ctrl+alt+p');
    combokeys.unbind('ctrl+alt+s');
  },
  navigateToList: function() {
    this.transitionTo('/');
  },
  navigateToAdd: function() {
    this.transitionTo('/add');
  },
  getClassName: function(to) {
    var isActive = this.isActive(to, this.getParams(), this.getQuery());
    return isActive ? 'active' : '';
  },
  render: function() {
    return (
      <div className='container-fluid'>
        <header>
          <h1>
            <span className='glyphicon glyphicon-calendar' aria-hidden='true'></span>
            Kalendář
          </h1>
        </header>

        <nav>
          <ul className='nav nav-pills' role='menu'>
            <li role='presentation' className={this.getClassName('/')}><Link to='/' role='menuitem'>Seznam událostí</Link></li>
            <li role='presentation' className={this.getClassName('/add')}><Link to='add' role='menuitem'>Vytvořit událost</Link></li>
          </ul>
        </nav>

        <main className='content row'>
          <RouteHandler {...this.props}/>
        </main>
      </div>
    );
  }
});

module.exports = Calendar;
