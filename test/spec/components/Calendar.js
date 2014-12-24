'use strict';

describe('Calendar', function () {
  var Calendar, component;

  beforeEach(function () {
    Calendar = require('../../../src/scripts/components/Calendar.jsx');
    component = Calendar();
  });

  it('should create a new instance of Calendar', function () {
    expect(component).toBeDefined();
  });
});
