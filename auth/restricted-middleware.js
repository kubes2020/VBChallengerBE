const { jwtSecret } = require("./secret.js");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Must have a token" });
    }
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token is bad or expired" });
        }
        req.decodedJwt = decoded;
        next();
    });
};
