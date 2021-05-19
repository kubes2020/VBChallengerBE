const router = require("express").Router();
const Users = require("../models/users-model.js");

// CRUD operations

// Get all teams on waitlist with parameter pc = passcode
router.get("/waitlist/:pc", (req, res) => {
    const { pc } = req.params;
    Users.findAllTeamsPerCode(pc)
        .then((team) => {
            if (team.length > 0) {
                res.status(200).json({ data: team });
            } else {
                res.status(404).json({
                    message: "Cannot find any teams on waitlist",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "something went wrong" });
        });
});

router.get("/waitlist/:pc/:ct", (req, res) => {
    const pc = req.params.pc;
    const ct = req.params.ct;
    console.log("this is pc and ct", pc, ct);
    Users.findAllTeamsPerCourt(pc, ct)
        .then((team) => {
            if (team.length > 0) {
                res.status(200).json({ data: team });
            } else {
                res.status(404).json({
                    message: "Cannot find any teams on waitlist",
                });
            }
        })
        .catch((err) => {
            res.staus(500).json({ message: "something went wrong" });
        });
});

module.exports = router;
