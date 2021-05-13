const pgConnection =
    process.env.DATABASE_URL || "postgresql://postgres@localhost/api/";

module.exports = {
    development: {
        client: "sqlite3",
        connection: {
            filename: "./data/vbchallenger.db3",
        },
        migrations: {
            directory: "./data/migrations",
        },
        seeds: {
            directory: "./data/seeds",
        },
        useNullAsDefault: true,
        pool: {
            afterCreate: (conn, done) => {
                conn.run("PRAGMA foreign_key = ON", done);
            },
        },
    },

    production: {
        client: "pg",
        connection: pgConnection,
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: "./data/migrations",
        },
        seeds: {
            directory: "./data/seeds",
        },
    },
};
