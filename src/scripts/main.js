import setupMap from './setupMap';
import d3 from 'd3';

(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    var map = setupMap();

    d3.json('http://localhost:8000/incidents?timeStart=2014-01-24T00:00:00Z&timeEnd=2014-01-24T23:59:59Z', (json) => {
      L.geoJson(json, {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius:       5,
            fillOpacity:  0.5
          });
        }
      }).addTo(map);
    });
  });
}());
