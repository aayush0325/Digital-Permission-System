const nodemailer = require('nodemailer');
const logger = require('../logger'); // Import the logger
const { sendConfirmationEmail } = require('../services/mail.services')

// Transporter to send mails via nodemailer
export const transporter = nodemailer.createTransport({
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

module.exports.sendConfirmationEmailToAdmin = async (req, res, next) => {
    try{
        const { venueName, venueLocation, date, timings, reason, organisation, poc, senderMail, recipientEmail, subject, bookingId } = req.body;

        if (
            !venueName || !venueLocation || !date || !timings || !reason || !organisation || !poc || !senderMail || !recipientEmail || !subject || !bookingId
        ){
            logger.warn("One or more parameters is missing while trying to send confirmation mail to admin");
            return res.status(400).json({ msg: "Invalid request body" });
        }

        await sendConfirmationEmail( venueName, venueLocation, date, timings, reason, organisation, poc, senderMail, recipientEmail, subject, yesLink, noLink );

        logger.info(`Confirmation mail from ${senderMail} sent to ${recipientEmail} for ${organisation}`);

        return res.json({
            msg:"Email sent"
        })
    }catch(error){
        logger.error(`Unexpected error while sending email: ${error.message}`);
        next(error);
    }
}