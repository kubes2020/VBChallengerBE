const restrictedMiddleware = require("../auth/restricted-middleware");
const db = require("../data/config");

module.exports = {
    findAllTeamsPerCode,
    findAllTeamsPerCourt,
    findUser,
    addUser,
    updateTeamLoses,
    updateTeamWins,
};

// Find all teams on waitlist for all courts with same passcode.code (not correct play order)
function findAllTeamsPerCode(theCode) {
    return db("teams")
        .join("passcode", "passcode.id", "courts.passcode_id")
        .join("courts", "courts.id", "teams.courts_id")
        .select("team_name", "court_name", "courts_id")
        .where({ "passcode.code": theCode })
        .orderBy("courts.id");
}

// Find all teams on waitlist for 1 particular court
// This is the correct play order
function findAllTeamsPerCourt(theCode, theCourt) {
    return db("teams")
        .join("passcode", "passcode.id", "courts.passcode_id")
        .join("courts", "courts.id", "teams.courts_id")
        .select("team_name")
        .where({ "passcode.code": theCode, "courts.court_name": theCourt })
        .orderBy("teams.admin_adjust", "teams.id");
}

// Get user stats from users table
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

// (Helper Function) Find passcode.id from code (code is a unique value)
function findPasscodeId(theCode) {
    return db("passcode").select("id").where({ "passcode.code": theCode });
}

// (Helper Function) Add new user to users table
function insertUserToUsers(theUsername, thePasscode_id) {
    return db("users").insert({
        username: theUsername,
        active: 1,
        passcode_id: thePasscode_id,
    });
}

// (Helper Function) Add new team_name to teams table
function insertNewTeamToTeams(theTeam_name, theCourts_id, thePasscode_id) {
    return db("teams").insert({
        team_name: theTeam_name,
        courts_id: theCourts_id,
        passcode_id: thePasscode_id,
    });
}

// (Helper Function) Add a user to existing team_name, for the waitlist
function updateTeamName(theUsername, theTeamToJoin) {
    const newName = theTeamToJoin + "," + theUsername;
    return db("teams")
        .where({ team_name: theTeamToJoin })
        .update({ team_name: newName });
}

// (Helper Function) Update username to active = true
function updateUserActive(theUsername) {
    return db("users").where({ username: theUsername }).update({ active: 1 });
}

// Add user to waitlist -> check if username is in db, find the passcode.id, then insert into users & teams tables
async function addUser(theCode, theUsername, theTeamToJoin, theCourts_id) {
    const found = await findUser(theCode, theUsername);
    const pcId = await findPasscodeId(theCode);
    // if username is not yet in users table
    if (found.length === 0) {
        // if this user is the first one to start a team, add username as start of their team_name concatenation
        if (theTeamToJoin === "") {
            await insertNewTeamToTeams(theUsername, theCourts_id, pcId[0].id);
            // add username to users table as active
            await insertUserToUsers(theUsername, pcId[0].id);
            return [];
        } else {
            // if team_name has already been started, then concatenate this username to it
            const teamNameExists = await updateTeamName(
                theUsername,
                theTeamToJoin
            );
            if (teamNameExists) {
                // add username to users table as active
                await insertUserToUsers(theUsername, pcId[0].id);
                return [];
            } else {
                return "Could not find that team name";
            }
        }
    } else {
        if (found[0].active === 1) {
            return "That username is already signed up for a court";
        } else {
            // if this user is not active and is the first one to start a team
            if (theTeamToJoin === "") {
                // add username as start of their team_name concatenation
                await insertNewTeamToTeams(
                    theUsername,
                    theCourts_id,
                    pcId[0].id
                );
                // update username active to true
                await updateUserActive(theUsername);
                return [];
            } else {
                // if team_name has already been started, then concatenate this username to it
                const teamNameExists = await updateTeamName(
                    theUsername,
                    theTeamToJoin
                );
                if (teamNameExists) {
                    // username exists but need to update active to true
                    await updateUserActive(theUsername);
                    return [];
                } else {
                    return "Could not find that team name";
                }
            }
        }
    }
}

// After a team loses
// findPasscodeId, split the team names up, map through each teammate to update users table, delete team_name from teams table
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
// findPasscodeId, split the team names up, map through each teammate to update teams and users tables
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
        .where({ team_name: theTeam_name, passcode_id: pcId[0].id })
        .increment("team_wins", 1);
    // check if a team has not won more than the alloted number for that particular court
    const [teamObj] = await db("teams")
        .select("team_wins", "courts_id")
        .where({ team_name: theTeam_name, passcode_id: pcId[0].id });
    const [maxWins] = await db("courts")
        .select("num_wins")
        .where({ id: teamObj.courts_id });
    // if a team has won too many times, delete the team_name from teams table
    if (teamObj.team_wins >= maxWins.num_wins) {
        await db("teams")
            .where({ team_name: theTeam_name, passcode_id: pcId[0].id })
            .delete();
        return "Congratulations!!! Your team is too good...take a break.";
    }
    return "Users and teams tables are updated";
}
