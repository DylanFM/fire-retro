import Map from './Map';
import getSnapshots from './getSnapshots';
import TimelineViewer from './TimelineViewer';
import d3 from 'd3';

(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    var months = getSnapshots(2014), // Get months for 2014 and map them into snapshots
        map    = new Map('map'),     // Construct new map. Pass in the ID of the DOM element
        wait, viewer;

    // Load up data for all months
    months.forEach((month) => month.loadData());

    // We wait until the data has been loaded for the 1st one... check every half second
    wait = setInterval(() => {
      // Has the first item's data loaded?
      if (months[0].data) {
        // We no longer need to wait
        clearInterval(wait);
        // Initialise the viewer and begin
        viewer = new TimelineViewer(map, months);
        // Progress every 3 seconds
        var renderNext = setInterval(() => {
          // clearInterval(renderNext);
          viewer.next();
        }, 3000);
      }
    }, 500);

  });

}());
