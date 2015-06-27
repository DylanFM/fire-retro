import Config from './config';
import Q from 'q';
import {json} from 'd3-xhr';
import timePeriods from './timePeriods';

// Given a start and end date, return an API URL fetching data for the range
function buildUrl(start, end) {
  var st = window.encodeURIComponent(start.clone().utc().format()),
      en = window.encodeURIComponent(end.clone().utc().format());
  return Config.endpoint + '?timeStart=' + st + '&timeEnd=' + en;
}

// Make an API request for data within a time period, returning a promise
function fetchSnapshot(start, end) {
  return Q.Promise((resolve, reject) => {
    json(buildUrl(start, end), (err, json) => {
      if (err || !json.features) {
        reject(err);
      } else {
        // Set the start and end on the response
        json.start = start;
        json.end = end;
        resolve(json);
      }
    });
  });
}

// Generate a series of date ranges between the start and end dates
// Convert each range into a promise representing an XHR request for the data
// Use this collection of promises as an argument to Q.all to represent overall success
// Return the Q.all promise
export default (start, end) => {
  return Q.all(timePeriods(start, end).map((range) => fetchSnapshot(range.start, range.end)));
};
