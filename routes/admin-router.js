const router = require("express").Router();
const Admin = require("../models/admin-model.js");
const bcrypt = require("bcryptjs");

// CRUD operations
// * All database entries should be UPPERCASE *
const currentTime = new Date().toDateString();

router.get("/test", (req, res) => {
    res.status(200).json({ message: "server is running! " + currentTime });
});

// Output: array of objects, all admin names with their corresponding passcode.code(s)
router.get("/admins", (req, res) => {
    Admin.findAdmins()
        .then((admin) => {
            if (admin.length > 0) {
                res.status(200).json({ message: admin });
            } else {
                res.status(404).json({ message: "Cannot find any admins" });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "something went wrong" });
        });
});

// Update teams table (admin_adjust) to give priority to team_name passed in that matches passcode
// Input: passcode in Url, team_name in body
// Output: array of object that was updated
router.put("/adjust/:pc", (req, res) => {
    const pc = req.params.pc;
    const theTeam = req.body;
    Admin.adminAdjust(theTeam.team_name, pc)
        .then((team) => {
            if (team.length > 0) {
                res.status(200).json({ message: team });
            } else {
                res.status(404).json({ message: "Cannot find that team" });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "something went wrong" });
        });
});

// Admin wants to clear teams waitlist and update users' stats to start a new day
// Input: passcode in Url
// Output: success message
router.put("/newday/:pc", (req, res) => {
    const pc = req.params.pc;
    Admin.adminNewDay(pc)
        .then((tables) => {
            res.status(200).json({
                message: "Ready for another day of volleyball!",
            });
        })
        .catch((err) => {
            res.status(500).json({ message: "something went wrong" });
        });
});

// Admin creates a new beach passcode
// Input: admin_id, and new code in body
// Output: a message if successful or not successful
router.post("/newpasscode", (req, res) => {
    const adminObj = req.body;
    Admin.adminNewPasscode(adminObj.admin_id, adminObj.code)
        .then((addCode) => {
            if (addCode.length === 0) {
                res.status(201).json({
                    message: "New beach passcode was created!",
                });
            } else {
                res.status(409).json({ message: addCode });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "something went wrong" });
        });
});

// Admin wants to delete beach passcode and all data corresponding to it
// Input: passcode in URL, admin_id in body
// Output: The deleted passcode
router.delete("/deletepasscode/:pc", (req, res) => {
    const pc = req.params.pc;
    const adminObj = req.body;
    Admin.adminDeletePasscode(pc, adminObj.admin_id)
        .then((oldPasscode) => {
            if (oldPasscode.length > 0) {
                res.status(200).json({ message: oldPasscode });
            } else {
                res.status(404).json({
                    message: "That beach passcode does not exist",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "something went wrong" });
        });
});

// Admin can create courts after previously creating a passcode
// Input: court_name / num_players / num_wins / passcode_id in body
// Output: message for successful or not
router.post("/createcourts", (req, res) => {
    const courtObj = req.body;
    Admin.adminCreateCourts(
        courtObj.court_name,
        courtObj.num_players,
        courtObj.num_wins,
        courtObj.passcode_id
    )
        .then((court) => {
            if (court.length > 0) {
                res.status(400).json({ message: court });
            } else {
                res.status(201).json({ message: "Court created successfully" });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: err.message });
        });
});

// Admin updates email or password
// Input: admin_id/newEmail/newPassword in body
// Output: message for success or not
router.put("/update/creds", (req, res) => {
    const credsObj = req.body;
    const rounds = parseInt(process.env.HASH_ROUNDS) || 8;
    const hash = bcrypt.hashSync(credsObj.newPassword, rounds);
    credsObj.newPassword = hash;

    Admin.updateCredentials(
        credsObj.admin_id,
        credsObj.newEmail,
        credsObj.newPassword
    )
        .then((updated) => {
            updated
                ? res.status(200).json({ message: "Updated successfully!" })
                : res
                      .status(404)
                      .json({ message: "Could not find that admin" });
        })
        .catch((err) => {
            res.status(500).json({ message: "Something went wrong" });
        });
});

module.exports = router;
