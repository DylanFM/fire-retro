import Rx from 'rx';
import moment from 'moment';
import Colourer from './Colourer';
import Map from './Map';
import fetch from './fetch';
import SummaryComponent from './components/SummaryComponent';
import hexGridLayer from './hexGridLayer';
import pointsLayer from './pointsLayer';

(() => {
  'use strict';

  var dataStream = new Rx.Subject(),
      colourer   = new Colourer(),
      map        = new Map('map'),
      summary    = new SummaryComponent();

  // Render on new chunks of data
  dataStream.subscribe(render);

  // Just one date range... this for now
  var start = moment().set({ year: 2015, month: 0 }).startOf('month'),
      end   = moment().set({ year: 2015, month: 6 }).endOf('month');

  // Fetch this chunk of data
  fetch(start, end, dataStream);

  // Render new data
  function render(data) {
    // Render summary component
    summary.render(data.start, data.end, data, colourer);
    // Render map layers
    map.render([
      pointsLayer(colourer, data),
      hexGridLayer(colourer, data)
    ]);
  }

}());
