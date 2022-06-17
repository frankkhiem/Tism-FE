import { Peer } from "peerjs";

let _config
_config = {
  iceServers: [
    {
      urls: [ "stun:hk-turn1.xirsys.com" ]
    }, 
    {
      username: "M8W0eOl_QCusvixntDpw-G0TtAutEtXMFS4AzaPuYLpomaoh5J567WOxVZZJluPnAAAAAGKr9iJraGllbW5nZw==",
      credential: "50495bb8-edee-11ec-8a22-0242ac120004",
      urls: [
        "turn:hk-turn1.xirsys.com:80?transport=udp",
        "turn:hk-turn1.xirsys.com:3478?transport=udp",
        "turn:hk-turn1.xirsys.com:80?transport=tcp",
        "turn:hk-turn1.xirsys.com:3478?transport=tcp",
        "turns:hk-turn1.xirsys.com:443?transport=tcp",
        "turns:hk-turn1.xirsys.com:5349?transport=tcp"
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
