const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // unique: true,
    required: true, // Good practice
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  termcheck: {
    type: Boolean,
    
  }
  ,
  profilepic:String
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
