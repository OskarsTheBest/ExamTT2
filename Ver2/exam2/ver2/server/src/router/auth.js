const router = require("express").Router();
const { User } = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_PRIVATE_KEY = "30cd8fda2745ab7c406c33f96c2ad7dbd2a4d94a431106874e0ae81efa1b51b7b86ae9370c0b95a845523d1d18ec8cd7c7e9d992ba5edc81706afe3599168a82";

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).send({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).send({ message: "Invalid Email or Password" });

    // Generate JWT token with user's email
    const token = jwt.sign({ email: user.email }, JWT_PRIVATE_KEY, { expiresIn: "7d" });

    res.status(200).send({ data: token, message: "Logged in successfully" });
  } catch (error) {
    console.error('Error in auth route:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(data);
};

module.exports = router;
