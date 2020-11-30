"use strict";

const { EventEmitter } = require("events");

const broadcaster = new EventEmitter();
const broadcasters = new Map();
const { on } = broadcaster;

function beforeOffer(peerConnection) {
  const { tid } = peerConnection;
  const audioTrack = (broadcaster.audioTrack = peerConnection.addTransceiver(
    "audio",
  ).receiver.track);
  const videoTrack = (broadcaster.videoTrack = peerConnection.addTransceiver(
    "video",
  ).receiver.track);

  broadcasters.set(tid, { audioTrack, videoTrack });

  broadcaster.emit("newBroadcast", {
    audioTrack,
    videoTrack,
    tid,
  });

  const { close } = peerConnection;
  peerConnection.close = function () {
    audioTrack.stop();
    videoTrack.stop();
    return close.apply(this, arguments);
  };
}

module.exports = {
  beforeOffer,
  broadcaster,
  broadcasters,
};
