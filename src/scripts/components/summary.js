import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';
import trim from 'lodash/trim';
import slice from 'lodash/slice';
import {timeFormat} from 'd3-time-format';
import h from 'virtual-dom/h';
import extractFireTypes from '../extractFireTypes';
import colourer from '../colourer';

// Sort the fireTypes by number of incidents descending
function sortByCount(fireTypes) {
  return sortBy(
    toPairs(fireTypes), (type) => type[1]
  ).reverse();
}

// Avoid super long names
function prepForDisplay(type) {
  return trim(type.replace(/\(.*\)/, ''));
}

const f = timeFormat('%B %Y');

// Render the title with date range
function renderTitle(start, end) {
  if (!start || !end) {
    return;
  }

  // Assumption: start and end are in the same month.
  return h('h2', f(start));
}

function colour(type) {
  return h('span.colour', {
    style: { background: colourer(type) }
  }, '');
}

// Render a fire type row
function renderType(type) {
  return h('tr', [
    h('td', colour(type[0])),
    h('td', prepForDisplay(type[0])),
    h('td', '' + type[1])
  ]);
}

// Render the table
function renderTable(features) {
  var types;

  if (!features || !features.length) {
    return;
  }

  // Process the geojson features and take the first 5
  types = slice(sortByCount(extractFireTypes(features)), 0, 5);

  return h('table', [
    h('thead',
      h('tr',
        h('th', {
          attributes: { colspan: '3' }
        }, 'Top 5 incident types')
      )
    ),
    h('tbody', map(types, (type) => renderType(type))),
    h('tfoot',
      h('tr', [
        h('td', ''),
        h('td', 'Total'),
        h('td', '' + features.length)
      ])
     )
  ]);
}

export default (state) => {
  var data = state.data[state.current];
  if (!data) {
    return;
  }
  return h('div.summary', [
    renderTitle(data.start, data.end),
    renderTable(data.features)
  ]);
};
