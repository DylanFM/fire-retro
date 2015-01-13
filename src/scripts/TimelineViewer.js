import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';

export default class TimelineViewer {

  constructor(map, snapshots) {
    this.map       = map;
    this.snapshots = snapshots;
    this.next(); // Begin... select 1st snapshot
  }

  next() {
    var next = this._getNextSnapshot();
    if (next) {
      // If we already have one current
      if (this.current) {
        // Remove it from the map
        this.map.removeSnapshot(this.current);
      }
      this.current = next;
      // Add this one to the map
      this.map.addSnapshot(this.current);
      // Update the view too
      // this.showMonth();
    }
  }

  _getNextSnapshot() {
    var key = 0;
    // If this is already going
    if (this.current) {
      // Find the next index
      key = this.snapshots.indexOf(this.current) + 1;
    }
    return this.snapshots[key];
  }

  showMonth() {
    // Render the info to get a virtual dom tree
    var tree = this._renderMonth(),
        patches;
    // Is this the 1st render?
    if (!this.monthRoot) {
      // Yes: make a new root node
      this.monthRoot = createElement(tree);
      // And add it to the document
      document.body.appendChild(this.monthRoot);
    } else {
      // No: we're updating the dom
      patches = diff(this.monthTree, tree);
      // Update the root node
      this.monthRoot = patch(this.monthRoot, patches);
    }
    // Track the current tree for future diffing
    this.monthTree = tree;
  }

  _renderMonth() {
    return h('h1', [this.current.start.format('MMMM YYYY')]);
  }
}
