import _ from 'lodash';
import Component from './Component';
import h from 'virtual-dom/h';
import extractFireTypes from '../extractFireTypes';

export default class SummaryComponent extends Component {

  _getTree(start, end, data, colourer) {
    var types = _.map(_.slice(this._sortByCount(extractFireTypes(data)), 0, 5), (type) => {
      return h('tr', [
        h('td',
          h('span.colour', {
            style: { background: colourer.getColour(type[0]) }
          }, '')
        ),
        h('td', this._prepForDisplay(type[0])),
        h('td', '' + type[1])
      ]);
    });

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
          h('td', '' + data.features.length)
        ])
       )
    ]);

    return h('div.summary', [h('h2', start.format('MMM YY') + ' to ' + end.format('MMM YY')), table]);
  }

  // Sort the fireTypes by number of incidents descending
  _sortByCount(fireTypes) {
    return _.sortBy(
      _.pairs(fireTypes), (type) => type[1]
    ).reverse();
  }

  // Avoid super long names
  _prepForDisplay(type) {
    return _.trim(type.replace(/\(.*\)/, ''));
  }
}
