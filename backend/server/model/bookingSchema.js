const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    venueName: String,
    venueLocation: String,
    timings: {
      startTime: String, // in 24/12 hour format
      duration: Number, // in hours
    },
    date: Date,
    reason: String,
    organisation: String,
    feedback: String,
    poc: {
      name: String,
      phone: String,
      email: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = new mongoose.model("Booking", bookingSchema);

module.exports = Booking;
