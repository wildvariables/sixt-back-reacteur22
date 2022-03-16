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
    booking_start: String,
    booking_return: String,
    booking_duration: Number,
    agency_id: String,
    agency_name: String,
    car_id: String,
    car_shirt_name: String,
    car_long_name: String,
    car_picture: String,
    car_driver_min_age: Number,
    car_price_details: {
      car_day_price: Number,
      car_location_price: Number,
      car_included_charges: Array,
      car_extra_fees: Array,
      car_selected_additional_charges: Array,
    },
    booking_total_price: Number,
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

// Booking CRUD

// Create
app.post("/booking/create", async (req, res) => {
  try {
    const newBooking = new Booking({
      client_info: {
        client_civility: req.fields.civility,
        client_society: req.fields.society,
        client_firstname: req.fields.firstname,
        client_lastname: req.fields.lastname,
        client_email: req.fields.email,
        client_phonenumber: req.fields.phonenumber,
        client_birthday: req.fields.birthday,
        client_adress: {
          client_street: req.fields.street,
          client_postalcode: req.fields.postalcode,
          client_city: req.fields.city,
          client_country: req.fields.country,
        },
      },
      booking_info: {
        booking_number: req.fields.booking_number,
        booking_date: req.fields.booking_date,
        booking_start: req.fields.booking_start,
        booking_return: req.fields.booking_return,
        booking_duration: req.fields.booking_duration,
        agency_id: req.fields.agency_id,
        agency_name: req.fields.agency_name,
        car_id: req.fields.car_id,
        car_shirt_name: req.fields.car_short_name,
        car_long_name: req.fields.car_long_name,
        car_picture: req.fields.car_picture,
        car_driver_min_age: req.fields.driver_min_age,
        car_price_details: {
          car_day_price: req.fields.day_price,
          car_location_price: req.fields.location_price,
          car_included_charges: req.fields.included_charges,
          car_extra_fees: req.fields.extra_fees,
          car_selected_additional_charges: req.fields.additional_charges,
        },
        booking_total_price: req.fields.total_price,
      },
    });
    await newBooking.save();
    console.log(newBooking);
    res.json({ message: "It worked !" });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// Read

// Update

// Delete

// Rajouter All routes

// Serveur launch
app.listen(3003, () => {
  console.log("It works ! 🏎️");
});
