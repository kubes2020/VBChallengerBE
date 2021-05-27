const router = require("express").Router();
const bcrypt = require("bcryptjs");
const AuthAdmin = require("../models/auth-models.js");
const { isValid } = require("./isValid.js");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./secret.js");

// Input: password and admin_email in body
router.post("/register", (req, res) => {
    const credentials = req.body;

    if (isValid(credentials)) {
        const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 8;
        const hash = bcrypt.hashSync(credentials.password, rounds);
        credentials.password = hash;

        // save admin to database
        // returns object of new admin
        AuthAdmin.add(credentials)
            .then((admin) => {
                res.status(200).json({ data: admin });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Issue with your email or password",
                });
            });
    } else {
        res.status(400).json({
            message: "Please provide an email and password",
        });
    }
});

router.post("/login", (req, res) => {
    const { admin_email, password } = req.body;

    if (isValid(req.body)) {
        AuthAdmin.findByEmail(admin_email)
            // returns an array with admin object inside
            // must destructure the admin array
            .then(([admin]) => {
                if (admin && bcrypt.compareSync(password, admin.password)) {
                    const token = makeToken(admin);
                    res.status(200).json({
                        message: "Welcome to our API",
                        token,
                        admin,
                    });
                } else {
                    res.status(401).json({
                        message: "Invalid email or password",
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Issue with your email or password",
                });
            });
    } else {
        res.status(400).json({
            message: "Please provide an email and password",
        });
    }
});

function makeToken(admin) {
    const payload = {
        subject: admin.id,
        email: admin.admin_email,
    };
    const options = {
        expiresIn: "7 days",
    };
    return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
