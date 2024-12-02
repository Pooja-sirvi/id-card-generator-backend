const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);

const dataSchema = new mongoose.Schema({
  slNo: {
    type: Number,
    required: true,
    unique: true,
  },
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  usn: { type: String, required: true },
  branch: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  fathersName: { type: String, required: true },
  residentialAddress: { type: String, required: true },
  unformattedPhoneNumber: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

// Apply the mongoose-sequence plugin to auto-increment slNo
dataSchema.plugin(mongooseSequence, { inc_field: "slNo" });

const Data = mongoose.model("Data", dataSchema);

module.exports = Data;
