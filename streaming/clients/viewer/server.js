const broadcaster = require("../broadcaster/broadcastser");

class ViewerServer {
  constructor(tid) {
    this.tid = tid;
  }
  onConnect(p) {
    if (broadcaster.broadcasters.has(this.tid)) {
      p.addStream(broadcaster.broadcasters.get(this.tid));
    }
    broadcaster.on("stream", (tid) => {
      if (this.tid == tid) {
        p.addStream(broadcaster.broadcasters.get(tid));
      }
    });
    p.on("data", (data) => {
      console.log("" + data);
    });
  }
  init(p) {
    p.on("stream", (stream) => {
      console.log("s!");
    });
  }
}

module.exports = { Server: ViewerServer };
