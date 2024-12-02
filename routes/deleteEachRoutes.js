const express = require("express");
const router = express.Router();
const Data = require("../models/Data");

// DELETE route to delete a record by ID
router.delete("/delete-record/:id", async (req, res) => {
  try {
    const recordId = req.params.id;
    
    // Find the record to be deleted and its slNo
    const recordToDelete = await Data.findById(recordId);
    
    if (!recordToDelete) {
      return res.status(404).json({ error: "Record not found" });
    }

    // Delete the record
    const result = await Data.findByIdAndDelete(recordId);

    if (!result) {
      return res.status(404).json({ error: "Failed to delete record" });
    }

    // Reindex the remaining records
    await Data.updateMany(
      { slNo: { $gt: recordToDelete.slNo } }, // Find records with slNo greater than the deleted one
      { $inc: { slNo: -1 } } // Decrease slNo by 1
    );

    res.json({ success: true, message: "Record deleted and serial numbers updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the record" });
  }
});


module.exports = router;
