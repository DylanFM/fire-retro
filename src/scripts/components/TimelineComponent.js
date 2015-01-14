import h from 'virtual-dom/h';

export default class TimelineComponent {

  constructor(months) {
    this.months = months;
  }

  render(current) {
    var items = this.months.map((month) => {
      return h('li',
        {
          className: (month.url === current.url) ? 'current' : ''
        },
        [month.start.format('MMM')]
      );
    });
    return h('ol.timeline', items);
  }
}
