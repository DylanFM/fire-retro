import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';

export default class TimelineComponent {

  constructor(months) {
    this.months = months;
  }

  render(current) {
    var tree, patches;
    // If we don't have a timeline component, create it
    // Render the info to get a virtual dom tree
    tree = this._getTree(current);
    // Is this the 1st render?
    if (!this.timelineRoot) {
      // Yes: make a new root node
      this.timelineRoot = createElement(tree);
      // And add it to the document
      document.body.appendChild(this.timelineRoot);
    } else {
      // No: we're updating the dom
      patches = diff(this.timelineTree, tree);
      // Update the root node
      this.timelineRoot = patch(this.timelineRoot, patches);
    }
    // Track the current tree for future diffing
    this.timelineTree = tree;
  }

  _getTree(current) {
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
