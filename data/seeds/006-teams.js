exports.seed = function (knex) {
    // Inserts seed entries
    return knex("teams").insert([
        { team_name: "USER1,USER2", team_wins: 0, courts_id: 1 },
        { team_name: "USER3,USER4", team_wins: 0, courts_id: 1 },
        { team_name: "USER5,USER6", team_wins: 0, courts_id: 2 },
        { team_name: "USER7,USER8", team_wins: 0, courts_id: 2 },
        { team_name: "USER9,USER10", team_wins: 0, courts_id: 3 },
        { team_name: "USER11,USER12", team_wins: 0, courts_id: 3 },
        { team_name: "USER13,USER14", team_wins: 0, courts_id: 4 },
        { team_name: "USER15,USER16", team_wins: 0, courts_id: 4 },
        { team_name: "USER17,USER18", team_wins: 0, courts_id: 1 },
        { team_name: "USER19,USER20", team_wins: 0, courts_id: 1 },
    ]);
};
