const router = require("express").Router();
const Admin = require("../models/admin-model.js");

// CRUD operations
const currentTime = new Date().toDateString();

router.get("/test", (req, res) => {
    res.status(200).json({ message: "server is running! " + currentTime });
});

module.exports = router;
