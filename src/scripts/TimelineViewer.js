import CountComponent from './components/CountComponent';
import TimelineComponent from './components/TimelineComponent';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';
import Rx from 'rx';

export default class TimelineViewer {

  constructor(map, snapshots) {
    this.map       = map;
    this.snapshots = snapshots; // This is an RxJS observable
  }

  play(speed) {
    var stream = this.snapshots.controlled(), // Make a controllable stream
        timer;
    // On each item, call the updateCurrent method
    stream.subscribeOnNext((next) => this._updateCurrent(next));
    // Subscribe to the timer and hook into the stream
    timer = window.setInterval(() => {
      // Request an item - progresses the stream by 1 month
      stream.request(1);
      // Check to see if there are still queued months
      if (!stream.subject.queue.length) {
        // Complete - we no longer need the timer
        window.clearInterval(timer);
      }
    }, speed);
  }

  _updateCurrent(next) {
    // If we already have one current
    if (this.current) {
      // Remove it from the map
      this.map.removeSnapshot(this.current);
    }
    this.current = next;
    // Add this one to the map
    this.map.addSnapshot(this.current);
    // Update the view too
    this._showTimeline();
    this._showCount();
  }

  //
  // Count component
  //
  _showCount() {
    var tree, patches;
    // If we don't have a count component, create it
    if (!this.countComponent) {
      this.countComponent = new CountComponent();
    }
    // Render count tree
    tree = this.countComponent.render(this.current.count);
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

  //
  // Timeline component
  //
  _showTimeline() {
    var tree, patches;
    // If we don't have a timeline component, create it
    if (!this.timelineComponent) {
      // TimelineComponent wants an array of snapshots instead of the stream
      this.snapshots.toArray().subscribeOnNext((snapshotsArray) => {
        this.timelineComponent = new TimelineComponent(snapshotsArray);
      });
    }
    // Render the info to get a virtual dom tree
    tree = this.timelineComponent.render(this.current);
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
}
