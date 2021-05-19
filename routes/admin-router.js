const router = require("express").Router();
const Admin = require("../models/admin-model.js");

// CRUD operations
const currentTime = new Date().toDateString();

router.get("/test", (req, res) => {
    res.status(200).json({ message: "server is running! " + currentTime });
});

router.get("/admins", (req, res) => {
    Admin.findAdmins()
        .then((admin) => {
            res.status(200).json({ message: admin });
        })
        .catch((err) => {
            res.status(500).json({ message: "something went wrong" });
        });
});

module.exports = router;
