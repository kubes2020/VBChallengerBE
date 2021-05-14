exports.seed = function (knex) {
    // Inserts seed entries
    return knex("admin").insert([
        { admin_name: "Brian", password: "1111" },
        { admin_name: "Bobby", password: "2222" },
    ]);
};
