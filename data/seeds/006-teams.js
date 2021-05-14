exports.seed = function (knex) {
    // Inserts seed entries
    return knex("teams").insert([
        { team_name: "user1/user2", courts_id: 1 },
        { team_name: "user3/user4", courts_id: 1 },
        { team_name: "user5/user6", courts_id: 2 },
        { team_name: "user7/user8", courts_id: 2 },
        { team_name: "user9/user10", courts_id: 3 },
        { team_name: "user11/user12", courts_id: 3 },
        { team_name: "user13/user14", courts_id: 4 },
        { team_name: "user15/user16", courts_id: 4 },
        { team_name: "user17/user18", courts_id: 1 },
        { team_name: "user19/user20", courts_id: 1 },
    ]);
};
