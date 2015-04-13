import Component from './Component';
import h from 'virtual-dom/h';

export default class TimelineComponent extends Component {

  constructor(months) {
    super();
    this.months = months;
  }

  _getTree(current) {
    var items = this.months.map((month) => {
      return h('li',
        {
          className: (current && month.url === current.url) ? 'current' : ''
        },
        [month.start.format('MMM')]
      );
    });
    return h('ol.timeline', items);
  }
}
