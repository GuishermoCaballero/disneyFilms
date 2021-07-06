const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    email: { type: String, required: [true, 'email is required'], unique: true },
    password: { type: String, required: [true, 'password is required'] },
    country: String,
    age: { type: Number, required: [true, 'Age is required'], min: [16, "You must be over 16 to create an acount"] },
  },
  { timestamps: true }
);
userSchema.pre('save', async function (next) {
  // logging 
  console.log(this.password);
  try {
      const hash = await bcrypt.hash(this.password, 10);
      this.password = hash;
      next();
  } catch (e) {
      throw Error('could not hash password');
  }
})
module.exports = mongoose.model("User", userSchema);