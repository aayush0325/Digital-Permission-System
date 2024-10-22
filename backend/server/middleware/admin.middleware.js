const logger = require('../logger'); // Import Winston logger

const adminEmails = [
  "doaa@iitbhu.ac.in",
  "dosa@iitbhu.ac.in",
  "registrar@iitbhu.ac.in",
];

const adminCheckMiddleware = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    logger.warn('Unauthorized access attempt - user is not authenticated');
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (adminEmails.includes(req.user.email)) {
    logger.info(`Admin access granted to ${req.user.email}`);
    next();
  } else {
    logger.warn(`Unauthorized access attempt by ${req.user.email}`);
    res.status(403).json({ message: "Unauthorized" });
  }
};

module.exports = adminCheckMiddleware;
