import Config from './config';
import tail from 'lodash/tail';
import zip from 'lodash/zip';
import Q from 'q';
import {json} from 'd3-request';
import {utcMonths} from 'd3-time';
import {utcFormat} from 'd3-time-format';

var f = utcFormat("%Y-%m-%dT%H:%M:%SZ");

// Given a start and end date, return an API URL fetching data for the range
function buildUrl(start, end) {
  var st = window.encodeURIComponent(f(start)),
      en = window.encodeURIComponent(f(end));
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
        // Also, let's take the count
        json.count = json.features.length;
        resolve(json);
      }
    });
  });
}

// Return a series of months between the 2 dates
export default (start, end) => {
  var beginnings = utcMonths(start, end),
      endings    = tail(utcMonths(start, new Date(end).setMonth(end.getMonth()+1)));
  // Zip together to have a collection of ranges covering each month
  return zip(beginnings, endings).map((bounds) => fetchSnapshot(bounds[0], bounds[1]));
};
