import {rgb} from 'd3-color';
import {scaleQuantize} from 'd3-scale';

// Returns a new random d3 colour
function randomColour() {
  return new rgb(
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255)
  );
}

// Return a colour for a key
// Cache the colour so it's the same for all calls for key
export default (function () {
  // This is the colour cache...
  var cache = {};

  return (key) => {
    var colour;
    key = key.toUpperCase();
    if (cache[key]) {
      colour = cache[key];
    } else {
      colour = randomColour();
      cache[key] = colour;
    }
    return colour;
  };
}());


// Returns a sequential d3 quantize scale with a domain from min to max
export function getSequentialScale(min, max) {
  return scaleQuantize()
    .domain([min, max])
    .range(['rgb(254,240,217)','rgb(253,212,158)','rgb(253,187,132)','rgb(252,141,89)','rgb(239,101,72)','rgb(215,48,31)','rgb(153,0,0)']); // Colorbrewer
}
