const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Booking CRUD

// Create: Create a new booking
router.post("/booking/create", async (req, res) => {
  try {
    // Booking ID build (with a search in the database to calcul the last two numbers)
    let bookingId = "";
    bookingId += req.fields.lastname.slice(0, 3).toUpperCase();
    const bookingDate = new Date();
    const year = bookingDate.getFullYear();
    const month = bookingDate.getMonth() + 1;
    bookingId += year.toString().slice(-2);
    if (month < 10) {
      bookingId += "0" + month.toString();
    } else {
      bookingId += month.toString();
    }
    const checkBookings = await Booking.find({
      booking_year: year,
      booking_month: month,
    });
    if (checkBookings.length > 0) {
      const lastBookingId = Number(
        checkBookings[checkBookings.length - 1].booking_info.booking_id.slice(
          -2
        )
      );
      if (lastBookingId < 9) {
        bookingId += "0" + (lastBookingId + 1);
      } else {
        bookingId += lastBookingId + 1;
      }
    } else {
      bookingId += "01";
    }
    // Creation of a new booking according to the model (mandatory inputs are managed in the frontend)
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
        booking_id: bookingId,
        booking_date: bookingDate,
        booking_year: year,
        booking_month: month,
        booking_start: req.fields.booking_start,
        booking_return: req.fields.booking_return,
        booking_duration: req.fields.booking_duration,
        agency_id: req.fields.agency_id,
        agency_name: req.fields.agency_name,
        car_id: req.fields.car_id,
        car_short_name: req.fields.car_short_name,
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
    // Pushing the Booking ID to be displayed in the confirmation modal
    res.json({ bookingId: newBooking.booking_info.booking_id });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// Read the list of bookings
router.get("/booking/read", async (req, res) => {
  try {
    const bookingList = await Booking.find();
    res.json(bookingList);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// Update

// Delete : Delete one booking according to its ID
router.get("/booking/delete", async (req, res) => {
  try {
    if (req.query.id) {
      const bookingToDelete = await Booking.findByIdAndDelete(req.query.id);
      res.json("Booking deleted");
    } else {
      res.json("Please, enter an ID");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
