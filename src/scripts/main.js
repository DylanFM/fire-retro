import Map from './Map';
import d3 from 'd3';

(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Construct new map. Pass in the ID of the DOM element
    var map = new Map('map');

    d3.json('http://localhost:8000/incidents?timeStart=2014-01-24T00:00:00Z&timeEnd=2014-01-24T23:59:59Z', (json) => {
      map.addGeoJSON(json);
    });
  });
}());
