var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;

var App = require('./App');
var Calendar = require('./Calendar');
var CalendarAdd = require('./CalendarAdd');

var routes = (
  <Route path="/" handler={App}>
    <Route name="add" handler={CalendarAdd} />
    <DefaultRoute handler={Calendar} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  var params = state.params;
  React.render(<Handler params={params}/>, document.getElementById('content'));
});
