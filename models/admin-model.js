const db = require("../data/config");

module.exports = {
    findAdmins,
    adminAdjust,
    adminNewDay,
    adminNewPasscode,
    adminDeletePasscode,
    adminCreateCourts,
};

// (Helper Function) Find passcode.id from code (code is a unique value)
function findPasscodeId(theCode) {
    return db("passcode").select("id").where({ "passcode.code": theCode });
}

// Find all admins and their corresponding passcode(s)
function findAdmins() {
    return db("admin")
        .join("passcode", "admin_id", "admin.id")
        .select("admin_email", "code")
        .orderBy("admin.id");
}

// Admin needs to make a correction to the order of waitlist
// "adjust_adjust" moves this team_name to the top of the waitlist
async function adminAdjust(theTeam_name, theCode) {
    const pcId = await findPasscodeId(theCode);
    await db("teams")
        .where({ team_name: theTeam_name, passcode_id: pcId[0].id })
        .decrement("admin_adjust", 1);
    return db("teams")
        .select("team_name", "admin_adjust", "passcode_id")
        .where({ team_name: theTeam_name, passcode_id: pcId[0].id });
}

// Admin wants to clear teams waitlist and update users' stats to start a new day
async function adminNewDay(theCode) {
    const pcId = await findPasscodeId(theCode);
    await db("teams").where({ passcode_id: pcId[0].id }).delete();
    await db("users")
        .where({ passcode_id: pcId[0].id })
        .update({ active: 0, wins_today: 0, games_today: 0 });
}

// Admin starts a brand new meetup with new beach passcode
async function adminNewPasscode(theAdminId, newCode) {
    const codeCheck = await db("passcode")
        .select("code")
        .where({ code: newCode });
    if (codeCheck.length === 0) {
        await db("passcode").insert({ code: newCode, admin_id: theAdminId });
        return [];
    } else {
        return "Sorry, try a different passcode";
    }
}

// Admin wants to delete beach passcode and all corresponding data
// "casecade" does not work -> must delete each table column individually
async function adminDeletePasscode(theCode, theAdminId) {
    const oldCodeObj = await db("passcode")
        .select("id", "code")
        .where({ code: theCode, admin_id: theAdminId });
    if (oldCodeObj.length > 0) {
        await db("courts").where({ passcode_id: oldCodeObj[0].id }).delete();
        await db("teams").where({ passcode_id: oldCodeObj[0].id }).delete();
        await db("users").where({ passcode_id: oldCodeObj[0].id }).delete();
        await db("passcode").where({ code: theCode }).delete();
        return `The code: ${oldCodeObj[0].code} and all corresponding data was deleted`;
    } else {
        return [];
    }
}

// Admin can create courts after previously creating a passcode
// Input: court_name / num_players / num_wins / passcode_id in body
// Output: message if successful or not
async function adminCreateCourts(
    court_name,
    num_players,
    num_wins,
    passcode_id
) {
    const nameExists = await db("courts")
        .select("court_name")
        .where({ court_name, passcode_id });
    if (nameExists.length > 0) {
        return "That court name already exists, try again.";
    } else {
        await db("courts").insert({
            court_name: court_name,
            num_players: num_players,
            num_wins: num_wins,
            passcode_id: passcode_id,
        });
        return [];
    }
}
