import CountComponent from './components/CountComponent';
import FireTypeComponent from './components/FireTypeComponent';
import TimelineComponent from './components/TimelineComponent';
import Rx from 'rx';
import _ from 'lodash';

export default class TimelineViewer {

  constructor(map, snapshots, colourer) {
    this.map       = map;
    this.snapshots = snapshots; // This is an RxJS observable
    this.colourer  = colourer;
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
        step = () => {
          // In speed ms...
          _.delay(() => {
            // Request an item - progresses the stream by 1 month
            stream.request(1);
            // Check to see if there are still queued months
            if (stream.subject.queue.length) {
              step(); // Schedule this to be run again
            } else {
              // No more - schedule to show combined data
              _.delay(() => {
                this.current = null;      // We no longer have a current month
                this._showCombinedData(); // Show the entire year
              }, this.speed);
            }
          }, this.speed);
        };
    // On each item, call the updateCurrent method
    stream.subscribeOnNext((next) => this._updateCurrent(next));
    // Begin...
    step();
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
    this._renderCount(this.current.count);
    this._renderFireTypes(this.current.fireTypes);
  }

  // Fire type component
  _renderFireTypes(fireTypes) {
    if (!this.fireTypeComponent) {
      this.fireTypeComponent = new FireTypeComponent(this.colourer);
    }
    this.fireTypeComponent.render(fireTypes);
  }

  // Count component
  _renderCount(count) {
    if (!this.countComponent) {
      this.countComponent = new CountComponent();
    }
    this.countComponent.render(count);
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

  _showCombinedData() {
    this.snapshots.toArray().subscribeOnNext((snapshotsArray) => {
      if (!this.combined) {
        this.combined = {};
        // Extract all fire types
        this.combined.fireTypes = _.reduce(snapshotsArray, (types, month) => {
          _.keys(month.fireTypes).forEach((k) => {
            if (!types[k]) {
              types[k] = month.fireTypes[k];  // Init with value
            } else {
              types[k] += month.fireTypes[k]; // Add value
            }
          });
          return types;
        }, {});
        // Extract total incidents
        this.combined.count = _.reduce(this.combined.fireTypes, (total, num) => {
          return total + num;
        }, 0);
      }
      // Now render things
      this._renderCount(this.combined.count);
      this._renderFireTypes(this.combined.fireTypes);
      this._renderTimeline(); // Should deselect the current month
      // Add all data to map
      this.snapshots.subscribeOnNext((snapshot) => {
        this.map.addSnapshot(snapshot);
      });
    });
  }
}
