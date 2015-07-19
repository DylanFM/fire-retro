import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import create from 'virtual-dom/create-element';
import mainLoop from 'main-loop';
import _ from 'lodash';

import Map from './Map';
import snapshotsBetween from './snapshotsBetween';

import hexGridLayer from './hexGridLayer';
import pointsLayer from './pointsLayer';

import h from 'virtual-dom/h';
import controls from './components/controls';
import summary from './components/summary';
import timeline from './components/timeline';

(() => {
  'use strict';

  var map = new Map('map'),
      state, loop;

  // Our state :o
  state = {
    start:     new Date(2014, 0, 1),   // Begin at the start of 2014
    end:       new Date(2014, 11, 31), // Finish at the end of 2014
    current:   0,                      // Key of our focus. Start at the beginning
    data:      [],                     // To be filled in after data loads
    layers:    {
      points:  false,
      hex:     true                    // Default to hexgrid
    }
  };

  // Setup the mainloop with an initial blank state and render function
  loop = mainLoop(state, render, { create: create, diff: diff, patch: patch });
  // Add to DOM
  document.body.appendChild(loop.target);

  // Fetch the data
  snapshotsBetween(state.start, state.end).done((data) => {
    state.data = data; // We have a collection of data
    play();            // Begin playing
  });

  // When controls change
  document.body.addEventListener('change', (e) => {
    state.layers = getLayerVisibility(); // Update state
    _.delay(renderCurrent, 50);          // Render
  });

  function play() {
    // We'll iterate through it 1 by 1, on a delay, rendering
    var next = () => {
      renderCurrent();
      // If there are more, proceed
      if ((state.current + 1) < state.data.length) {
        state.current++;     // Move to next state
        _.delay(next, 3000); // Delay for 3sec
      }
    };
    // First render
    next();
  }

  // Render the current data item
  function renderCurrent() {
    loop.update(state); // Update rendering
    updateMap(state);   // Render map too
  }

  // Render app with state
  function render(state) {
    return h('section', {
      className: state.layers.hex ? 'layer-hex' : 'layer-points'
    }, [
      summary(state),
      controls(state),
      timeline(state)
    ]);
  }

  // Update map with new data
  function updateMap(state) {
    var layers = [],
        data   = state.data[state.current];
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

}());
