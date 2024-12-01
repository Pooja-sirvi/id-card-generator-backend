const express = require('express');
const connectDB = require('./config/config');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Connect to database
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('ID Card App');
});

app.get("/op", (req, res) => {
  res.send("ID Card App");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});