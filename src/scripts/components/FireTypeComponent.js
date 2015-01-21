import Component from './Component';
import h from 'virtual-dom/h';
import svg from 'virtual-dom/virtual-hyperscript/svg';
import _ from 'lodash';

export default class FireTypeComponent extends Component {

  constructor() {
    this.width  = 1000;
    this.height = 300;
  }

  _getTree(fireTypes) {
    var keys  = _.keys(fireTypes),
        types = _.map(fireTypes, (count, type) => {
          return svg('rect', {
            width: 10,
            height: count,
            x: _.indexOf(keys, type) * 12,
            y: 0,
            fill: '#cccccc'
          });
        });

    return h('.fireTypes',
      svg('svg', {
        className:  'fireTypes',
        width:      this.width,
        height:     this.height,
      }, types)
    );
  }
}
