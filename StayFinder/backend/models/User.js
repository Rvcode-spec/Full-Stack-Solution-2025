const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String, unique: true },
    isHost: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema); 
