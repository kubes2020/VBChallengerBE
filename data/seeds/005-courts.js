exports.seed = function (knex) {
    // Inserts seed entries
    return knex("courts").insert([
        { court_name: "PLAYA1", num_players: 2, num_wins: 3, passcode_id: 1 },
        { court_name: "PLAYA2", num_players: 2, num_wins: 3, passcode_id: 1 },
        {
            court_name: "OCEAN_PARK1",
            num_players: 2,
            num_wins: 3,
            passcode_id: 2,
        },
        {
            court_name: "OCEAN_PARK2",
            num_players: 2,
            num_wins: 3,
            passcode_id: 2,
        },
    ]);
};
