import FireTypeCountComponent from './components/FireTypeCountComponent';
import TimelineComponent from './components/TimelineComponent';
import L from 'leaflet';
import _ from 'lodash';

export default class TimelineViewer {

  constructor(map, snapshots, colourer) {
    this.map             = map;
    this.snapshots       = snapshots; // This is an RxJS observable
    this.layerVisibility = {
      points:   false,
      hexGrid:  true
    };
    this.colourer  = colourer;
    // Initialise components
    this.summary = new FireTypeCountComponent();
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
              // No more - schedule to play again
              _.delay(() => this._beginPlaying(), this.speed);
            }
          }, this.speed);
        };
    // Render for each item
    stream.subscribeOnNext((next) => this._render(next));
    // Begin...
    stream.request(1); // No delay on 1st
    step();            // ... and start the delayed rendering
  }

  _render(snapshot) {
    this._renderMap(snapshot);
    this.timelineComponent.render(snapshot);
    this.summary.render(snapshot);
  }

  _renderMap(snapshot) {
    var layers = [];

    if (this.layerVisibility.points) {
      layers.push(snapshot.pointsLayer());
    }
    if (this.layerVisibility.hexGrid) {
      layers.push(snapshot.hexGridLayer(this.map.hexGrid));
    }

    this.map.clear();
    this.map.render(layers);
  }
}
