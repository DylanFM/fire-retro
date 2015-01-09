import moment from 'moment';

// Get a collection of ranges defined by timestamps
// for a given year. Ranges are for each month in the year.
export default function (year) {
  'use strict';

  var month  = 0,
      ranges = [];

  while (month < 12) {
    // Make a moment object of the month
    var date = moment().set({ year: year, month: month });
    // Add it to our array of date ranges
    ranges.push([
      date.startOf('month').format(),
      date.endOf('month').format()
    ]);
    // Next month...
    month++;
  }

  return ranges;
}
