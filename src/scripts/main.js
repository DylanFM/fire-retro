import Map from './Map';
import getMonths from './getMonths';
import TimeRangeSnapshot from './TimeRangeSnapshot';
import d3 from 'd3';

(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Construct new map. Pass in the ID of the DOM element
    var map = new Map('map');


    var months = getMonths(2014);

    var ranges = months.map((month) => {
      return new TimeRangeSnapshot(
        month.clone().startOf('month'),
        month.clone().endOf('month')
      );
    });

    // Load all data
    ranges.forEach((range) => {
      range.loadData();
    });

    var layer;

    function renderRange(k) {
      var range = ranges[k];

      console.log('range', k, range.start.format('MM-YYYY'), range.count);

      // If there's a layer, remove it
      if (layer) {
        map.map.removeLayer(layer);
      }

      // Add data to map and store reference to layer
      layer = map.addGeoJSON(range.data);

      // Render the next one if it's ready
      if (k < ranges.length) {
        var renderNext = setInterval(() => {
          clearInterval(renderNext);
          renderRange(k+1);
        }, 2000);
      }
    }

    var wait = setInterval(() => {
      // Has the first item's data loaded?
      if (ranges[0].data) {
        clearInterval(wait);
        renderRange(0);
      }
    }, 500);

  });

}());
