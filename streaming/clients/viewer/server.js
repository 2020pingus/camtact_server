"use strict";

const { broadcaster, broadcasters } = require("../broadcaster/server");

function beforeOffer(peerConnection) {
  const audioTransceiver = peerConnection.addTransceiver("audio");
  const videoTransceiver = peerConnection.addTransceiver("video");

  function onNewBroadcast({ tid }) {
    console.log(tid, peerConnection);
    if (tid != peerConnection.tid) return;
    const { audioTrack, videoTrack } = broadcasters.get(tid);
    audioTransceiver.sender.replaceTrack(audioTrack);
    videoTransceiver.sender.replaceTrack(videoTrack);
  }

  broadcaster.on("newBroadcast", onNewBroadcast);

  if (broadcasters.has(peerConnection.tid))
    onNewBroadcast({ tid: peerConnection.tid });

  const { close } = peerConnection;
  peerConnection.close = function () {
    broadcaster.removeListener("newBroadcast", onNewBroadcast);
    return close.apply(this, arguments);
  };
}

module.exports = { beforeOffer };
