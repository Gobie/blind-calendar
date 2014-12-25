'use strict';

describe('CalendarList', function () {
  var CalendarList, component;

  beforeEach(function () {
    CalendarList = require('../../../src/scripts/components/CalendarList.jsx');
    component = CalendarList();
  });

  it('should create a new instance of CalendarList', function () {
    expect(component).toBeDefined();
  });
});
