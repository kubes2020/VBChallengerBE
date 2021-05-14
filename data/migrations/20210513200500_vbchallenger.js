exports.up = function (knex) {
    return knex.schema
        .createTable("admin", (tbl) => {
            tbl.increments();
            tbl.string("admin_name", 255).notNullable().unique();
            tbl.string("password", 255).notNullable();
        })
        .createTable("passcode", (tbl) => {
            tbl.increments();
            tbl.string("code", 255).notNullable().unique();
            tbl.integer("admin_id")
                .unsigned()
                .notNullable()
                .references("id")
                .inTable("admin")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");
        })
        .createTable("courts", (tbl) => {
            tbl.increments();
            tbl.string("court_name", 255).notNullable().unique();
            tbl.integer("num_players").notNullable();
            tbl.integer("num_wins");
            tbl.integer("passcode_id")
                .unsigned()
                .notNullable()
                .references("id")
                .inTable("passcode")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");
        })
        .createTable("teams", (tbl) => {
            tbl.increments();
            tbl.string("team_name", 255).notNullable();
            tbl.integer("courts_id")
                .unsigned()
                .notNullable()
                .references("id")
                .inTable("courts")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");
        })
        .createTable("users", (tbl) => {
            tbl.increments();
            tbl.string("username", 255).notNullable().unique();
            tbl.integer("passcode_id")
                .unsigned()
                .notNullable()
                .references("id")
                .inTable("passcode")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("admin")
        .dropTableIfExists("passcode")
        .dropTableIfExists("courts")
        .dropTableIfExists("teams")
        .dropTableIfExists("users");
};
