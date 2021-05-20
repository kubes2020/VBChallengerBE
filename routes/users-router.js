const router = require("express").Router();
const Users = require("../models/users-model.js");

// CRUD operations
// * All database entries should be UPPERCASE *

// Returns array of objects, all teams on waitlist with parameter pc = passcode
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

// Returns array of objects, all teams on waitlist for this passcode at one court_name
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

// Returns user info at this passcode with this username
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
//  url param = passcode
//  req.body needs: username, teamToJoin, courts_id
// Returns success message
router.post("/user/add/:pc", (req, res) => {
    const pc = req.params.pc;
    const theUser = req.body;
    console.log(
        "this is req.body.username",
        theUser.username,
        theUser.teamToJoin,
        theUser.courts_id,
        pc
    );
    Users.addUser(pc, theUser.username, theUser.teamToJoin, theUser.courts_id)
        .then((user) => {
            res.status(200).json({ data: user });
        })
        .catch((err) => {
            res.status(500).json({ message: err });
        });
});

router.put("/team/loss/:pc", (req, res) => {
    const pc = req.params.pc;
    const theTeam = req.body;
    Users.updateTeamLoss(theTeam.team_name, pc)
        .then((team) => {
            res.status(200).json({ message: team });
        })
        .catch((err) => {
            res.status(500).json({ message: err.message });
        });
});

module.exports = router;
