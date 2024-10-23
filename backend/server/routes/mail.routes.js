const express = require('express');
const dotenv = require('dotenv');

// Loading env variables
dotenv.config();

const { sendSampleMail, sendConfirmationEmailToAdmin } = require('../controllers/mail.controllers')

const mailRouter = express.Router();

// Sample Route to send an email
mailRouter.get('/sample/:email', sendSampleMail);

// Confirmation Mail which has to be sent to admin
mailRouter.post( '/confirmation', sendConfirmationEmailToAdmin )

module.exports = mailRouter