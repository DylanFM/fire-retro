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

  _getD3Colour() {
    return new d3.rgb(
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255)
    );
  }

  getSequentialScale(min, max) {
    return d3.scale.quantize()
      .domain([min, max])
      .range(['rgb(254,240,217)','rgb(253,212,158)','rgb(253,187,132)','rgb(252,141,89)','rgb(239,101,72)','rgb(215,48,31)','rgb(153,0,0)']); // Colorbrewer
  }
}
