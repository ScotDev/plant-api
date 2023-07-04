const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  // UUID type does exist but throws error, figure out later
  UUID: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  googleUid: { type: String, required: true },
  photoUrl: { type: String },
  subscription: { type: String },
  created: { type: Date, default: Date.now },
});

mongoose.model("users", UserSchema);
