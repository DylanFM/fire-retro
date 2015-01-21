import Component from './Component';
import h from 'virtual-dom/h';
import _ from 'lodash';

export default class FireTypeComponent extends Component {

  _getTree(fireTypes) {
    var types = _.map(fireTypes, (count, type) => {
      return h('tr', [
        h('td', [type]),
        h('td', ['' + fireTypes[type]])
      ]);
    });

    return h('table.fireTypes', [
      h('tbody', types)
    ]);
  }
}
