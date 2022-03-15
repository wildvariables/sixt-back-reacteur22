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

// models

const Booking = mongoose.model("Booking", {
  client_info: {
    client_civility: String,
    client_society: String,
    client_firstname: String,
    client_lastname: String,
    client_email: String,
    client_phonenumber: Number,
    client_birthday: String,
    client_adress: {
      client_street: String,
      client_postalcode: String,
      client_city: String,
      client_country: String,
    },
  },
  booking_info: {
    booking_number: Number,
    booking_date: String,
    booking_duration: Number,
    booking_totalprice: Number,
  },
});

// Routes

// Agence List
app.get("/agencies", async (req, res) => {
  try {
    if (req.query.search.length >= 3) {
      const response = await axios.get(
        `https://lereacteur-bootcamp-api.herokuapp.com/api/sixt/locations?term=${req.query.search}`
      );
      res.json(response.data);
    } else {
      res
        .status(409)
        .json({ message: "Enter text (min 3 letters) to start the search" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// Offer list
app.get("/rentaloffers", async (req, res) => {
  try {
    if (req.query.agency && req.query.pickupDate && req.query.returnDate) {
      let toAdd = `?pickupStation=${req.query.agency}&returnStation=${req.query.agency}&pickupDate=2021-05-28T12:30:00&returnDate=2021-05-30T08:30:00`;
      const response = await axios.get(
        `https://lereacteur-bootcamp-api.herokuapp.com/api/sixt/rentaloffers${toAdd}`
      );
      res.json(response.data);
    } else {
      res.status(409).json({ message: "At least one info is missing" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// Car details
app.get("/cardetails", async (req, res) => {
  try {
    if (req.query.id) {
      const response = await axios.post(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/sixt/rentalconfigurations/create",
        { offerId: req.query.id }
      );
      res.json(response.data);
    } else {
      res.status(409).json({ message: "ID is missing" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// Rajouter All routes

// Serveur launch
app.listen(3003, () => {
  console.log("It works ! 🏎️");
});
