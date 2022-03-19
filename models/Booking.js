const mongoose = require("mongoose");

// Booking model with client informations and booking informations (car details included)
const Booking = mongoose.model("Booking", {
  // Client informations
  client_info: {
    client_civility: String,
    client_society: String,
    client_firstname: String,
    client_lastname: String,
    client_email: String,
    client_phonenumber: String,
    client_birthday: String,
    client_adress: {
      client_street: String,
      client_postalcode: String,
      client_city: String,
      client_country: String,
    },
  },
  //   Booking informations (with informations needed for the Backoffice page)
  booking_info: {
    booking_id: String,
    booking_date: String,
    booking_year: Number,
    booking_month: Number,
    booking_start: String,
    booking_return: String,
    booking_duration: Number,
    agency_id: String,
    agency_name: String,
    car_id: String,
    car_short_name: String,
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

module.exports = Booking;
