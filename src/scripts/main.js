import Colourer from './Colourer';
import Map from './Map';
import getSnapshots from './getSnapshots';
import TimelineViewer from './TimelineViewer';
import d3 from 'd3';
import Rx from 'rx';
import h from 'virtual-dom/h';
import createElement from 'virtual-dom/create-element';

(() => {
  'use strict';

  var colourer = new Colourer(),               // To handle colours for this run
      months   = getSnapshots(2014, colourer), // Get months for 2014
      map, viewer;

  document.addEventListener('DOMContentLoaded', () => {
    // Load all data
    months
      .map((month) => {
        month.loadData();
        return month;
      })
      .toArray()
      .subscribeOnNext((monthsArr) => {
        // Initialise the viewer and begin
        viewer = new TimelineViewer(
          new Map('map'),                         // Construct new map. Pass in the ID of the DOM element
          new Rx.Observable.fromArray(monthsArr), // Convert back into a new observable with data loading
          colourer
        );
        // Progress every 2 seconds
        viewer.play(2000);
      });
  });

}());
