exports.seed = function (knex) {
    // Inserts seed entries
    return knex("courts").insert([
        { court_name: "playa1", num_players: 2, num_wins: 3, passcode_id: 1 },
        { court_name: "playa2", num_players: 2, num_wins: 3, passcode_id: 1 },
        {
            court_name: "ocean_park1",
            num_players: 2,
            num_wins: 3,
            passcode_id: 2,
        },
        {
            court_name: "ocean_park2",
            num_players: 2,
            num_wins: 3,
            passcode_id: 2,
        },
    ]);
};
