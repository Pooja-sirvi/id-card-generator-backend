const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Route to drop the entire database
router.post("/drop-database", async (req, res) => {
  try {
    // Ensure this action is authorized
    // You can add an authorization check here, for example, by checking for an admin token.

    // Drop the database
    await mongoose.connection.dropDatabase();

    // Send success response
    res.json({ message: "Database dropped successfully!" });
  } catch (error) {
    console.error("Error dropping database:", error);
    res
      .status(500)
      .json({ error: "An error occurred while dropping the database." });
  }
});

module.exports = router;
