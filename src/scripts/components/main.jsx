var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var moment = require('moment');
moment.locale('cs');
var Combokeys = require('combokeys');
window.combokeys = new Combokeys(document);

var Calendar = require('./Calendar');
var CalendarList = require('./CalendarList');
var CalendarAdd = require('./CalendarAdd');

var routes = (
  <Route path='/' handler={Calendar}>
    <Route name='add' handler={CalendarAdd} />
    <DefaultRoute handler={CalendarList} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  var params = state.params;
  React.render(<Handler params={params}/>, document.getElementById('content'));
});
