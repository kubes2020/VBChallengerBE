exports.seed = function (knex) {
    // Inserts seed entries
    return knex("admin").insert([
        { admin_email: "BRIAN@ME.COM", password: "1111" },
        { admin_email: "BOBBY@ME.COM", password: "2222" },
    ]);
};
