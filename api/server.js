const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const adminRouter = require("./routes/admin-routes.js");

const server = express();
server.use(helmet());
server.use(morgan("dev"));
server.use(cors());
server.use(express.json());

server.use("/api/admin", adminRouter);

module.exports = server;
