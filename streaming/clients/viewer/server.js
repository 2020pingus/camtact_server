const broadcaster = require("../broadcaster/broadcastser");
const { broadcasters, viewers } = require("../../peers");
class ViewerServer {
  constructor({ p, tid, id }) {
    this.id = id;
    this.p = p;
    this.tid = tid;
    this.stream = null;
  }

  onConnect() {
    console.log(`viewer "${this.tid}"-${this.id} connected!`);
    if (broadcasters.has(this.tid)) {
      this.stream = broadcasters.get(this.tid).stream;
      this.p.addStream(this.stream);
    }
  }

  onBroadcasterClosed() {
    this.p.send(JSON.stringify({ type: "broadcaster closed" }));
  }

  onBroadcasterStream(stream) {
    if (this.stream) {
      this.p.removeStream(this.stream);
      this.stream = stream;
    }
    this.p.addStream(this.stream);
  }

  onData(data) {
    console.log(data);
    if (broadcaster.map.has(this.tid)) {
    }
  }

  onStream(stream) {
    console.log("s!");
  }

  onClose() {
    console.log(`viewer ${this.tid}-${this.id} closed!`);
  }

  init(p) {
    p.on("close", () => this.onClose());
    p.on("connect", () => this.onConnect());
    p.on("data", (data) => this.onData(JSON.parse(data.toString())));
    p.on("stream", (stream) => this.onStream(stream));
  }
}

module.exports = { Server: ViewerServer };
