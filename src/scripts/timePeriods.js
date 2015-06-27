// Return a series of time periods between the 2 dates, incrementing by month
export default (start, end) => {
  var periods = [];
  while(start.isBefore(end)) {
    periods.push({
      start:  start.startOf('month'),
      end:    start.clone().endOf('month')
    });
    // Add a month
    start = start.clone().add(1, 'M');
  }
  return periods;
};
