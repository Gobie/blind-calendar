'use strict';

describe('Main', function () {
  var BlindApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    BlindApp = require('../../../src/scripts/components/BlindApp.jsx');
    component = BlindApp();
  });

  it('should create a new instance of BlindApp', function () {
    expect(component).toBeDefined();
  });
});
