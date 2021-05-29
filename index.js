require("dotenv").config();
const server = require("./api/server");

const PORT = process.env.PORT || 4220;
// server.listen(PORT, () => {
//     console.log(`\n listening on port ${PORT}`);
// });

// specific to socket.io
const httpServer = require("http").createServer(server);
const io = require("socket.io")(httpServer, { cors: { origin: "*" } });
httpServer.listen(PORT);

io.on("connection", (socket) => {
    console.log("Socket connected to BE with id:", socket.id);
    socket.emit("connection", "Yes we are up and running");
    socket.on("message", (data) => {
        // this will send message to everyone except myself
        socket.broadcast.emit("message", data);
        console.log("this is data received by BE:", data);
    });
});
