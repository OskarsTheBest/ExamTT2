const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const passwordComplexity = require("joi-password-complexity");

const JWTPRIVATEKEY = "30cd8fda2745ab7c406c33f96c2ad7dbd2a4d94a431106874e0ae81efa1b51b7b86ae9370c0b95a845523d1d18ec8cd7c7e9d992ba5edc81706afe3599168a82";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  history: [{
    toolName: { type: String, required: true },
    fileName: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now }
  }]
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, JWTPRIVATEKEY, { expiresIn: "7d" });
  return token;
};

const User = mongoose.model("User", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password")
  });
  return schema.validate(data);
};

module.exports = { User, validate };
