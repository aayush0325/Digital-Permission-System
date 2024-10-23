const {
  createBooking,
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking,
  getPendingBookingsService,
  updateBookingStatus,
} = require("../services/booking.service");
const logger = require("../logger");
const moment = require("moment");

// Create Booking
module.exports.createBooking = async (req, res, next) => {
  try {
    const {
      venueName,
      venueLocation,
      timings,
      date,
      reason,
      organisation,
      poc,
      phoneNumber,
      email,
    } = req.body;

    // Validate required fields
    if (
      !venueName ||
      !venueLocation ||
      !timings ||
      !timings.startTime ||
      !timings.duration ||
      !date ||
      !reason ||
      !organisation ||
      !poc ||
      !phoneNumber ||
      !email
    ) {
      logger.warn("Missing required booking information");
      return res.status(400).send("All fields are required");
    }

    const bookingData = {
      venueName,
      venueLocation,
      timings: {
        startTime: timings.startTime,
        duration: timings.duration,
      },
      date,
      reason,
      organisation,
      poc,
      phoneNumber,
      email,
    };

    const newBooking = await createBooking(bookingData);
    logger.info(`New booking created for venue: ${venueName}`);
    return res.status(201).json(newBooking);
  } catch (error) {
    logger.error(`Error creating booking: ${error.message}`);
    next(error);
  }
};

// Get Booking by ID
module.exports.getBookingById = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      logger.warn("Booking ID not provided");
      return res.status(400).send("Booking ID is required");
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      logger.warn(`Booking not found for ID: ${bookingId}`);
      return res.status(404).send("Booking not found");
    }

    logger.info(`Booking retrieved for ID: ${bookingId}`);
    return res.status(200).json(booking);
  } catch (error) {
    logger.error(`Error retrieving booking by ID: ${error.message}`);
    next(error);
  }
};

// Get All Bookings
module.exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await getAllBookings();
    logger.info("All bookings retrieved");
    return res.status(200).json(bookings);
  } catch (error) {
    logger.error(`Error retrieving all bookings: ${error.message}`);
    next(error);
  }
};

// Update Booking
module.exports.updateBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const {
      venueName,
      venueLocation,
      timings,
      date,
      reason,
      organisation,
      poc,
      phoneNumber,
      email,
    } = req.body;

    if (!bookingId) {
      logger.warn("Booking ID not provided");
      return res.status(400).send("Booking ID is required");
    }

    const updatedBookingData = {
      venueName,
      venueLocation,
      timings: {
        startTime: timings.startTime,
        duration: timings.duration,
      },
      date,
      reason,
      organisation,
      poc,
      phoneNumber,
      email,
    };

    const updatedBooking = await updateBooking(bookingId, updatedBookingData);
    logger.info(`Booking updated for ID: ${bookingId}`);
    return res.status(200).json(updatedBooking);
  } catch (error) {
    logger.error(
      `Error updating booking for ID: ${bookingId}, ${error.message}`
    );
    next(error);
  }
};

// Delete Booking
module.exports.deleteBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      logger.warn("Booking ID not provided for deletion");
      return res.status(400).send("Booking ID is required");
    }

    const deletedBooking = await deleteBooking(bookingId);
    logger.info(`Booking deleted for ID: ${bookingId}`);
    return res.status(200).json(deletedBooking);
  } catch (error) {
    logger.error(
      `Error deleting booking for ID: ${bookingId}, ${error.message}`
    );
    next(error);
  }
};

// Get Pending Bookings
module.exports.getPendingBookings = async (req, res, next) => {
  try {
    const pendingBookings = await getPendingBookingsService();
    logger.info("Retrieved pending bookings");
    return res.status(200).json(pendingBookings);
  } catch (error) {
    logger.error(`Error retrieving pending bookings: ${error.message}`);
    next(error);
  }
};

// Accept Booking
module.exports.acceptBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const updatedBooking = await updateBookingStatus(bookingId, "accepted");
    logger.info(`Booking accepted for ID: ${bookingId}`);
    return res.status(200).json(updatedBooking);
  } catch (error) {
    logger.error(
      `Error accepting booking for ID: ${bookingId}, ${error.message}`
    );
    next(error);
  }
};

// Reject Booking
module.exports.rejectBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const updatedBooking = await updateBookingStatus(bookingId, "rejected");
    logger.info(`Booking rejected for ID: ${bookingId}`);
    return res.status(200).json(updatedBooking);
  } catch (error) {
    logger.error(
      `Error rejecting booking for ID: ${bookingId}, ${error.message}`
    );
    next(error);
  }
};

// check booking status
module.exports.checkBookingStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      logger.warn("Booking ID not provided for status check");
      return res.status(400).send("Booking ID is required");
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      logger.warn(`Booking not found for ID: ${bookingId}`);
      return res.status(404).send("Invalid Request: Booking not found");
    }
    return res.status(200).json({ status: booking.status });
  } catch (error) {
    logger.error(
      `Error checking booking status for ID: ${bookingId}, ${error.message}`
    );
    next(error);
  }
};

// submit feedback
module.exports.submitFeedback = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { feedback } = req.body;

    if (!bookingId || !feedback) {
      logger.warn("Booking ID or feedback not provided");
      return res.status(400).send("Booking ID and feedback are required");
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      logger.warn(`Booking not found for ID: ${bookingId}`);
      return res.status(404).send("Booking not found");
    }

    booking.feedback = feedback;
    await booking.save();
    return res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    logger.error(
      `Error submitting feedback for booking ID: ${bookingId}, ${error.message}`
    );
    next(error);
  }
};

// check venue availability
module.exports.checkVenueAvailability = async (req, res, next) => {
  try {
    const { venueId } = req.params;
    const { date, startTime, duration } = req.query;

    if (!venueId || !date || !startTime || !duration) {
      console.log(
        "Venue ID, date, start time, or duration not provided for availability check"
      );
      return res
        .status(400)
        .send("Venue ID, date, start time, and duration are required");
    }

    const requestedStart = moment(startTime, "HH:mm");
    const requestedEnd = moment(startTime, "HH:mm").add(duration, "minutes");

    const bookings = await Booking.find({ venueId, date });

    const isOverlap = bookings.some((booking) => {
      const bookingStart = moment(booking.timings.startTime, "HH:mm");
      const bookingEnd = moment(booking.timings.startTime, "HH:mm").add(
        booking.timings.duration,
        "minutes"
      );

      return (
        requestedStart.isBefore(bookingEnd) &&
        requestedEnd.isAfter(bookingStart)
      );
    });

    if (isOverlap) {
      console.log(`Venue ${venueId} is unavailable at ${startTime} on ${date}`);
      return res.status(200).json({ available: false });
    }

    console.log(`Venue ${venueId} is available at ${startTime} on ${date}`);
    return res.status(200).json({ available: true });
  } catch (error) {
    console.error(
      `Error checking availability for venue ${venueId}: ${error.message}`
    );
    next(error);
  }
};
