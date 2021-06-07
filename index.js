require("dotenv").config();
const server = require("./api/server");
const axios = require("axios");

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
    socket.on("sendPasscode", (data) => {
        // socket.join(data.code);

        // socket.emit("message", data); // just sender
        // socket.broadcast.emit("message", data); // everyone except sender
        io.emit("message", data); // everyone

        console.log("this is data received by BE:", data.code);
        // axios
        //     .get(`http://localhost:4000/api/users/waitlist/${data.code}`)
        //     .then((waitlist) => {
        //         console.log("Made it Here!!!!!! waitlist:", waitlist.data);
        //     })
        //     .catch((err) => {
        //         console.log("this is the error:", err.message);
        //     });
    });
});
