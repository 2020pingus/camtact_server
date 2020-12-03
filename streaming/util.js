const SimplePeer = require("simple-peer");
const axios = require("axios").default;
const wrtc = require("wrtc");

const connectServerBySocket = async (name, tid) => {
  return new Promise((resolve, reject) => {
    const io = require("socket.io-client");
    const socket = io();
    const p = new SimplePeer({
      initiator: true,
      config: {
        iceServers: [
          {
            urls: "turn:49.247.133.224:3478?transport=tcp",
            username: "test",
            credential: "test",
          },
        ],
      },
    });
    socket.on("connect", () => {
      console.log("s connected");
      socket.emit("client", { name, tid });
    });

    p.on("connect", () => {
      console.log("connected!");
      resolve(p);
      // window.onbeforeunload = () => p.destroy();
    });

    p.on("close", () => {
      console.log("closed!");
    });

    p.on("signal", (data) => {
      // console.log(data);
      socket.emit("signal", data);
    });

    socket.on("signal", (data) => p.signal(data));

    socket.on("disconnect", () => p.destroy());
  });
};

const connectClientBySocket = async (socket) => {
  return new Promise((resolve, reject) => {
    let _server;
    const p = new SimplePeer({
      initiator: false,
      wrtc,
      config: {
        iceServers: [
          {
            urls: "turn:49.247.133.224:3478?transport=tcp",
            username: "test",
            credential: "test",
          },
        ],
      },
    });
    socket.on("client", ({ name, tid }) => {
      if (_server) return;
      const { Server } = require(`./clients/${name}/server.js`);
      _server = new Server(tid);
      _server.init(p);
    });
    socket.on("signal", (data) => p.signal(data));
    p.on("signal", (data) => socket.emit("signal", data));
    p.on("connect", () => {
      console.log("connected!");
      if (_server) _server.onConnect(p);
    });
    p.on("close", () => {
      console.log("closed!");
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
      p.destroy();
    });
  });
};

const connectServer = async () => {
  console.log("CCC");
  let sent = false;
  return new Promise((resolve, reject) => {
    const p = new SimplePeer({
      initiator: true,

      // stream,
      // config: {
      //   iceServers: [
      //     {
      //       urls: "turn:49.247.133.224:3478?transport=tcp",
      //       username: "test",
      //       credential: "test",
      //     },
      //   ],
      // },
    });

    p.on("error", (err) => console.log("error", err));

    p.on("signal", (data) => {
      console.log(data);
      if (data.type === "offer" && !sent) {
        sent = true;
        axios.post("offer", { data }).then(({ data }) => {
          p.signal(data);
        });
      }
    });

    p.on("connect", () => {
      console.log("connected!");
      resolve(p);
      // window.onbeforeunload = () => p.destroy();
      //   p.send("whatever" + Math.random());
    });

    p.on("data", (data) => {
      console.log("data: " + data);
    });
  });
};

const connectClient = async (offer, res, init) => {
  return new Promise((resolve, reject) => {
    const p = new SimplePeer({
      initiator: false,
      wrtc,
      // config: {
      //   iceServers: [
      //     {
      //       urls: "turn:49.247.133.224:3478?transport=tcp",
      //       username: "test",
      //       credential: "test",
      //     },
      //   ],
      // },
    });
    p.on("error", (err) => console.log("error", err));
    p.on("signal", (data) => {
      console.log("s", data);
      if (data.type === "answer") res.json(data);
    });

    p.on("connect", () => {
      console.log(`connected!`);
      resolve(p);
    });

    init(p);

    p.on("close", () => {
      p.destroy();
      console.log("closed!");
    });
    p.signal(offer);
  });
};

module.exports = {
  connectServer,
  connectServerBySocket,
  connectClient,
  connectClientBySocket,
};
