const { User } = require('../models/user');

const updateUserHistory = async (email, toolName, fileName) => {
  try {
    console.log(`Updating history for user with email: ${email}, Tool Name: ${toolName}, File: ${fileName}`);
    await User.findOneAndUpdate(
      { email: email }, 
      { $push: { history: { toolName, fileName, date: new Date() } } },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating user history:', error);
  }
};

module.exports = updateUserHistory;
