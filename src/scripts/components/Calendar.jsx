'use strict';

var React = require('react/addons');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;
var State = Router.State;
var RouteHandler = Router.RouteHandler;
var Combokeys = require('combokeys');
var combokeys = new Combokeys(document);

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
    combokeys.bind(['ctrl+alt+s', '1'], this.navigateToList);
    combokeys.bind(['ctrl+alt+p', '2'], this.navigateToAdd);
  },
  componentWillUnmount: function() {
    combokeys.unbind(['ctrl+alt+p', '2']);
    combokeys.unbind(['ctrl+alt+s', '1']);
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
      <div role='application' className='container-fluid'>
        <header>
          <h1>
            <span className='glyphicon glyphicon-calendar' aria-hidden='true'></span>
            Kalendář
          </h1>
        </header>

        <nav role='navigation'>
          <ul className='nav nav-pills'>
            <li role='presentation' className={this.getClassName('/')}><Link to='/'>Seznam událostí</Link></li>
            <li role='presentation' className={this.getClassName('/add')}><Link to='add'>Vytvořit událost</Link></li>
          </ul>
        </nav>

        <main className='content' role='main'>
          <RouteHandler {...this.props}/>
        </main>
      </div>
    );
  }
});

module.exports = Calendar;
