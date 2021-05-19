const db = require("../data/config");

module.exports = {
    findAllTeamsPerCode,
    findAllTeamsPerCourt,
};

// Find all teams on waitlist for all courts (in order) with same passcode.code (accounting for admin_adjust gets priority on court)
// SELECT team_name, court_name, courts_id
// FROM teams
// JOIN passcode on passcode.id = courts.passcode_id
// JOIN courts on courts.id = teams.courts_id
// WHERE passcode.code = "XXXX"
// ORDER BY courts.id, teams.admin_adjust, teams.id;
function findAllTeamsPerCode(theCode) {
    return db("teams")
        .join("passcode", "passcode.id", "courts.passcode_id")
        .join("courts", "courts.id", "teams.courts_id")
        .select("team_name", "court_name", "courts_id")
        .where({ "passcode.code": theCode })
        .orderBy("courts.id", "teams.admin_adjust", "teams.id");
}

// Find teams who are on waitlist for 1 court: playa1
// SELECT team_name
// FROM teams
// JOIN passcode on passcode.id = courts.passcode_id
// JOIN courts on courts.id = teams.courts_id
// WHERE courts.court_name = "PLAYA1" and passcode.code = "XXXX"
// ORDER BY teams.admin_adjust, teams.id;
function findAllTeamsPerCourt(theCode, theCourt) {
    return db("teams")
        .join("passcode", "passcode.id", "courts.passcode_id")
        .join("courts", "courts.id", "teams.courts_id")
        .select("team_name")
        .where({ "passcode.code": theCode, "courts.court_name": theCourt })
        .orderBy("teams.admin_adjust", "teams.id");
}

// Find username in users table and check if active
// SELECT username, active
// FROM users
// WHERE username = "USER1"
function findUser(theCode, theUsername) {
    return db("users")
        .select("username", "active")
        .where({ username: theUsername });
}
