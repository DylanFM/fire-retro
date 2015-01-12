export default class Map {

  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.url = 'http://localhost:8000/incidents?timeStart=' + this.start + '&timeEnd=' + this.end;
  }

}
