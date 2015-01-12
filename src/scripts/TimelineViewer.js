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
      this.displayInfo();
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

  displayInfo() {
    // Render the info to get a virtual dom tree
    var tree = this._renderInfo(),
        patches;
    // Is this the 1st render?
    if (!this.infoRoot) {
      // Yes: make a new root node
      this.infoRoot = createElement(tree);
      // And add it to the document
      document.body.appendChild(this.infoRoot);
    } else {
      // No: we're updating the dom
      patches = diff(this.infoTree, tree);
      // Update the root node
      this.infoRoot = patch(this.infoRoot, patches);
    }
    // Track the current tree for future diffing
    this.infoTree = tree;
  }

  _renderInfo() {
    return h('h1', [this.current.start.format('MMMM YYYY')]);
  }
}
