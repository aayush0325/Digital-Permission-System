import { transporter } from "../controllers/mail.controllers";
import logger from "../logger";

module.exports.sendConfirmationEmail = async (
    venueName, venueLocation, date, timings, reason, organisation, poc, senderMail, recipientEmail, subject, bookingId
) => {
    transporter.sendMail({
        from: senderMail || 'noreply@yourdomain.com',
        to: recipientEmail || poc.email,
        cc: '', // Some CC if needed
        subject: subject || `Confirmation of booking at ${venueName}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Booking Confirmation</h2>
                <p>Hello,</p>
                <p>This is to confirm that <strong>${organisation}</strong> has requested to book <strong>${venueName}</strong> located at <strong>${venueLocation}</strong> on <strong>${date}</strong> from <strong>${timings}</strong> for the following reason:</p>
                <p><em>${reason}</em></p>
                <h4>Point of Contact</h4>
                <p>Name: <strong>${poc.name}</strong></p>
                <p>Email: <strong>${poc.email}</strong></p>
                <p>Phone: <strong>${poc.phone}</strong></p>
                
                <div style="margin-top: 20px;">
                    <p>Please confirm the booking by clicking one of the options below:</p>
                    <a href="http://localhost:5000/api/bookings/admin/accept/${encodeURIComponent(bookingId)}" style="display: inline-block; padding: 10px 15px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin-right: 10px;">Yes</a>
                    <a href="http://localhost:5000/api/bookings/admin/reject/${encodeURIComponent(bookingId)}" style="display: inline-block; padding: 10px 15px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">No</a>
                </div>
            </div>
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
}
