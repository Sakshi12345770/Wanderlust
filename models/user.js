const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
const passportLocalMongoose = plm.default || plm;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);