module.exports = {
    isValid,
};

function isValid(admin) {
    return Boolean(
        admin.admin_email &&
            admin.password &&
            typeof admin.password === "string"
    );
}
