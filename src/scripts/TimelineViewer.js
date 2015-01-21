import CountComponent from './components/CountComponent';
import FireTypeComponent from './components/FireTypeComponent';
import TimelineComponent from './components/TimelineComponent';
import Rx from 'rx';
import _ from 'lodash';

export default class TimelineViewer {

  constructor(map, snapshots) {
    this.map       = map;
    this.snapshots = snapshots; // This is an RxJS observable
  }

  play(speed) {
    this.speed = speed;
    // Only play if we have all the data
    this._playIfDataLoaded();
  }

  _playIfDataLoaded() {
    // Is the data loaded?
    this.snapshots
      .every((s) => s.data)
      .subscribeOnNext((isLoaded) => {
        if (isLoaded) {
          this._beginPlaying();
        } else {
          _.delay(() => this._playIfDataLoaded(), 500);
        }
      });
  }

  _beginPlaying() {
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
    }, this.speed);
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
    this._renderTimeline();
    this._renderCount();
    this._renderFireTypes();
  }

  // Fire type component
  _renderFireTypes() {
    if (!this.fireTypeComponent) {
      this.fireTypeComponent = new FireTypeComponent();
    }
    this.fireTypeComponent.render(this.current.fireTypes);
  }

  // Count component
  _renderCount() {
    if (!this.countComponent) {
      this.countComponent = new CountComponent();
    }
    this.countComponent.render(this.current.count);
  }

  // Timeline component
  _renderTimeline() {
    if (!this.timelineComponent) {
      // TimelineComponent wants an array of snapshots instead of the stream
      this.snapshots.toArray().subscribeOnNext((snapshotsArray) => {
        this.timelineComponent = new TimelineComponent(snapshotsArray);
      });
    }
    this.timelineComponent.render(this.current);
  }
}
