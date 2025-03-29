const jwt = require("jsonwebtoken");
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    try {
        // Read the token from the request cookies
        const cookies = req.cookies;

        const { token } = cookies;
        if (!token) {
            throw new Error("Token is not valid");
        }

        const decodedObj = await jwt.verify(token, "DEV@Tinder$8546");

        // Validate the token

        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        } else {
            req.user = user;
            next();
        }
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }

}

module.exports = { userAuth }