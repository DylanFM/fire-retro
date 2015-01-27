import d3 from 'd3';

export default class Colourer {

  constructor() {
    this.cache = {};
  }

  getColour(type) {
    var colour;
    type = type.toUpperCase();
    if (this.cache[type]) {
      colour = this.cache[type];
    } else {
      colour = this._getD3Colour();
      this.cache[type] = colour;
    }
    return colour;
  }

  getSequentialScale(min, max) {
    return d3.scale.linear()
      .domain([min, max])
      .range(['rgb(240,249,232)','rgb(204,235,197)','rgb(168,221,181)','rgb(123,204,196)','rgb(78,179,211)','rgb(43,140,190)','rgb(8,88,158)']); // Colorbrewer
  }

  _getD3Colour() {
    return new d3.rgb(
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255)
    );
  }
}
