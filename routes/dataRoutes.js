const express = require("express");
const router = express.Router();
const Data = require("../models/Data");

// Route to fetch and display uploaded data with pagination
router.get("/data", async (req, res) => {
  try {
    // Get the page number from the query parameters (default to 1)
    const page = parseInt(req.query.page) || 1;
    const pageSize = 15; // Number of records per page

    // Calculate the skip value based on the page number
    const skip = (page - 1) * pageSize;

    // Fetch the data from MongoDB with pagination
    const data = await Data.find().skip(skip).limit(pageSize);

    // Get the total number of records to calculate total pages
    const totalRecords = await Data.countDocuments();
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Send the data and pagination info to the view
    res.render("data", {
      data,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("An error occurred while fetching the data.");
  }
});

module.exports = router;
