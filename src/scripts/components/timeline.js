import h from 'virtual-dom/h';
import {format} from 'd3-time-format';

var f = format('%b');

function step(data, i, isCurrent) {
  return h('li', {
    className: isCurrent ? 'current' : ''
  }, [
    h('span.name', f(data.start))
  ]);
}

function steps(state) {
  return state.data.map((data, i) => {
    return step(
      data,
      i,
      state.current == i
    );
  });
}

export default (state) => {
  return h('ol.timeline#timeline', steps(state));
};
