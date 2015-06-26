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
    current: {} // Begins empty
  };

  // Setup the mainloop with the state and render function
  loop = mainLoop(appState, render, { create: create, diff: diff, patch: patch });
  // Add to DOM
  document.body.appendChild(loop.target);

  // When there's new data...
  dataStream.subscribe((data) => {
    // Update state
    appState.current = data;
    // Update rendering
    loop.update(appState);
    // Render map too
    updateMap(appState);
  });

  // Render app with state
  function render(state) {
    // Currently just the state component
    return summary(state.current, colourer);
  }

  // Update map with new data
  function updateMap(state) {
    map.render([
      pointsLayer(colourer, state.current),
      hexGridLayer(colourer, state.current)
    ]);
  }

  // Just one date range... this for now
  var start = moment().set({ year: 2015, month: 0 }).startOf('month'),
      end   = moment().set({ year: 2015, month: 6 }).endOf('month');

  // Fetch this chunk of data
  fetch(start, end).then((data) => {
    data.start = start;
    data.end = end;
    dataStream.onNext(data);
  });

}());
