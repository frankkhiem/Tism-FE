import { Peer } from "peerjs";

const createPeer = (id) => {
	const HOST = "localhost"
	const PORT = 3001
	const peer = new Peer(id, {
		host: process.env.VUE_APP_PEER_SERVER_HOST || HOST,
		port: process.env.VUE_APP_PEER_SERVER_PORT || PORT,
		path: process.env.VUE_APP_PEER_SERVER_PATH || '/'
	})
	// const peer = new Peer(id)

	return peer
}

export default createPeer
