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
}
