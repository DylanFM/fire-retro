import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import create from 'virtual-dom/create-element';
import mainLoop from 'main-loop';
import _ from 'lodash';

import moment from 'moment';
import Map from './Map';
import fetch from './fetch';
import Q from 'q';

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

  var start  = moment().set({ year: 2014, month: 0 }).startOf('month'),
      end    = moment().set({ year: 2014, month: 11 }).endOf('month'),
      // Generate a series of date ranges between the start of 2014 and now
      // Convert each range into a promise representing an XHR request for the data
      // Use this collection of promises as an argument to Q.all to represent overall success
      requests = Q.all(getTimePeriods(start, end).map((range) => fetch(range.start, range.end)));

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

  // Return a series of time periods between the 2 dates, incrementing by month
  function getTimePeriods(start, end) {
    var periods = [];
    while(start.isBefore(end)) {
      periods.push({
        start:  start.startOf('month'),
        end:    start.clone().endOf('month')
      });
      // Add a month
      start = start.clone().add(1, 'M');
    }
    return periods;
  }

}());
