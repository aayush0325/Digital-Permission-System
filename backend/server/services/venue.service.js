const Venue = require("../model/venueSchema.js");
const logger = require('../logger'); // Import Winston logger

// Create a new venue
module.exports.createVenueService = async (venueData) => {
  try {
    const { venueName, venueLocation, seatingCapacity, acAvailable, projectorAvailable } = venueData;

    // Checking if venue already exists
    const existingVenue = await Venue.findOne({ venueName });

    if (existingVenue) {
      logger.warn(`Venue creation failed. Venue already exists: ${venueName}`);
      throw new Error("Venue already exists");
    }

    const newVenue = await Venue.create({
      venueName,
      venueLocation,
      seatingCapacity,
      acAvailable,
      projectorAvailable,
    });

    // Checking if the venue has been successfully created
    const createdVenue = await Venue.findById(newVenue._id);

    if (!createdVenue) {
      logger.error(`Error creating venue: ${venueName}`);
      throw new Error("Something went wrong while creating venue");
    }

    logger.info(`New venue created successfully: ${venueName}`);
    return newVenue;
  } catch (error) {
    logger.error(`Error creating venue: ${error.message}`);
    throw new Error("Error creating venue: " + error.message);
  }
};

// Get a venue by its ID
module.exports.getVenueByIdService = async (venueId) => {
  try {
    const venue = await Venue.findById(venueId);
    if (!venue) {
      logger.warn(`Venue not found with ID: ${venueId}`);
      throw new Error("Venue not found");
    }
    logger.info(`Venue retrieved successfully: ${venueId}`);
    return venue;
  } catch (error) {
    logger.error(`Error retrieving venue with ID: ${venueId} - ${error.message}`);
    throw new Error("Error retrieving venue: " + error.message);
  }
};

// Get all venues
module.exports.getAllVenuesService = async () => {
  try {
    const venues = await Venue.find({});
    logger.info(`Retrieved all venues - count: ${venues.length}`);
    return venues;
  } catch (error) {
    logger.error(`Error retrieving venues: ${error.message}`);
    throw new Error("Error retrieving venues: " + error.message);
  }
};

// Update a venue
module.exports.updateVenueService = async (venueId, updatedData) => {
  try {
    const updatedVenue = await Venue.findByIdAndUpdate(venueId, updatedData, { new: true });
    if (!updatedVenue) {
      logger.warn(`Venue not found for update with ID: ${venueId}`);
      throw new Error("Venue not found for update");
    }
    logger.info(`Venue updated successfully: ${venueId}`);
    return updatedVenue;
  } catch (error) {
    logger.error(`Error updating venue with ID: ${venueId} - ${error.message}`);
    throw new Error("Error updating venue: " + error.message);
  }
};

// Delete a venue by its ID
module.exports.deleteVenueService = async (venueId) => {
  try {
    const deletedVenue = await Venue.findByIdAndDelete(venueId);
    if (!deletedVenue) {
      logger.warn(`Venue not found for deletion with ID: ${venueId}`);
      throw new Error("Venue not found for deletion");
    }
    logger.info(`Venue deleted successfully: ${venueId}`);
    return deletedVenue;
  } catch (error) {
    logger.error(`Error deleting venue with ID: ${venueId} - ${error.message}`);
    throw new Error("Error deleting venue: " + error.message);
  }
};
