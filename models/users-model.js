const db = require("../data/config");

module.exports = {
    findAllTeamsPerCode,
    findAllTeamsPerCourt,
    findUser,
    addUser,
    updateTeamLoses,
    updateTeamWins,
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

// Find username in users table
// SELECT *
// FROM users
// JOIN passcode on passcode.id = users.passcode_id
// WHERE passcode.code = "XXXX" and users.username = "USER1";
function findUser(theCode, theUsername) {
    return db("users")
        .join("passcode", "passcode.id", "users.passcode_id")
        .select(
            "active",
            "wins_today",
            "games_today",
            "total_wins",
            "total_games"
        )
        .where({ "passcode.code": theCode, "users.username": theUsername });
}

// (Helper Function) Find passcode.id from code
// SELECT id
// FROM passcode
// WHERE passcode.code = "XXXX";
function findPasscodeId(theCode) {
    return db("passcode").select("id").where({ "passcode.code": theCode });
}

// (Helper Function) Add new user to users table, must know passcode_id
// INSERT INTO users (username, active, passcode_id)
// VALUES ("NEWUSER", 1, 1)
function insertUserToUsers(theUsername, thePasscode_id) {
    return db("users").insert({
        username: theUsername,
        active: 1,
        passcode_id: thePasscode_id,
    });
}

// (Helper Function) Add new team_name to teams table
// INSERT INTO teams (team_name, courts_id)
// VALUES (“USER1”, 1)
function insertNewTeamToTeams(theTeam_name, theCourts_id, thePasscode_id) {
    return db("teams").insert({
        team_name: theTeam_name,
        courts_id: theCourts_id,
        passcode_id: thePasscode_id,
    });
}

// (Helper Function) Add a user to existing team_name, for the waitlist
// UPDATE teams
// SET team_name = team_name || "," || "NEWUSER1"
// WHERE team_name = "USER1,USER2";
function updateTeamName(theUsername, theTeamToJoin) {
    const newName = theTeamToJoin + "," + theUsername;
    return db("teams")
        .where({ team_name: theTeamToJoin })
        .update({ team_name: newName });
}

// (Helper Function)
function updateUserActive(theUsername) {
    return db("users").where({ username: theUsername }).update({ active: 1 });
}

// Add user to waitlist -> find the passcode.id then insert into users & teams table.  If user exists already -> findPasscodeId -> addUser
// INSERT INTO users (username, active, passcode_id)
// VALUES ("NEWUSER", 1, 1)
async function addUser(theCode, theUsername, theTeamToJoin, theCourts_id) {
    const found = await findUser(theCode, theUsername);
    const pcId = await findPasscodeId(theCode);
    console.log("***made it HERE");
    if (found.length === 0) {
        await insertUserToUsers(theUsername, pcId[0].id);
        if (theTeamToJoin === "") {
            await insertNewTeamToTeams(theUsername, theCourts_id, pcId[0].id);
            return "A new user was added to users and active = 1, a new team was added to teams";
        } else {
            await updateTeamName(theUsername, theTeamToJoin);
            return "Team name was updated";
        }
    } else {
        if (found[0].active === 1) {
            return "That username is already signed up for a court";
        } else {
            await updateUserActive(theUsername);
            if (theTeamToJoin === "") {
                await insertNewTeamToTeams(
                    theUsername,
                    theCourts_id,
                    pcId[0].id
                );
                return "A new user was added to users and active = 1, a new team was added to teams from existing user";
            } else {
                await updateTeamName(theUsername, theTeamToJoin);
                return "Team name was updated from existing user";
            }
        }
    }
}

// After a team loses
// (Pass in team_name and passcode.code, findPasscodeId, map through each teammate to update users table, delete team_name from teams table)
async function updateTeamLoses(theTeam_name, theCode) {
    const pcId = await findPasscodeId(theCode);
    const splitNames = theTeam_name.split(",");
    Promise.all(
        splitNames.map((i) => {
            return db("users")
                .where({ username: i, passcode_id: pcId[0].id })
                .update({ active: 0 })
                .increment("games_today", 1)
                .increment("total_games", 1);
        })
    );
    await db("teams")
        .where({ team_name: theTeam_name, passcode_id: pcId[0].id })
        .delete();
    return "Users and teams are updated";
}

// After a team wins
// (Pass in team_name and passcode.code, findPasscodeId, map through each teammate to update users table)
async function updateTeamWins(theTeam_name, theCode) {
    const pcId = await findPasscodeId(theCode);
    const splitNames = theTeam_name.split(",");
    Promise.all(
        splitNames.map((i) => {
            return db("users")
                .where({ username: i, passcode_id: pcId[0].id })
                .increment("wins_today", 1)
                .increment("games_today", 1)
                .increment("total_wins", 1)
                .increment("total_games", 1);
        })
    );
    await db("teams")
        .where({ team_name: theTeam_name, passcode_id: 1 })
        .increment("team_wins", 1);

    return "Users and teams tables are updated";
}
