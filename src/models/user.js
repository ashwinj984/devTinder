const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong enough");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not Valid");
            }
        },
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("URL is not valid");
            }
        }
    },
    about: {
        type: String,
        default: "This is a default description of the user",
    },
    skills: {
        type: [String],
    },

}, {
    timestamps: true,
});

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, "DEV@Tinder$8546", { expiresIn: "1d" })
    return token;
}

userSchema.methods.validatePassword = async function (passowrdInputByUser) {
    const user = this;
    const passwordHash = this.password;

    const isPasswordValid = await bcrypt.compare(passowrdInputByUser, passwordHash);
    return isPasswordValid;

}

const User = mongoose.model("User", userSchema);

module.exports = User;