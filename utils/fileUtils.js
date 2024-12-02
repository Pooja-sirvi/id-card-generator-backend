const multer = require("multer");
const xlsx = require("xlsx");
const Data = require("../models/Data");

// Define allowed file types (Excel files)
const allowedMimeTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

// Multer setup: file upload with validation
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only Excel files are allowed.")); // Reject the file
    }
  },
});

// Function to process and store data from the uploaded Excel file
const processFile = async (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  if (data.length === 0) {
    throw new Error("No data found in the file.");
  }

  let newRecords = 0;
  let skippedRecords = 0;
  const bulkOps = [];

  // Get the highest current slNo in the database
  const lastRecord = await Data.findOne().sort({ slNo: -1 }).limit(1);
  let nextSlNo = lastRecord ? lastRecord.slNo + 1 : 1; // If no record, start from 1

  for (const row of data) {
    const existingRecord = await Data.findOne({ usn: row["USN"] });

    if (!existingRecord) {
      bulkOps.push({
        updateOne: {
          filter: { usn: row["USN"] },
          update: {
            $setOnInsert: {
              slNo: nextSlNo++, // Increment slNo for each new record
              firstName: row["First Name"],
              secondName: row["Second Name"],
              usn: row["USN"],
              branch: row["Branch"],
              bloodGroup: row["Blood Group"],
              fathersName: row["Fathers Name"],
              residentialAddress: row["Residential Address"],
              unformattedPhoneNumber: row["(Unformatted) Phone Number"],
              phoneNumber: row["Phone Number"],
            },
          },
          upsert: true,
        },
      });
      newRecords++;
    } else {
      skippedRecords++;
    }
  }

  if (bulkOps.length > 0) {
    await Data.bulkWrite(bulkOps);
  }

  return { newRecords, skippedRecords };
};



module.exports = { upload, processFile };
