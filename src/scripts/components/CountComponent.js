import h from 'virtual-dom/h';

export default class CountComponent {

  constructor() {
  }

  render(count) {
    return h('.count', [
      h('span.num', ['' + count]),
      h('span', ['incidents'])
    ]);
  }
}
