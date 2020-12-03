const { broadcasters, viewers } = require("../../peers");

class BroadcasterServer {
  constructor({ p, tid, id }) {
    this.id = id;
    this.p = p;
    this.tid = tid;
    this.stream = null;
  }

  onConnect() {
    console.log(`broadcaster "${this.tid}"-${this.id} connected!`);
    if (broadcasters.has(this.tid)) {
      broadcasters.get(this.tid).p.destroy();
      broadcasters.delete(this.tid);
    }
    if (!viewers.has(this.tid)) {
      viewers.set(this.tid, []);
    }
    broadcasters.set(this.tid, this);
  }

  onData(data) {
    console.log(data);
  }

  onStream(stream) {
    this.stream = stream;
    viewers
      .get(this.tid)
      .forEach((viewer) => viewer.onBroadcasterStream(this.stream));
  }

  sendData(data) {
    this.p.send(JSON.stringify(data));
  }

  onClose() {
    if (
      broadcasters.has(this.tid) &&
      broadcasters.get(this.tid).id === this.id
    ) {
      broadcasters.delete(this.tid);
      viewers.get(this.tid).forEach((viewer) => viewer.onBroadcasterClosed());
    }
    console.log(`broadcaster ${this.tid}-${this.id} closed!`);
  }

  init(p) {
    p.on("close", () => this.onClose());
    p.on("connect", () => this.onConnect());
    p.on("data", (data) => this.onData(JSON.parse(data.toString())));
    p.on("stream", (stream) => this.onStream(stream));
  }
}

module.exports = { Server: BroadcasterServer };
