import getMonths from './getMonths';
import TimeRangeSnapshot from './TimeRangeSnapshot';

// Get a series of TimeRangeSnapshots for a given year
export default function getMonths(year) {
  return getMonths(2014)
    .map((month) => {
      var start = month.clone().startOf('month'),
          end   = month.clone().endOf('month');
      return new TimeRangeSnapshot(start, end);
    });
}