import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';

export default class CountComponent {

  constructor() {
  }

  render(count) {
    var tree, patches;
    // Render count tree
    tree = this._getTree(count);
    // 1st render?
    if (!this.countRoot) {
      // Yes: create the root
      this.countRoot = createElement(tree);
      // Add to the dom
      document.body.appendChild(this.countRoot);
    } else {
      // No: find the diff patches
      patches = diff(this.countTree, tree);
      // Update the dom
      this.countRoot = patch(this.countRoot, patches);
    }
    // Track tree for next render
    this.countTree = tree;
  }

  _getTree(count) {
    return h('.count', [
      h('span.num', ['' + count]),
      h('span', ['incidents'])
    ]);
  }
}
