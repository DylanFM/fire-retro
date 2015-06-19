import Q from 'q';
import d3 from 'd3';

// Return a promise resolved with the URL's response
export default function fetchData(url) {
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
