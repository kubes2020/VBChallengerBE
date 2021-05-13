const db = require("../data/config");

module.exports = {
    findAdmins,
};

function findAdmins(username) {
    return db("admin").where({ username }).orderBy("username");
}
