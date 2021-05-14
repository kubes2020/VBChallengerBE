exports.seed = function (knex) {
    // Inserts seed entries
    return knex("users").insert([
        { username: "User1", passcode_id: 1, courts_id: 1 },
        { username: "User2", passcode_id: 1, courts_id: 1 },
        { username: "User3", passcode_id: 1, courts_id: 1 },
        { username: "User4", passcode_id: 1, courts_id: 1 },
        { username: "User5", passcode_id: 1, courts_id: 2 },
        { username: "User6", passcode_id: 1, courts_id: 2 },
        { username: "User7", passcode_id: 1, courts_id: 2 },
        { username: "User8", passcode_id: 1, courts_id: 2 },
        { username: "User9", passcode_id: 2, courts_id: 3 },
        { username: "User10", passcode_id: 2, courts_id: 3 },
        { username: "User11", passcode_id: 2, courts_id: 3 },
        { username: "User12", passcode_id: 2, courts_id: 3 },
        { username: "User13", passcode_id: 2, courts_id: 4 },
        { username: "User14", passcode_id: 2, courts_id: 4 },
        { username: "User15", passcode_id: 2, courts_id: 4 },
        { username: "User16", passcode_id: 2, courts_id: 4 },
    ]);
};
