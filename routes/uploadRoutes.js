const express = require("express");
const router = express.Router();
const { upload, processFile } = require("../utils/fileUtils");
const Data = require("../models/Data"); // Import the Data model

// Route to upload and process Excel file
router.post("/upload", upload.single("excelFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const result = await processFile(req.file.path); // Process the file
    console.log(result); // Log the result to inspect its structure

    const { newRecords, skippedRecords } = result;

    // Send a success message with skipped records if any
    let message = "File uploaded and data appended to MongoDB.";
    if (skippedRecords > 0) {
      message += ` ${skippedRecords} records were skipped.`;
    }

    res.send({
      message: message,
      newRecords,
      skippedRecords,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    if (error.message === "Only Excel files are allowed.") {
      return res.status(400).send(error.message);
    }
    res.status(500).send("An error occurred while processing the file.");
  }
});


module.exports = router;
