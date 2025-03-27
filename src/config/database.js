const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://ashwinj984:AOCiXso4lzjnJdi2@namastenode.ypmezpg.mongodb.net/devTinder"
    );
}

module.exports = connectDB;

