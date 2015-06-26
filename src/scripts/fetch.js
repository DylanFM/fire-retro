import Q from 'q';
import d3 from 'd3';
import Config from './config';

// Given a start and end date, return an API URL fetching data for the range
function buildUrl(start, end) {
  var st = window.encodeURIComponent(start.clone().utc().format()),
      en = window.encodeURIComponent(end.clone().utc().format());
  return Config.endpoint + '?timeStart=' + st + '&timeEnd=' + en;
}

// Return a promise resolved with the URL's response
function fetchData(url) {
  return Q.Promise((resolve, reject) => {
    d3.json(url, (err, json) => {
      if (err || !json.features) {
        reject(err);
      } else {
        resolve(json);
      }
    });
  });
}

// Make an API request for data within a time period, returning a promise
export default function (start, end) {
  return fetchData(buildUrl(start, end));
}
