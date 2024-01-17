import { io } from "socket.io-client";

const backenUrl = "https://api.ntamtech.com";

const Socket = io(backenUrl);

export default Socket;
