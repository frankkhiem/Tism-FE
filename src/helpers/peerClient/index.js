import { Peer } from "peerjs";

let _config
_config = {
  iceServers: [
    {
      urls: [ "stun:openrelay.metered.ca:80" ]
    }, 
    {
      username: "openrelayproject",
      credential: "openrelayproject",
      urls: [
        "turn:openrelay.metered.ca:80",
        "turn:openrelay.metered.ca:443",
        "turn:openrelay.metered.ca:80?transport=tcp",
        "turn:openrelay.metered.ca:443?transport=tcp"
      ]
    } 
  ]
}

// _config = {
//   iceServers: [
//     {
//       urls: [ "stun:stun1.l.google.com:19302" ]
//     }, 
//     {      
//       username: 'webrtc@live.com',
//       credential: 'muazkh',
//       url: 'turn:numb.viagenie.ca'
//     } 
//   ]
// }

const createPeer = (id) => {
  const HOST = "localhost"
  const PORT = 3001
  const peer = new Peer(id, {
    host: process.env.VUE_APP_PEER_SERVER_HOST || HOST,
    port: process.env.VUE_APP_PEER_SERVER_PORT || PORT,
    path: process.env.VUE_APP_PEER_SERVER_PATH || '/',
    secure: true,
    config: _config
  })
  // const peer = new Peer(id)

  return peer
}

export default createPeer
