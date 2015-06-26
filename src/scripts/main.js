import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import create from 'virtual-dom/create-element';
import mainLoop from 'main-loop';

import Rx from 'rx';
import moment from 'moment';
import Colourer from './Colourer';
import Map from './Map';
import fetch from './fetch';

import hexGridLayer from './hexGridLayer';
import pointsLayer from './pointsLayer';

import summary from './components/summary';

(() => {
  'use strict';

  var dataStream = new Rx.Subject(),
      colourer   = new Colourer(),
      map        = new Map('map'),
      appState, loop;

  // There is one state object that the app is rendered from
  appState = {
    start:     moment(),
    end:       moment(),
    features:  []
  };

  // Setup the mainloop with the state and render function
  loop = mainLoop(appState, render, { create: create, diff: diff, patch: patch });
  // Add to DOM
  document.body.appendChild(loop.target);

  // When there's new data...
  dataStream.subscribe((data) => {
    // Update state
    appState.features = data.features;
    // Update rendering
    loop.update(appState);
    // Render map too
    updateMap(appState);
  });

  // Render app with state
  function render(state) {
    // Currently just the state component
    return summary(state, colourer);
  }

  // Update map with new data
  function updateMap(state) {
    map.render([
      pointsLayer(colourer, state),
      hexGridLayer(colourer, state)
    ]);
  }

  // Just one date range... this for now
  appState.start = moment().set({ year: 2015, month: 0 }).startOf('month');
  appState.end   = moment().set({ year: 2015, month: 6 }).endOf('month');

  // Fetch this chunk of data
  fetch(appState.start, appState.end, dataStream);

}());
