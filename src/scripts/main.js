import Colourer from './Colourer';
import Map from './Map';
import moment from 'moment';
import fetchData from './fetchData';
import buildUrl from './buildUrl';
import SummaryComponent from './components/SummaryComponent';
import hexGridLayer from './hexGridLayer';
import pointsLayer from './pointsLayer';

(() => {
  'use strict';

  var colourer = new Colourer(),
      map = new Map('map'),
      summary = new SummaryComponent(),
      start = moment().set({ year: 2015, month: 0 }).startOf('month'),
      end = moment().set({ year: 2015, month: 6 }).endOf('month');

  fetchData(buildUrl(start, end)).then((data) => {
    // Render summary component
    summary.render(start, end, data);
    // Render map layers
    map.render([
      pointsLayer(colourer, data),
      hexGridLayer(colourer, data)
    ]);
  });

}());
