import { io } from "socket.io-client"

const URL = "http://localhost:3000"
const socket = io(process.env.VUE_APP_SOCKET_SERVER || URL, { autoConnect: false })

socket.onAny((event, ...args) => {
  console.log('Socket event: ' + event, args)
})

export default socket
