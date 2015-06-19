import Config from './config';

// Given a start and end date, return an API URL fetching data for the range
export default function buildUrl(start, end) {
  var st = window.encodeURIComponent(start.clone().utc().format()),
      en = window.encodeURIComponent(end.clone().utc().format());
  return Config.endpoint + '?timeStart=' + st + '&timeEnd=' + en;
}
