const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

// Server Start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
