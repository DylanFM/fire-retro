import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import create from 'virtual-dom/create-element';
import mainLoop from 'main-loop';
import _ from 'lodash';

import moment from 'moment';
import Map from './Map';
import snapshotsBetween from './snapshotsBetween';

import hexGridLayer from './hexGridLayer';
import pointsLayer from './pointsLayer';

import summary from './components/summary';

(() => {
  'use strict';

  var map = new Map('map'),
      loop;

  // Setup the mainloop with an initial blank state and render function
  loop = mainLoop({}, render, { create: create, diff: diff, patch: patch });
  // Add to DOM
  document.body.appendChild(loop.target);

  // Render app with state
  function render(state) {
    // Currently just the summary component
    return summary(state);
  }

  // Update map with new data
  function updateMap(state) {
    map.render([
      pointsLayer(state),
      hexGridLayer(state)
    ]);
  }

  var start    = moment().set({ year: 2014, month: 0 }).startOf('month'),
      end      = moment().set({ year: 2014, month: 11 }).endOf('month'),
      requests = snapshotsBetween(start, end);

  // When all XHR requests are complete
  requests.done((data) => {
    // We have a collection of data
    // We'll iterate through it 1 by 1, on a delay, rendering
    var next = () => {
      var state = data.shift();
      // Update rendering
      loop.update(state);
      // Render map too
      updateMap(state);
      // If there are more, render again
      if (data.length) {
        _.delay(next, 3000);
      }
    };
    // First render
    next();
  });

}());
