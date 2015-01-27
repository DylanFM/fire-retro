import AggregateSnapshot from './AggregateSnapshot';
import CountComponent from './components/CountComponent';
import FireTypeComponent from './components/FireTypeComponent';
import TimelineComponent from './components/TimelineComponent';
import L from 'leaflet';
import _ from 'lodash';

export default class TimelineViewer {

  constructor(map, snapshots, colourer) {
    this.map       = map;
    this.snapshots = snapshots; // This is an RxJS observable
    this.colourer  = colourer;
    // Initialise components
    this.fireTypeComponent = new FireTypeComponent(this.colourer);
    this.countComponent    = new CountComponent();
    // We want an array
    this.snapshots.toArray().subscribeOnNext((snapshotsArray) => {
      this.timelineComponent = new TimelineComponent(snapshotsArray);
    });
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
          // Get an aggregate of the snapshots
          this.snapshots.toArray().subscribeOnNext((snapshotsArray) => {
            this.combined = new AggregateSnapshot(snapshotsArray);
          });
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
              _.delay(() => this._render(this.combined), this.speed);
            }
          }, this.speed);
        };
    // Render for each item
    stream.subscribeOnNext((next) => this._render(next));
    // Begin...
    step();
  }

  _render(snapshot) {
    this._renderMap(snapshot);
    this.timelineComponent.render(snapshot);
    this.countComponent.render(snapshot.count);
    this.fireTypeComponent.render(snapshot.fireTypes);
  }

  _renderMap(snapshot) {
    this.map.clear();
    this.map.addSnapshot(snapshot);
  }
}
