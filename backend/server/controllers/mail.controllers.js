const nodemailer = require('nodemailer');
const logger = require('../logger'); // Import the logger

// Transporter to send mails via nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Set in .env 
        pass: process.env.PASSWORD, // Set an application password for 'nodemailer' in gmail and put that string in .env
    },
});

module.exports.sendSampleMail = async (req, res, next) => {
    try {
        const recipientEmail = req.params.email;

        // Ensure the email param is present
        if (!recipientEmail) {
            logger.warn("Email parameter is missing");
            return res.status(400).json({ msg: "Email is required" });
        }

        transporter.sendMail({
            from: 'noreply@yourdomain.com', // Sample mail
            to: recipientEmail, // Pass in as params
            cc: '', // Some CC if needed
            subject: 'Greetings from nodemailer',
            html: `
                <h1> Hi there, this mail was sent by nodemailer </h1>
            `
        }, (err, info) => {
            if (err) {
                logger.error(`Error sending email to ${recipientEmail}: ${err.message}`);
                return res.status(500).json({ msg: 'Error sending mail' });
            } else {
                logger.info(`Email successfully sent to ${recipientEmail}`);
                res.json({
                    msg: 'Mail sent successfully',
                    info: info.response,
                });
            }
        });
    } catch (error) {
        logger.error(`Unexpected error while sending email: ${error.message}`);
        next(error);
    }
};
