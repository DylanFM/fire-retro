import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';

export default class Component {

  render() {
    this._render(
      this._getTree.apply(this, arguments)
    );
  }

  _render(tree) {
    var patches;
    // Is this the 1st render?
    if (!this.root) {
      // Yes: make a new root node
      this.root = createElement(tree);
      // And add it to the document
      document.body.appendChild(this.root);
    } else {
      // No: we're updating the dom
      patches = diff(this.tree, tree);
      // Update the root node
      this.root = patch(this.root, patches);
    }
    // Track the current tree for future diffing
    this.tree = tree;
  }

}
