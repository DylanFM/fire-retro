import _ from 'lodash';
import h from 'virtual-dom/h';
import extractFireTypes from '../extractFireTypes';
import colourer from '../colourer';

// Sort the fireTypes by number of incidents descending
function sortByCount(fireTypes) {
  return _.sortBy(
    _.pairs(fireTypes), (type) => type[1]
  ).reverse();
}

// Avoid super long names
function prepForDisplay(type) {
  return _.trim(type.replace(/\(.*\)/, ''));
}

// Render the title with date range
function renderTitle(start, end) {
  if (!start || !end) {
    return;
  }

  return h('h2', start.format('MMM YY') + ' to ' + end.format('MMM YY'));
}

// Render a fire type row
function renderType(type) {
  return h('tr', [
    h('td',
      h('span.colour', {
        style: { background: colourer(type[0]) }
      }, '')
    ),
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
  types = _.slice(sortByCount(extractFireTypes(features)), 0, 5);

  return h('table', [
    h('thead',
      h('tr',
        h('th', {
          attributes: { colspan: '3' }
        }, 'Top 5 incident types')
      )
    ),
    h('tbody', _.map(types, (type) => renderType(type))),
    h('tfoot',
      h('tr', [
        h('td', ''),
        h('td', 'Total'),
        h('td', '' + features.length)
      ])
     )
  ]);
}

export default function(state) {
  return h(
    'div.summary',
    [
      renderTitle(state.start, state.end),
      renderTable(state.features)
    ]
  );
}
