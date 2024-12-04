  require("dotenv").config();
  const express = require("express");
  const cookieParser = require("cookie-parser");
  const connectDB = require("./config/config");
  const uploadRoutes = require("./routes/uploadRoutes");
  const dataRoutes = require("./routes/dataRoutes");
  const dropDbRoutes = require("./routes/dropDbRoutes");
  const deleteRoutes = require("./routes/deleteEachRoutes");
  const searchRoutes = require("./routes/searchRoutes");
  const eachRecord = require("./routes/eachRecordRoutes");
  const authRoutes = require("./routes/authRoutes");

  const app = express();

  // Connect to MongoDB
  connectDB();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser()); // For cookie handling

  // Set the view engine to EJS
  app.set("view engine", "ejs");
  app.use(express.static("public"));

  // Use the routes
  app.use(authRoutes);
  app.use(uploadRoutes);
  app.use(dataRoutes);
  app.use(dropDbRoutes);
  app.use(deleteRoutes);
  app.use(searchRoutes);
  app.use(eachRecord);


  // Route for login page
  app.get("/login", (req, res) => {
    res.render("login");
  });

  // Route for signup page
  app.get("/signup", (req, res) => {
    res.render("signup");
  });

  // Home route (protected)
  app.get("/", (req, res) => {
    // Check if user is authenticated
    if (!req.cookies.token) {
      return res.redirect("/login");
    }
    res.render("index");
  });

  // Add this error handling middleware at the end of the file, before app.listen
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: 'Something broke!' });
  });

  // Serve the app
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
