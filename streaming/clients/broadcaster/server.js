const broadcaster = require("./broadcastser");
class BroadcasterServer {
  constructor(tid) {
    this.tid = tid;
  }
  onConnect(p) {
    p.on("data", (data) => {
      console.log("" + data);
    });
  }
  init(p) {
    p.on("stream", (stream) => {
      broadcaster.broadcasters.set(this.tid, stream);
      broadcaster.emit("stream", this.tid);
    });
  }
}

module.exports = { Server: BroadcasterServer };
