import moment from 'moment';

// Get moment objects of the months for a given year
export default function (year) {
  'use strict';

  var months = [],
      month;

  for (month = 0; month < 12; month++) {
    // Make a moment object of the month
    var date = moment().set({ year: year, month: month });
    // Add it to our array of months
    months.push(date);
  }

  return months;
}
