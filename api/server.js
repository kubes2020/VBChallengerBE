const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const adminRouter = require("../routes/admin-router.js");
const usersRouter = require("../routes/users-router.js");
const authRouter = require("../auth/auth-router.js");
const restricted = require("../auth/restricted-middleware.js");

const server = express();
server.use(helmet());
server.use(morgan("dev"));
server.use(cors());
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/admin", restricted, adminRouter);
server.use("/api/users", usersRouter);

module.exports = server;
