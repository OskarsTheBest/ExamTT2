const { User } = require('../models/user');

const updateUserHistory = async (email, toolName, usedFileName) => {
  try {
    console.log(`Updating history for user with email: ${email}, Tool Name: ${toolName}, File: ${usedFileName}`);
    // Find user by email and update history
    await User.findOneAndUpdate(
      { email: email }, // Find user by email
      { $push: { history: { toolName, usedFileName, date: new Date() } } },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating user history:', error);
  }
};

module.exports = updateUserHistory;
