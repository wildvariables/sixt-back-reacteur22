const express = require("express");
const router = express.Router();

// Agencies List
router.get("/agencies", async (req, res) => {
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
router.get("/rentaloffers", async (req, res) => {
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
    if (error.response.data.error.includes("zombies")) {
      res.status(400).json({ message: "no result" });
    } else {
      res.status(400).json(error.response.data);
    }
  }
});

// Car details
router.get("/cardetails", async (req, res) => {
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

module.exports = router;
