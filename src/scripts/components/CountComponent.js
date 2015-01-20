import Component from './Component';
import h from 'virtual-dom/h';

export default class CountComponent extends Component {

  _getTree(count) {
    return h('.count', [
      h('span.num', ['' + count]),
      h('span', ['incidents'])
    ]);
  }
}
