require("dotenv").config();
const express = require("express");
const connectDB = require("./config/config");
const uploadRoutes = require("./routes/uploadRoutes");
const dataRoutes = require("./routes/dataRoutes");
const dropDbRoutes = require("./routes/dropDbRoutes");
const deleteRoutes = require("./routes/deleteEachRoutes");
const searchRoutes = require("./routes/searchRoutes");
const eachRecord = require("./routes/eachRecordRoutes");
const app = express();

// Connect to MongoDB
connectDB();

// Set the view engine to EJS
app.set("view engine", "ejs");
app.use(express.static("public"));

// Use the routes
app.use(uploadRoutes);
app.use(dataRoutes);
app.use(dropDbRoutes);
app.use(deleteRoutes);
app.use(searchRoutes);
app.use(eachRecord);

app.get("/", (req, res) => {
  res.render("index");
});

// Serve the app
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
