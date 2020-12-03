const { EventEmitter } = require("events");

class BroadCaster extends EventEmitter {
  constructor() {
    super();
    this.map = new Map();
  }
  get(key) {
    return this.map.get(key);
  }
  set(key, value) {
    return this.map.set(key, value);
  }
  has(key) {
    return this.map.has(key);
  }
}
const broadcaster = new BroadCaster();
module.exports = broadcaster;
