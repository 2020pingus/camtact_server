const express = require("express");
const browserify = require("browserify-middleware");
const { join } = require("path");
const { connectClient, connectClientBySocket } = require("./util");
const app = express();
const wrtc = require("wrtc");
const SimplePeer = require("simple-peer");

app.use(express.json());

function setupClient(name) {
  app.get(
    `/${name}/index.js`,
    browserify(join(__dirname, "clients", name, "client.js")),
  );

  app.get(`/${name}/index.html`, (req, res) => {
    res.sendFile(join(__dirname, "html", "index.html"));
  });

  // const { onConnect, init } = require(`./clients/${name}/server.js`);
  // app.post(`/${name}/:tid/offer`, async (req, res) => {
  //   const { data } = req.body;
  //   const p = await connectClient(data, res, init);
  //   onConnect(p);
  // });
}

setupClient("viewer");
setupClient("broadcaster");

app.get("/", (req, res) => res.sendFile(join(__dirname, "html", "index.html")));

// const server = app.listen(3000, () => {
//   console.log("server started on http://localhost:3000");
//   server.once("close", () => {});
// });

require("greenlock-express")
  .init({
    packageRoot: __dirname,
    configDir: "./greenlock.d",

    // contact for security and critical bug notices
    maintainerEmail: "wjdtmddnr24@naver.com",

    // whether or not to run at cloudscale
    cluster: false,
  })
  .ready((glx) => {
    const socketio = require("socket.io");
    const io = socketio(glx.httpsServer());

    io.on("connection", async (socket) => {
      console.log("user connected");
      await connectClientBySocket(socket);
    });
  })
  .serve(app);
