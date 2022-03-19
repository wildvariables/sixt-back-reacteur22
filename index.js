// Package imports
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const { default: axios } = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

// Serveur creation & package use
const app = express();
app.use(formidable());
app.use(cors());
mongoose.connect(process.env.MONGODB_URI);

// Routes

// Searching routes
const searchRoutes = require("./routes/search");
app.use(searchRoutes);

// Booking routes with database
const bookingRoutes = require("./routes/booking");
app.use(bookingRoutes);

// Backoffice : check password
app.get("/backoffice", (req, res) => {
  try {
    if (req.query.input === "HelloWorld!") {
      res.json({ message: "password correct" });
    } else {
      res.json({ message: "password incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

// All routes
app.get("*", (req, res) => {
  res.json({ message: "Welcome on my (fake) Sixt API ! 🏎️" });
});

// Serveur launch
app.listen(process.env.PORT, () => {
  console.log("It works ! 🏎️");
});
