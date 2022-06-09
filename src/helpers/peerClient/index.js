import { Peer } from "peerjs";

let _config
_config = {
  iceServers: [
    {
      urls: [ "stun:ss-turn1.xirsys.com" ]
    }, 
    {
      username: "Rf_-BjfmYsAJ497FoGqboMdzolglNSjUfFLMaw3LZqs9yLxl9lT32yfo-Q533svnAAAAAGKRAeVmcmFua2toaWVt",
      credential: "7352bcba-dddd-11ec-961a-0242ac140004",
      urls: [
        "turn:ss-turn1.xirsys.com:80?transport=udp",
        "turn:ss-turn1.xirsys.com:3478?transport=udp",
        "turn:ss-turn1.xirsys.com:80?transport=tcp",
        "turn:ss-turn1.xirsys.com:3478?transport=tcp",
        "turns:ss-turn1.xirsys.com:443?transport=tcp",
        "turns:ss-turn1.xirsys.com:5349?transport=tcp"
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
