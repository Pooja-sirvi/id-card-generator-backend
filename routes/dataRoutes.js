const express = require("express");
const router = express.Router();
const Data = require("../models/Data");

// Route to fetch and display uploaded data with pagination and search
router.get("/data", async (req, res) => {
  try {
    // Get the page number and search term from the query parameters (default to empty string for search and 1 for page)
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || ""; // Search term, default to empty string
    const pageSize = 15; // Number of records per page

    // Calculate the skip value based on the page number
    const skip = (page - 1) * pageSize;

    // Create a case-insensitive regex for the search term
    const searchRegex = new RegExp(search, "i");

    // Fetch the filtered data from MongoDB with pagination and search
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
    })
      .skip(skip)
      .limit(pageSize);

    // Get the total number of records that match the search query
    const totalRecords = await Data.countDocuments({
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

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Send the filtered data and pagination info to the view
    res.render("data", {
      data,
      page,
      totalPages,
      search, // Pass the search term to the view so it can be used in the search input
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("An error occurred while fetching the data.");
  }
});

module.exports = router;
