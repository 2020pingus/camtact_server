const { EventEmitter } = require("events");

class BroadCaster extends EventEmitter {
  constructor() {
    super();
    this.broadcasters = new Map();
  }
}
const broadcaster = new BroadCaster();
module.exports = broadcaster;
