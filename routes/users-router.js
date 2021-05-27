const router = require("express").Router();
const Users = require("../models/users-model.js");

// CRUD operations
// * All database entries should be UPPERCASE *

// Input: passcode in Url
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

// Input: passcode and court_name in Url
// Output: array of objects, all teams on waitlist for this passcode at one court_name
// This is in correct play order
router.get("/waitlist/:pc/:ct", (req, res) => {
    const pc = req.params.pc;
    const ct = req.params.ct;
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

// Input: passcode and username in Url
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

// Add username to users table to show available (active = 0)
// Input: passcode in Url, username in body
// Output: message for successful or not
router.post("/username/available/:pc", (req, res) => {
    const pc = req.params.pc;
    const userObj = req.body;
    Users.addUsername(pc, userObj.username)
        .then((user) => {
            if (user.length > 0) {
                res.status(201).json({
                    message: "You are now available for a team",
                });
            } else {
                res.status(400).json({
                    message: "That username exists in this group already",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "Something went wrong" });
        });
});

// Add user to a waitlist
// Input: passcode is in Url, username/teamToJoin/courts_id are in body
// Output: success or error message
router.post("/user/add/:pc", (req, res) => {
    const pc = req.params.pc;
    const theUser = req.body;
    Users.addUser(pc, theUser.username, theUser.teamToJoin, theUser.courts_id)
        .then((user) => {
            if (user.length > 0) {
                res.status(409).json({ message: user });
            } else {
                res.status(201).json({
                    message: "The team has been updated successfully!",
                });
            }
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
