const router = require("express").Router();
const Users = require("../models/users-model.js");

// CRUD operations
// * All database entries should be UPPERCASE *

// Output: array of objects, all teams on waitlist with parameter pc (passcode)
// This is NOT in correct play order
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
            res.status(500).json({ message: "Something went wrong" });
        });
});

// Output: array of objects, all teams on waitlist for this passcode at one court_name
// This is in correct play order
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
            res.staus(500).json({ message: "Something went wrong" });
        });
});

// Output: user info at this passcode with this username (username is only unique when paired with passcode)
router.get("/user/:pc/:username", (req, res) => {
    const pc = req.params.pc;
    const username = req.params.username;
    Users.findUser(pc, username)
        .then((user) => {
            if (user.length > 0) {
                res.status(200).json({ data: user });
            } else {
                res.status(404).json({ message: "Cannot find user info" });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "Something went wrong" });
        });
});

// Add user to a waitlist
// Input: passcode is in Url, username/teamToJoin/courts_id are in body
// Returns success message
router.post("/user/add/:pc", (req, res) => {
    const pc = req.params.pc;
    const theUser = req.body;
    Users.addUser(pc, theUser.username, theUser.teamToJoin, theUser.courts_id)
        .then((user) => {
            res.status(200).json({ message: user });
        })
        .catch((err) => {
            res.status(500).json({ message: "Something went wrong" });
        });
});

// Team loses -> update teams and users tables
// Input: passcode is in Url, team_name in body
// Output: success message
router.put("/team/loses/:pc", (req, res) => {
    const pc = req.params.pc;
    const theTeam = req.body;
    Users.updateTeamLoses(theTeam.team_name, pc)
        .then((team) => {
            res.status(200).json({ message: team });
        })
        .catch((err) => {
            res.status(500).json({ message: "Something went wrong" });
        });
});

// Team wins -> update teams and users tables
// Input: passcode is in Url, team_name in body
// Output: success message
router.put("/team/wins/:pc", (req, res) => {
    const pc = req.params.pc;
    const theTeam = req.body;
    Users.updateTeamWins(theTeam.team_name, pc)
        .then((team) => {
            res.status(200).json({ message: team });
        })
        .catch((err) => {
            res.status(500).json({ message: "Something went wrong" });
        });
});

module.exports = router;
