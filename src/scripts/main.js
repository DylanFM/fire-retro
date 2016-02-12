import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import create from 'virtual-dom/create-element';
import mainLoop from 'main-loop';
import _ from 'lodash';

import Map from './Map';
import snapshotsBetween from './snapshotsBetween';
import render from './render';
import hexGridLayer from './hexGridLayer';
import pointsLayer from './pointsLayer';

(() => {
  'use strict';

  var map = new Map('map'),
      state, loop;

  // Our state :o
  state = {
    moreInfo:         true,
    loading:          true,
    loadingProgress:  {},
    start:            new Date(2014, 0, 1),   // Begin at the start of 2014
    end:              new Date(2015, 11, 31), // Finish at the end of 2014
    current:          0,                      // Key of our focus. Start at the beginning
    paused:           false,                  // Play by default
    data:             [],                     // To be filled in after data loads
    layers:           {
      points:         true,
      hex:            false
    }
  };

  // Setup the mainloop with an initial blank state and render function
  loop = mainLoop(state, render, { create: create, diff: diff, patch: patch });
  // Add to DOM
  document.body.appendChild(loop.target);

  loadData();

  // Fetch the data from the server, handle loading state and set things up
  function loadData() {
    state.data = snapshotsBetween(state.start, state.end);
    observeLoading();
  }

  function observeLoading() {
    if (!state.loading) {
      return;
    }

    var total    = state.data.length,
        progress = _.countBy(
      _.invoke(state.data, 'isFulfilled')
    )[true];

    if (total === progress) {
      delete state.loadingProgress;
      state.loading = false;
      state.data    = _.invoke(state.data, 'valueOf');
      play();
    } else {
      state.loading = true;
      // Provide access to loading state
      state.loadingProgress = {
        total:     total,
        progress:  progress
      };
      renderCurrent();
      _.delay(observeLoading, 200);
    }
  }

  // When controls change
  document.body.addEventListener('change', (e) => {
    state.layers = getLayerVisibility();
    state.paused = getPlayPauseState();
    _.delay(renderCurrent, 5); // Render
  });

  // More information link
  document.body.addEventListener('click', (e) => {
    var n = e.target;
    if (n.tagName !== 'A' && n.id !== 'moreInfoToggle') {
      return;
    }
    e.preventDefault();
    state.moreInfo = !state.moreInfo; // Toggle
    _.delay(renderCurrent, 5); // Render
  });

  function play() {
    // We'll iterate through it 1 by 1, on a delay, rendering
    var next = () => {
      renderCurrent();
      if (state.paused) {
        // Check again in half a second
        _.delay(next, 500);
      } else {
        // If there are more, proceed
        if ((state.current + 1) < state.data.length) {
          state.current++;   // Move to next state
        } else {
          state.current = 0; // Loop
        }
        _.delay(next, 3000); // Delay for 3sec
      }
    };
    next(); // First
  }

  // Render the current data item
  function renderCurrent() {
    loop.update(state); // Update rendering
    updateMap(state);   // Render map too
  }

  // Update map with new data
  function updateMap(state) {
    var layers = [],
        data   = state.data[state.current];
    if (!data.features || !data.features.length) {
      return;
    }
    if (state.layers.points) {
      layers.push(pointsLayer(data));
    }
    if (state.layers.hex) {
      layers.push(hexGridLayer(data));
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
    return layers;
  }

  // Return state of play / pause controls
  function getPlayPauseState() {
    return document.getElementById('pause').checked;
  }

}());
