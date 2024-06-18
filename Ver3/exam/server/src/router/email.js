// In your router/users.js (assuming you have a separate file for routes)
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust the path to your User model

// Route to get user data by email
router.get('/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
