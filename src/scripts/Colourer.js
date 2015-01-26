import d3 from 'd3';

export default class Colourer {

  constructor() {
    this.cache = {};
  }

  getColour(type) {
    var type = type.toUpperCase(),
        colour;
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
}
