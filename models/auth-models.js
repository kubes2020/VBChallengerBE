const db = require("../data/config");

module.exports = {
    add,
    findByEmail,
};

async function add(newAdmin) {
    const [id] = await db("admin").insert(newAdmin, "id");
    return findById(id);
}

function findById(id) {
    return db("admin").where({ id }).first();
}

function findByEmail(admin_email) {
    return db("admin").where({ admin_email });
}
