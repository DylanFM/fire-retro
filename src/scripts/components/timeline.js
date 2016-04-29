import max from 'lodash/max';
import map from 'lodash/map';
import {timeFormat} from 'd3-time-format';
import {scaleLinear} from 'd3-scale';
import h from 'virtual-dom/h';

const m = timeFormat('%m');

function step(data, i, isCurrent, scale) {
  return h('li', {
    className: isCurrent ? 'current' : ''
  }, [
    h('span.count', {
      style: { height: '' + scale(data.count) + '%' }
    }, ''),
    h('span.name', m(data.start))
  ]);
}

// Return a d3 scale for the given values
function getScale(counts) {
  return scaleLinear().domain([0, max(counts)]).range([0,100]);
}

function steps(state) {
  var scale = getScale(map(state.data, 'count'));

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
