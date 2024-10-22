const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./model/userSchema");
const routes = require("./routes/index");
const logger = require('./logger');

// Loading the env variables
dotenv.config();

const app = express();
const PORT = 5000;
const frontendUrl = process.env.FRONTEND_URL;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Middleware
app.use(
  cors({
    origin: { frontendUrl },
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Mounting of Router
app.use("/api", routes);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userdb.findOne({ googleId: profile.id });

        if (!user) {
          user = await userdb.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.email,
            image: profile.picture,
          });
          await user.save();
          logger.info(`New user created: ${user.email}`);
        } else {
          logger.info(`User logged in: ${user.email}`);
        }
        return done(null, user);
      } catch (error) {
        logger.error(`Error during authentication: ${error.message}`);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userdb.findById(id);
    done(null, user);
  } catch (error) {
    logger.error(`Error deserializing user: ${error.message}`);
    done(error, null);
  }
});

// Basic route
app.get("/", (req, res) => {
  logger.info('Root route accessed');
  res.send("Hello from Express backend");
});

// Authentication Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `${frontendUrl}/home`,
    failureRedirect: `${frontendUrl}/login`,
  })
);

// Login Success Route
app.get("/login/success", async (req, res) => {
  if (req.user) {
    logger.info(`Login successful for user: ${req.user.email}`);
    res.status(200).json({ message: "user Login", user: req.user });
  } else {
    logger.warn('Unauthorized access to login success route');
    res.status(400).json({ message: "Not Authorized" });
  }
});

// Logout Route
app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      logger.error(`Logout error: ${err.message}`);
      return next(err);
    }
    logger.info(`User logged out`);
    res.redirect(`${frontendUrl}`);
  });
});

// MongoDB connection (add your MongoDB URL)
mongoose.connect(process.env.MONGOURL)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
  });

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
