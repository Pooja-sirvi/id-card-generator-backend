const express = require("express");
const router = express.Router();
const Data = require("../models/Data");

// DELETE route to delete a record by ID
router.delete("/delete-record/:id", async (req, res) => {
  try {
    const recordId = req.params.id;
    const result = await Data.findByIdAndDelete(recordId);

    if (!result) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the record" });
  }
});

module.exports = router;
