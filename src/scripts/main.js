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

  var map     = new Map('map'),
      current = 0, // Current key that we're up to
      apiData, loop;

  // Setup the mainloop with an initial blank state and render function
  loop = mainLoop(newState({}), render, { create: create, diff: diff, patch: patch });
  // Add to DOM
  document.body.appendChild(loop.target);
  var start    = moment().set({ year: 2014, month: 0 }).startOf('month'),
      end      = moment().set({ year: 2014, month: 11 }).endOf('month'),
      requests = snapshotsBetween(start, end);

  // When all XHR requests are complete
  requests.done((data) => {
    apiData = data; // We have a collection of data
    play();         // Begin playing
  });

  // When controls change
  document.body.addEventListener('change', (e) => {
    _.delay(renderCurrent, 50);
  });

  function play() {
    // We'll iterate through it 1 by 1, on a delay, rendering
    var next = () => {
      renderCurrent();
      // If there are more, proceed
      if ((current + 1) < apiData.length) {
        current++;           // Move to next state
        _.delay(next, 3000); // Delay for 3sec
      }
    };
    // First render
    next();
  }

  // Render the current data item
  function renderCurrent() {
    var state = newState(apiData[current]); // Get the data and merge with other details
    loop.update(state);                     // Update rendering
    updateMap(state);                       // Render map too
  }

  // Taking the data and merging it with other details, get the state for the app
  function newState(data) {
    return _.assign({}, data, getLayerVisibility());
  }

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
    var layers = {},
        hex    = document.getElementById('hex'),
        points = document.getElementById('points');
    if (hex && points) {
      // If we have the controls, use their state as the config
      layers.hex    = hex.checked;
      layers.points = points.checked;
    }
    // If neither hex nor points is checked, provide a default
    if (!layers.hex && !layers.points) {
      layers.hex = true; // Default is hex
    }
    return { layers: layers };
  }

}());
