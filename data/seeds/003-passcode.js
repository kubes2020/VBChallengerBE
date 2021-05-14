exports.seed = function (knex) {
    // Inserts seed entries
    return knex("passcode").insert([
        { code: "xxxx", admin_id: 1 },
        { code: "yyyy", admin_id: 2 },
    ]);
};
