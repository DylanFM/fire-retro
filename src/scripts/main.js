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
      loop;

  // Setup the mainloop with an initial blank state and render function
  loop = mainLoop({ current: {} }, render, { create: create, diff: diff, patch: patch });
  // Add to DOM
  document.body.appendChild(loop.target);

  // When there's new data...
  dataStream.subscribe((state) => {
    // Update rendering
    loop.update(state);
    // Render map too
    updateMap(state);
  });

  // Render app with state
  function render(state) {
    // Currently just the summary component
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
  var start = moment().set({ year: 2015, month: 0 }).startOf('month'),
      end   = moment().set({ year: 2015, month: 6 }).endOf('month');

  // Fetch this chunk of data
  fetch(start, end).then((data) => {
    data.start = start;
    data.end = end;
    dataStream.onNext(data);
  });

}());
