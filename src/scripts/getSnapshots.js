import Rx from 'rx';
import moment from 'moment';
import TimeRangeSnapshot from './TimeRangeSnapshot';

// Get a series of TimeRangeSnapshots for months of a given year
export default function getSnapshots(year, colourer) {
  return Rx.Observable.range(1, 12)
    .map((i) => {
      var month = moment().set({ year: year, month: i-1 }),
          start = month.clone().startOf('month'),
          end   = month.clone().endOf('month');
      return new TimeRangeSnapshot(start, end, colourer);
    });
}
