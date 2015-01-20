import Component from './Component';
import h from 'virtual-dom/h';

export default class FireTypeComponent extends Component {

  _getTree(fireTypes) {
    var types = [];

    for (var type in fireTypes) {
      if(fireTypes.hasOwnProperty(type)) {
        types.push(
          h('tr', [
            h('td', [type]),
            h('td', ['' + fireTypes[type]])
          ])
        );
      }
    }

    return h('table.fireTypes', [
      h('tbody', types)
    ]);
  }
}
