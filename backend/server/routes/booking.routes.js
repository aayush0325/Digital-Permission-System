const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking,
  getPendingBookings,
  acceptBooking,
  rejectBooking,
} = require("../controllers/booking.controllers");
const adminCheckMiddleware = require("../middleware/admin.middleware");

// Route to create a new booking
router.post("/", createBooking);

// Route to get a booking by its ID
router.get("/:bookingId", getBookingById);

// Route to get all bookings
router.get("/", getAllBookings);

// Route to update a booking by its ID
router.post("/:bookingId", updateBooking);

// Route to delete a booking by its ID
router.post("/delete", deleteBooking);

// admin routes
router.get("/admin/pending", adminCheckMiddleware, getPendingBookings);
router.post("/admin/accept/:bookingId", adminCheckMiddleware, acceptBooking);
router.post("/admin/reject/:bookingId", adminCheckMiddleware, rejectBooking);

// postholder specific routes
router.get("/:bookingId/status", checkBookingStatus);
router.post("/:bookingId/feedback", submitFeedback);
router.get("/venues/:venueId/availability", checkVenueAvailability);

module.exports = router;
