exports.seed = function (knex) {
    // Inserts seed entries
    return knex("passcode").insert([
        { code: "XXXX", admin_id: 1 },
        { code: "YYYY", admin_id: 2 },
    ]);
};
