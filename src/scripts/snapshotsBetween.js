import Config from './config';
import _ from 'lodash';
import Q from 'q';
import {json} from 'd3-xhr';
import {utcMonth} from 'd3-time';
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
function monthsBetween (start, end) {
  var beginnings = utcMonth.range(start, end),
      endings    = _.rest(utcMonth.range(start, new Date(end).setMonth(end.getMonth()+1)));
  // Zip together to have a collection of ranges covering each month
  return _.zip(beginnings, endings).map((bounds) => fetchSnapshot(bounds[0], bounds[1]));
}

// Generate a series of date ranges between the start and end dates
// Convert each range into a promise representing an XHR request for the data
// Use this collection of promises as an argument to Q.all to represent overall success
// Return the Q.all promise
export default (start, end) => {
  return Q.all(monthsBetween(start, end));
};
