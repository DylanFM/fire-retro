import moment from 'moment';
import Rx from 'rx';

// Get an observable of moment objects of the months for a given year
export default function getMonths(year) {
  'use strict';

  return Rx.Observable.range(1, 12)
    .map((i) => {
      // Make a moment object of the month
      return moment().set({ year: year, month: i-1 });
    });
}
