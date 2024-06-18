const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const SALT = 10;

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(409).send({ message: "User with given email already exists!" });

    const salt = await bcrypt.genSalt(Number(SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hashPassword,
      isAdmin: req.body.isAdmin || false
    });

    await newUser.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get('/history', async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send('No token provided.');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      return res.status(404).send('User not found.');
    }
    res.json({ history: user.history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/admin", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send("No token provided.");

  try {
    const decodedToken = jwt.verify(token, JWT_PRIVATE_KEY);
    if (!decodedToken.isAdmin) return res.status(403).send("Access denied.");

    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/admin/:email", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send("No token provided.");

  try {
    const decodedToken = jwt.verify(token, JWT_PRIVATE_KEY);
    if (!decodedToken.isAdmin) return res.status(403).send("Access denied.");

    const user = await User.findOneAndDelete({ email: req.params.email });
    if (!user) return res.status(404).send("User not found.");

    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
