import Map from './Map';
import getMonths from './getMonths';
import d3 from 'd3';

(() => {
  'use strict';

  var months = getMonths(2014);

  document.addEventListener('DOMContentLoaded', () => {
    // Construct new map. Pass in the ID of the DOM element
    var map = new Map('map');

    var layer,
        urls = [];

    for (var month of months) {
      var st = window.encodeURIComponent(month.startOf('month').utc().format()),
          en = window.encodeURIComponent(month.endOf('month').utc().format());
      urls.push('http://localhost:8000/incidents?timeStart=' + st + '&timeEnd=' + en);
    }

    function renderNextUrlData() {
      if (!urls.length) {
        return; // Exit if no more URLs
      }
      // Fetch data for next URL
      d3.json(urls.shift(), (json) => {
        // If there's a layer, remove it
        if (layer) {
          map.map.removeLayer(layer);
        }
        // Add data to map and store reference to layer
        layer = map.addGeoJSON(json);
        // Step forward
        window.setInterval(() => {
          renderNextUrlData();
        }, 3000);
      });
    }

    // Begin
    renderNextUrlData();
  });
}());
