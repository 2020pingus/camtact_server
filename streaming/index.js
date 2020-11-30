const express = require("express");
const browserify = require("browserify-middleware");

const { readdirSync, statSync } = require("fs");
const { join } = require("path");

const { mount } = require("./lib/server/rest/connectionsapi");
const WebRtcConnectionManager = require("./lib/server/connections/webrtcconnectionmanager");

const app = express();

app.use(express.json());

const viewerConnectionManagers = new Map();

function setupClient(name) {
  app.use(
    `/${name}/:tid/index.js`,
    browserify(join(__dirname, "clients", name, "client.js")),
  );
  app.get(`/${name}/:tid/index.html`, (req, res) => {
    res.sendFile(join(__dirname, "html", "index.html"));
  });

  const options = require(`./clients/${name}/server.js`);
  const connectionManager = WebRtcConnectionManager.create(options);
  mount(app, connectionManager, `/${name}/:tid`);
}

app.get("/", (req, res) => res.sendFile(join(__dirname, "html", "index.html")));

setupClient("viewer");
setupClient("broadcaster");

const server = app.listen(3000, () => {
  console.log("server started on http://localhost:3000");
  server.once("close", () => {});
});
