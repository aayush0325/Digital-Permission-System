const Booking = require("../model/bookingSchema"); // import Booking model
const logger = require('../logger'); // Import Winston logger

// Create a new booking
module.exports.createBookingService = async (bookingData) => {
  try {
    const { email, phoneNumber } = bookingData;

    // Check if the email ends with "@itbhu.ac.in"
    if (!email.endsWith("@itbhu.ac.in")) {
      logger.warn(`Invalid email: ${email} - not an institute email`);
      throw new Error("Please use your institute email ID");
    }

    // Validate phone number (example: must be 10 digits and numeric)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      logger.warn(`Invalid phone number: ${phoneNumber}`);
      throw new Error("Please provide a valid 10-digit phone number");
    }

    const newBooking = new Booking(bookingData);
    await newBooking.save();
    logger.info(`New booking created with ID: ${newBooking._id}`);
    return newBooking;
  } catch (error) {
    logger.error(`Error creating booking: ${error.message}`);
    throw new Error("Error creating booking: " + error.message);
  }
};

// Get a booking by its ID
module.exports.getBookingById = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      logger.warn(`Booking not found with ID: ${bookingId}`);
    } else {
      logger.info(`Booking retrieved with ID: ${bookingId}`);
    }
    return booking;
  } catch (error) {
    logger.error(`Error retrieving booking with ID: ${bookingId} - ${error.message}`);
    throw new Error("Error retrieving booking: " + error.message);
  }
};

// Get all bookings
module.exports.getAllBookings = async () => {
  try {
    const bookings = await Booking.find({});
    logger.info(`Retrieved all bookings - count: ${bookings.length}`);
    return bookings;
  } catch (error) {
    logger.error(`Error retrieving bookings: ${error.message}`);
    throw new Error("Error retrieving bookings: " + error.message);
  }
};

// Update a booking by its ID
module.exports.updateBooking = async (bookingId, updatedData) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updatedData,
      { new: true }
    );
    if (!updatedBooking) {
      logger.warn(`Booking not found for update with ID: ${bookingId}`);
    } else {
      logger.info(`Booking updated with ID: ${bookingId}`);
    }
    return updatedBooking;
  } catch (error) {
    logger.error(`Error updating booking with ID: ${bookingId} - ${error.message}`);
    throw new Error("Error updating booking: " + error.message);
  }
};

// Delete a booking by its ID
module.exports.deleteBooking = async (bookingId) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    if (!deletedBooking) {
      logger.warn(`Booking not found for deletion with ID: ${bookingId}`);
    } else {
      logger.info(`Booking deleted with ID: ${bookingId}`);
    }
    return deletedBooking;
  } catch (error) {
    logger.error(`Error deleting booking with ID: ${bookingId} - ${error.message}`);
    throw new Error("Error deleting booking: " + error.message);
  }
};

// Get pending bookings
module.exports.getPendingBookingsService = async () => {
  try {
    const pendingBookings = await Booking.find({ status: "pending" });
    logger.info(`Retrieved pending bookings - count: ${pendingBookings.length}`);
    return pendingBookings;
  } catch (error) {
    logger.error(`Error retrieving pending bookings: ${error.message}`);
    throw new Error("Error retrieving pending bookings: " + error.message);
  }
};

// Update booking status
module.exports.updateBookingStatus = async (bookingId, status) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
    if (!updatedBooking) {
      logger.warn(`Booking not found for status update with ID: ${bookingId}`);
    } else {
      logger.info(`Booking status updated to ${status} for ID: ${bookingId}`);
    }
    return updatedBooking;
  } catch (error) {
    logger.error(`Error updating booking status for ID: ${bookingId} - ${error.message}`);
    throw new Error("Error updating booking status: " + error.message);
  }
};
