const restrictedMiddleware = require("../auth/restricted-middleware");
const db = require("../data/config");

module.exports = {
    findAllTeamsPerCode,
    findAllTeamsPerCourt,
    findUser,
    addUsername,
    addUserToWaitlist,
    updateTeamLoses,
    updateTeamWins,
    updateTeamName,
};

// (Helper Function) Find passcode.id from code (code is a unique value)
function findPasscodeId(theCode) {
    return db("passcode").select("id").where({ "passcode.code": theCode });
}

// (Helper Function) Add new user to users table, make sure they don't exist first
async function insertUserToUsers(theUsername, thePasscode_id) {
    const userExists = await db("users")
        .select("username")
        .where({ username: theUsername, passcode_id: thePasscode_id });
    if (userExists.length > 0) {
        return [];
    }
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

// (Helper Function) Update username to active = true
function updateUserActive(theUsername, thePasscode_id) {
    return db("users")
        .where({ username: theUsername, passcode_id: thePasscode_id })
        .update({ active: 1 });
}

// (Helper Function) Update username to active = false
function updateUserNotActive(theUsername, thePasscode_id) {
    return db("users")
        .where({ username: theUsername, passcode_id: thePasscode_id })
        .update({ active: 0 });
}

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

// Add username to users table to show available (active = 0)
// Make sure that the username does not exist yet
async function addUsername(theCode, theUsername) {
    const [pcId] = await findPasscodeId(theCode);
    const userExists = await findUser(theCode, theUsername);
    if (userExists.length > 0) {
        return [];
    } else {
        return db("users").insert({
            username: theUsername,
            active: 0,
            passcode_id: pcId.id,
        });
    }
}

// Add user to court waitlist -> check if username is in db, find the passcode.id, then insert into users & teams tables
async function addUserToWaitlist(
    theCode,
    theUsername,
    theTeamToJoin,
    theCourts_id
) {
    const found = await findUser(theCode, theUsername);
    const [pcId] = await findPasscodeId(theCode);
    // if username is not yet in users table
    if (found.length === 0) {
        // if this user is the first one to start a team, add username as start of their team_name concatenation
        if (theTeamToJoin === "") {
            await insertNewTeamToTeams(theUsername, theCourts_id, pcId.id);
            // add username to users table as active
            await insertUserToUsers(theUsername, pcId.id);
            return [];
        } else {
            // if team_name has already been started, then concatenate this username to it
            const newName = theTeamToJoin + "," + theUsername;
            await db("teams")
                .where({ team_name: theTeamToJoin, courts_id: theCourts_id })
                .update({ team_name: newName });
            await insertUserToUsers(theUsername, pcId.id);
            return [];
        }
    } else {
        if (found[0].active === 1) {
            return "That username is already signed up for a court";
        } else {
            // if this user is not active and is the first one to start a team
            if (theTeamToJoin === "") {
                // add username as start of their team_name concatenation
                await insertNewTeamToTeams(theUsername, theCourts_id, pcId.id);
                // update username active to true
                await updateUserActive(theUsername, pcId.id);
                return [];
            } else {
                // if team_name has already been started, then concatenate this username to it
                const newName = theTeamToJoin + "," + theUsername;
                await db("teams")
                    .where({
                        team_name: theTeamToJoin,
                        courts_id: theCourts_id,
                    })
                    .update({ team_name: newName });
                await updateUserActive(theUsername, pcId.id);
                return [];
            }
        }
    }
}

// After a team loses
// findPasscodeId, split the team names up, map through each teammate to update users table, delete team_name from teams table
async function updateTeamLoses(theTeam_name, theCode) {
    const [pcId] = await findPasscodeId(theCode);
    const splitNames = theTeam_name.split(",");
    Promise.all(
        splitNames.map((i) => {
            return db("users")
                .where({ username: i, passcode_id: pcId.id })
                .update({ active: 0 })
                .increment("games_today", 1)
                .increment("total_games", 1);
        })
    );
    await db("teams")
        .where({ team_name: theTeam_name, passcode_id: pcId.id })
        .delete();
    return "Users and teams are updated";
}

// After a team wins
// findPasscodeId, split the team names up, map through each teammate to update teams and users tables
async function updateTeamWins(theTeam_name, theCode) {
    const [pcId] = await findPasscodeId(theCode);
    const splitNames = theTeam_name.split(",");
    Promise.all(
        splitNames.map((i) => {
            return db("users")
                .where({ username: i, passcode_id: pcId.id })
                .increment("wins_today", 1)
                .increment("games_today", 1)
                .increment("total_wins", 1)
                .increment("total_games", 1);
        })
    );
    await db("teams")
        .where({ team_name: theTeam_name, passcode_id: pcId.id })
        .increment("team_wins", 1);
    // check if a team has not won more than the alloted number for that particular court
    const [teamObj] = await db("teams")
        .select("team_wins", "courts_id")
        .where({ team_name: theTeam_name, passcode_id: pcId.id });
    const [maxWins] = await db("courts")
        .select("num_wins")
        .where({ id: teamObj.courts_id });
    // if a team has won too many times, delete the team_name from teams table and update users active = 0
    if (teamObj.team_wins >= maxWins.num_wins) {
        await db("teams")
            .where({ team_name: theTeam_name, passcode_id: pcId.id })
            .delete();
        Promise.all(
            splitNames.map((i) => {
                return db("users")
                    .where({ username: i, passcode_id: pcId.id })
                    .update({ active: 0 });
            })
        );
        return "Congratulations!!! Your team is too good...take a break.";
    }
    return "Users and teams tables are updated";
}

// User wants to remove a username from team_name, only allow if there's more than 1 teammate
// Update users active = 0
// Input: passcode in Url, team_name/remove_name in body
// Output: message for successful or not
async function updateTeamName(theCode, team_name, remove_name) {
    const [pcId] = await findPasscodeId(theCode);
    const splitNames = team_name.split(",");
    if (splitNames.length <= 1) {
        return "You cannot remove this remaining name. Instead, delete the team";
    }
    const [newTeamName] = splitNames
        .map((i) => i)
        .filter((tname) => tname != remove_name);
    await db("teams")
        .where({ team_name: team_name, passcode_id: pcId.id })
        .update({ team_name: newTeamName });
    await updateUserNotActive(remove_name, pcId.id);
    return [];
}
