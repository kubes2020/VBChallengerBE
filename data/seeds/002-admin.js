exports.seed = function (knex) {
    // Inserts seed entries
    return knex("admin").insert([
        { admin_name: "BRIAN", password: "1111" },
        { admin_name: "BOBBY", password: "2222" },
    ]);
};
