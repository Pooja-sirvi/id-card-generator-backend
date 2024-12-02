const express = require("express");
const connectDB = require("./config/config");
const uploadRoutes = require("./routes/uploadRoutes");
const dataRoutes = require("./routes/dataRoutes");
const dropDbRoutes = require("./routes/dropDbRoutes");
const deleteRoutes = require("./routes/deleteEachRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Set the view engine to EJS
app.set("view engine", "ejs");
app.use(express.static("public"));

// Use the routes
app.use(uploadRoutes); // Use routes for uploading data
app.use(dataRoutes); // Use routes for fetching data
app.use(dropDbRoutes); // Use routes for dropping db
app.use(deleteRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

// Serve the app
app.listen(3000, () => console.log("Server running on port 3000"));
