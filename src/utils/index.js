import io from "socket.io-client";

var connectionOptions = {
    "transports": ["polling"]
};

// const socket = io.connect('http://localhost:4000', connectionOptions)
const socket = io.connect('https://192.168.1.6:3001', connectionOptions)

export default socket