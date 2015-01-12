import Map from './Map';
import getSnapshots from './getSnapshots';
import d3 from 'd3';

(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    // Get months for 2014 and map them into snapshots
    var months = getSnapshots(2014);

    // Load up data for all months
    months.forEach((month) => month.loadData());

    // Construct new map. Pass in the ID of the DOM element
    var map = new Map('map');

    var layer;

    function renderSnapshot(k) {
      var snapshot = months[k];
      // If this isn't the 1st, remove the previous one
      if (k > 0) {
        map.removeSnapshot(months[k-1]);
      }
      // Add data to map
      map.addSnapshot(snapshot);
      // Render the next one if there is one
      if (k+1 < months.length) {
        // 2sec delay
        var renderNext = setInterval(() => {
          clearInterval(renderNext);
          renderSnapshot(k+1);
        }, 2000);
      }
    }

    var wait = setInterval(() => {
      // Has the first item's data loaded?
      if (months[0].data) {
        clearInterval(wait);
        renderSnapshot(0);
      }
    }, 500);

  });

}());
