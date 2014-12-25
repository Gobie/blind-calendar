'use strict';

describe('Calendar', function () {
  var Calendar, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    Calendar = require('../../../src/scripts/components/Calendar.jsx');
    component = Calendar();
  });

  it('should create a new instance of Calendar', function () {
    expect(component).toBeDefined();
  });
});
