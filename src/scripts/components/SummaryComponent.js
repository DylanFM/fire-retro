import _ from 'lodash';
import Component from './Component';
import h from 'virtual-dom/h';

export default class SummaryComponent extends Component {

  _getTree(current) {
    var types = _.map(_.slice(this._sortByCount(current.fireTypes), 0, 5), (type) => {
      return h('tr', [
        h('td', this._prepForDisplay(type[0])),
        h('td', '' + type[1])
      ]);
    });

    var table = h('table', [
      h('thead',
        h('tr',
          h('th', {
            attributes: { colspan: '2' }
          }, 'Top incident types')
        )
      ),
      h('tbody', types),
      h('tfoot',
        h('tr', [
          h('td', 'Total'),
          h('td', '' + current.count)
        ])
       )
    ]);

    return h('div.summary', [h('h2', current.start.format('MMMM YYYY')), table]);
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