const db = require("../data/config");

module.exports = {
    findAdmins,
};

function findAdmins() {
    return db("admin").select("admin_name").orderBy("admin.id");
}

// function findAdmins(username) {
//     return db("admin").where({ username }).orderBy("username");
// }
