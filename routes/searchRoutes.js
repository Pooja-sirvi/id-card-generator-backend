const express = require("express");
const router = express.Router();
const Data = require("../models/Data");

// Route to fetch and display uploaded data with search only (no pagination)
router.get("/search", async (req, res) => {
  try {
    // Get the search term from the query parameters (default to empty string for search)
    const search = req.query.search || ""; // Search term, default to empty string

    // Create a case-insensitive regex for the search term
    const searchRegex = new RegExp(search, "i");

    // Fetch the filtered data from MongoDB without pagination
    const data = await Data.find({
      // Apply the search filter to relevant fields (adjust as needed)
      $or: [
        { firstName: { $regex: searchRegex } },
        { secondName: { $regex: searchRegex } },
        { usn: { $regex: searchRegex } },
        { branch: { $regex: searchRegex } },
        { bloodGroup: { $regex: searchRegex } },
        { fathersName: { $regex: searchRegex } },
        { residentialAddress: { $regex: searchRegex } },
        { phoneNumber: { $regex: searchRegex } },
      ],
    });

    // Send the filtered data to the view
    res.render("search", {
      data,
      search, // Pass the search term to the view so it can be used in the search input
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("An error occurred while fetching the data.");
  }
});

module.exports = router;
