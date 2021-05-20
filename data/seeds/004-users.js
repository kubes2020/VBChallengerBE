exports.seed = function (knex) {
    // Inserts seed entries
    return knex("users").insert([
        {
            username: "USER1",
            passcode_id: 1,
            active: 1,
        },
        {
            username: "USER2",
            passcode_id: 1,
            active: 1,
        },
        {
            username: "USER3",
            passcode_id: 1,
            active: 1,
        },
        {
            username: "USER4",
            passcode_id: 1,
            active: 1,
        },
        {
            username: "USER5",
            passcode_id: 1,
            active: 1,
        },
        {
            username: "USER6",
            passcode_id: 1,
            active: 1,
        },
        {
            username: "USER7",
            passcode_id: 1,
            active: 1,
        },
        {
            username: "USER8",
            passcode_id: 1,
            active: 1,
        },
        {
            username: "USER9",
            passcode_id: 2,
            active: 0,
        },
        {
            username: "USER10",
            passcode_id: 2,
            active: 0,
        },
        {
            username: "USER11",
            passcode_id: 2,
            active: 0,
        },
        {
            username: "USER12",
            passcode_id: 2,
            active: 0,
        },
        {
            username: "USER13",
            passcode_id: 2,
            active: 0,
        },
        {
            username: "USER14",
            passcode_id: 2,
            active: 0,
        },
        {
            username: "USER15",
            passcode_id: 2,
            active: 0,
        },
        {
            username: "USER16",
            passcode_id: 2,
            active: 0,
        },
        {
            username: "USER17",
            passcode_id: 1,
            active: 1,
        },
        {
            username: "USER18",
            passcode_id: 1,
            active: 1,
        },
        {
            username: "USER19",
            passcode_id: 1,
            active: 1,
        },
        {
            username: "USER20",
            passcode_id: 1,
            active: 1,
        },
    ]);
};
