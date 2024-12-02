const express = require("express");
const router = express.Router();
const Data = require("../models/Data");

// Route to get student details by ID
router.get("/data/details/:id", async (req, res) => {
  try {
    const student = await Data.findById(req.params.id); // Find the student by ID
    if (!student) {
      return res.status(404).send("Student not found");
    }
    res.render("student-details", { student }); // Render the student details page
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching student details");
  }
});

module.exports = router;