import _ from 'lodash';
import h from 'virtual-dom/h';
import extractFireTypes from '../extractFireTypes';

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

// Render a fire type row
function renderType(type, colourer) {
  return h('tr', [
    h('td',
      h('span.colour', {
        style: { background: colourer.getColour(type[0]) }
      }, '')
    ),
    h('td', prepForDisplay(type[0])),
    h('td', '' + type[1])
  ]);
}

export default function(state, colourer) {
  var fireTypes = sortByCount(extractFireTypes(state)),
      types     = _.map(_.slice(fireTypes, 0, 5), (type) => renderType(type, colourer));

  var table = h('table', [
    h('thead',
      h('tr',
        h('th', {
          attributes: { colspan: '3' }
        }, 'Top 5 incident types')
      )
    ),
    h('tbody', types),
    h('tfoot',
      h('tr', [
        h('td', ''),
        h('td', 'Total'),
        h('td', '' + state.features.length)
      ])
     )
  ]);

  return h(
    'div.summary',
    [
      h('h2', state.start.format('MMM YY') + ' to ' + state.end.format('MMM YY')),
      table
    ]
  );
}
