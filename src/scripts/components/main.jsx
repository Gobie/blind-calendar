var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var moment = require('moment');
moment.locale('cs');

var Calendar = require('./Calendar');
var CalendarList = require('./CalendarList');

var StatusMonitorFirebaseUtils = require('../utils/StatusMonitorFirebaseUtils');
var status = new StatusMonitorFirebaseUtils;
status.monitor();

var routes = (
  <Route path='/' handler={Calendar}>
    <DefaultRoute handler={CalendarList} />
  </Route>
);

Router.run(routes, function (Handler, state) {
  var params = state.params;
  React.render(<Handler params={params}/>, document.getElementById('content'));
});
