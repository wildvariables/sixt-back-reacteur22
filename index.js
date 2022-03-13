// Package imports
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const { default: axios } = require("axios");

// Serveur creation & package use
const app = express();
app.use(formidable());
app.use(cors());

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
      console.log("hello");
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

// Rajouter All routes

// Serveur launch
app.listen(3003, () => {
  console.log("It works ! 🏎️");
});
