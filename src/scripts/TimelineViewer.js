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
    // TimelineComponent wants an array of snapshots instead of the stream
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
              _.delay(() => this._showCombinedData(), this.speed);
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

  _showCombinedData() {
    this.snapshots.toArray().subscribeOnNext((snapshotsArray) => {
      // If we haven't build the combined object yet, do so
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
        // A map layer group
        this.combined.layer = L.layerGroup(_.map(snapshotsArray, 'layer'));
      }
      // Now render things
      this._render(this.combined);
    });
  }
}
