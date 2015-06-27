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

import h from 'virtual-dom/h';
import controls from './components/controls';
import summary from './components/summary';

(() => {
  'use strict';

  var map = new Map('map'),
      loop;

  // Setup the mainloop with an initial blank state and render function
  loop = mainLoop(newState({}), render, { create: create, diff: diff, patch: patch });
  // Add to DOM
  document.body.appendChild(loop.target);

  // Render app with state
  function render(state) {
    return h('section', [
      summary(state),
      controls(state)
    ]);
  }

  // Update map with new data
  function updateMap(state) {
    var layers = [];
    if (state.layers.points) {
      layers.push(pointsLayer(state));
    }
    if (state.layers.hex) {
      layers.push(hexGridLayer(state));
    }
    // Render the layers
    map.render(layers);
  }

  // Return state config controlling visibility of map layers
  function getLayerVisibility() {
    return {
      layers: { points: false, hex: true }
    };
  }

  // Taking the data and merging it with other details, get the state for the app
  function newState(data) {
    return _.assign({}, data, getLayerVisibility());
  }

  var start    = moment().set({ year: 2014, month: 0 }).startOf('month'),
      end      = moment().set({ year: 2014, month: 11 }).endOf('month'),
      requests = snapshotsBetween(start, end);

  // When all XHR requests are complete
  requests.done((data) => {
    // We have a collection of data
    // We'll iterate through it 1 by 1, on a delay, rendering
    var next = () => {
      // Take the first chunk from data, merge with other details
      var state = newState(data.shift());
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
