const {
  createBooking,
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking,
  getPendingBookingsService,
  updateBookingStatus,
} = require("../services/booking.service");
const logger = require("../logger"); // Import the logger
const { sendAcceptEmail, SendRejectEmail } = require("../services/mail.services")
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
      timings,
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
    logger.info('All bookings retrieved');
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
      timings,
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
    logger.error(`Error updating booking for ID: ${bookingId}, ${error.message}`);
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
    logger.error(`Error deleting booking for ID: ${bookingId}, ${error.message}`);
    next(error);
  }
};

// Get Pending Bookings
module.exports.getPendingBookings = async (req, res, next) => {
  try {
    const pendingBookings = await getPendingBookingsService();
    logger.info('Retrieved pending bookings');
    return res.status(200).json(pendingBookings);
  } catch (error) {
    logger.error(`Error retrieving pending bookings: ${error.message}`);
    next(error);
  }
};

// Accept Booking
module.exports.acceptBooking = async (req, res, next) => {
  try {
    const bookingId = req.query.bookingId
    const venueName = req.query.venueName
    const venueLocation = req.query.venueLocation
    const date = req.query.date
    const timings = req.query.timings
    const recipientEmail = req.query.recipientEmail

    if( !bookingId || !venueName || !venueLocation || !date || !timings || !recipientEmail ){
      logger.warn("One or more parameters is missing while trying to send confirmation mail to admin");
      return res.status(400).json({ msg: "Invalid request body" });
    }

    await sendAcceptEmail(venueName, venueLocation, date, timings, recipientEmail)
    logger.info(`Booking accept Email sent to ${recipientEmail}`)

    const updatedBooking = await updateBookingStatus(bookingId, "accepted");
    logger.info(`Booking accepted for ID: ${bookingId}`);
    return res.status(200).json(updatedBooking);
  } catch (error) {
    logger.error(`Error accepting booking for ID: ${bookingId}, ${error.message}`);
    next(error);
  }
};

// Reject Booking
module.exports.rejectBooking = async (req, res, next) => {
  try {
    const bookingId = req.query.bookingId
    const venueName = req.query.venueName
    const venueLocation = req.query.venueLocation
    const date = req.query.date
    const timings = req.query.timings
    const recipientEmail = req.query.recipientEmail

    if( !bookingId || !venueName || !venueLocation || !date || !timings || !recipientEmail ){
      logger.warn("One or more parameters is missing while trying to send confirmation mail to admin");
      return res.status(400).json({ msg: "Invalid request body" });
    }

    await sendRejectEmail(venueName, venueLocation, date, timings, recipientEmail)
    logger.info(`Booking reject Email sent to ${recipientEmail}`)

    const updatedBooking = await updateBookingStatus(bookingId, "rejected");
    logger.info(`Booking rejected for ID: ${bookingId}`);
    return res.status(200).json(updatedBooking);
  } catch (error) {
    logger.error(`Error rejecting booking for ID: ${bookingId}, ${error.message}`);
    next(error);
  }
};
