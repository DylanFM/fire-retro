import h from 'virtual-dom/h';
import _ from 'lodash';
import {format} from 'd3-time-format';
import {linear} from 'd3-scale';

var m = format('%b'),
    y = format('%Y');

function step(data, i, isCurrent, scale) {
  var nodes = [m(data.start)];
  // Add year to January
  if (i%12 === 0) {
    nodes[1] = h('br');
    nodes[2] = h('b', y(data.start));
  }
  return h('li', {
    className: isCurrent ? 'current' : ''
  }, [
    h('span.count', {
      style: { height: scale(data.count) }
    }, ''),
    h('span.name', nodes)
  ]);
}

// Return a d3 scale for the given values
function getScale(counts) {
  return linear().domain([0, _.max(counts)]).range([0,106]);
}

function steps(state) {
  var scale = getScale(_.pluck(state.data, 'count'));

  return state.data.map((data, i) => {
    return step(
      data,
      i,
      state.current == i,
      scale
    );
  });
}

export default (state) => {
  return h('ol.timeline#timeline', steps(state));
};
