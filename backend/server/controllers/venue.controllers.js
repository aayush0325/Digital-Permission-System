const {
  getVenueByIdService,
  getAllVenuesService,
  createVenueService,
  updateVenueService,
  deleteVenueService,
} = require("../services/venue.service");
const logger = require('../logger'); // Import Winston logger

module.exports.getAllVenues = async (req, res, next) => {
  try {
    const venues = await getAllVenuesService();
    logger.info('Fetched all venues successfully');
    return res.status(200).json(venues);
  } catch (error) {
    logger.error(`Error fetching venues: ${error.message}`);
    next(error);
  }
};

module.exports.createVenue = async (req, res, next) => {
  try {
    const { venueName, venueLocation, seatingCapacity, acAvailable, projectorAvailable } = req.body;

    // Validate required fields
    if (
      !venueName ||
      !venueLocation ||
      !seatingCapacity ||
      !acAvailable ||
      !projectorAvailable
    ) {
      logger.warn('Missing required venue fields');
      return res.status(400).send("All fields are required");
    }

    const venueData = {
      venueName,
      venueLocation,
      seatingCapacity,
      acAvailable,
      projectorAvailable
    };

    const newVenue = await createVenueService(venueData);
    logger.info(`Created new venue: ${venueName}`);
    return res.status(201).json(newVenue);
  } catch (error) {
    logger.error(`Error creating venue: ${error.message}`);
    next(error);
  }
};

module.exports.updateVenue = async (req, res, next) => {
  try {
    const { venueId } = req.params;
    const venueData = req.body;

    if (!venueId) {
      logger.warn('Venue ID not provided for update');
      return res.status(400).send("Venue ID is required");
    }

    const updatedVenue = await updateVenueService(venueId, venueData);
    logger.info(`Updated venue with ID: ${venueId}`);
    return res.status(200).json(updatedVenue);
  } catch (error) {
    logger.error(`Error updating venue: ${error.message}`);
    next(error);
  }
};

module.exports.deleteVenue = async (req, res, next) => {
  try {
    const { venueId } = req.params;

    if (!venueId) {
      logger.warn('Venue ID not provided for deletion');
      return res.status(400).send("Venue ID is required");
    }

    const deletedVenue = await deleteVenueService(venueId);
    logger.info(`Deleted venue with ID: ${venueId}`);
    return res.status(200).json(deletedVenue);
  } catch (error) {
    logger.error(`Error deleting venue: ${error.message}`);
    next(error);
  }
};

module.exports.getVenueById = async (req, res, next) => {
  try {
    const { venueId } = req.params;

    if (!venueId) {
      logger.warn('Venue ID not provided for fetching');
      return res.status(400).send("Venue ID is required");
    }

    const venue = await getVenueByIdService(venueId);
    if (!venue) {
      logger.warn(`Venue with ID ${venueId} not found`);
      return res.status(404).send("Venue not found");
    }

    logger.info(`Fetched venue with ID: ${venueId}`);
    return res.status(200).json(venue);
  } catch (error) {
    logger.error(`Error fetching venue by ID: ${error.message}`);
    next(error);
  }
};
