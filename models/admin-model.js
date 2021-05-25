const db = require("../data/config");

module.exports = {
    findAdmins,
    adminAdjust,
    adminNewDay,
    adminNewPasscode,
    adminDeletePasscode,
};

// (Helper Function) Find passcode.id from code (code is a unique value)
function findPasscodeId(theCode) {
    return db("passcode").select("id").where({ "passcode.code": theCode });
}

// Find all admins and their corresponding passcode(s)
function findAdmins() {
    return db("admin")
        .join("passcode", "admin_id", "admin.id")
        .select("admin_name", "code")
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
async function adminDeletePasscode(theCode) {
    const oldCodeObj = await db("passcode")
        .select("id", "code")
        .where({ code: theCode });
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
