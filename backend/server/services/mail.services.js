import { transporter } from "../controllers/mail.controllers";
import logger from "../logger";

// Mail to send to admin for approval
module.exports.sendConfirmationEmail = async (
    venueName, venueLocation, date, timings, reason, organisation, poc, recipientEmail, bookingId
) => {
    transporter.sendMail({
        from: 'noreply@yourdomain.com',
        to: recipientEmail,
        cc: '', // Some CC if needed
        subject: `Request for booking at ${venueName}`,
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
                    <a href="http://localhost:5000/api/bookings/admin/accept?bookingId=${encodeURIComponent(bookingId)}&venueName=${encodeURIComponent(venueName)}&venueLocation=${encodeURIComponent(venueLocation)}&date=${encodeURIComponent(date)}&timing=${encodeURIComponent(timings)}&recipientEmail=${encodeURIComponent(poc.email)}" style="display: inline-block; padding: 10px 15px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin-right: 10px;">Yes</a>
                    <a href="http://localhost:5000/api/bookings/admin/reject?bookingId=${encodeURIComponent(bookingId)}&venueName=${encodeURIComponent(venueName)}&venueLocation=${encodeURIComponent(venueLocation)}&date=${encodeURIComponent(date)}&timing=${encodeURIComponent(timings)}&recipientEmail=${encodeURIComponent(poc.email)}" style="display: inline-block; padding: 10px 15px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">No</a>
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

// Mail to send to poc if accepted
module.exports.sendAcceptEmail = async (
    venueName, venueLocation, date, timings, recipientEmail
) => {
    transporter.sendMail({
        from: 'noreply@yourdomain.com',
        to: recipientEmail,
        cc: '', // Some CC if needed
        subject: `Your Booking at ${venueName} on ${date} has been accepted`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Booking Accepted</h2>
                <p>Hello,</p>
                <p>We are pleased to inform you that your booking for <strong>${venueName}</strong> at <strong>${venueLocation}</strong> on <strong>${date}</strong> from <strong>${timings}</strong> has been <strong>accepted</strong>.</p>
                <p>You can now proceed with the necessary arrangements for the event.</p>
                <p>If you have any questions, feel free to contact us.</p>
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
};

// Mail to send to poc if rejected
module.exports.sendRejectEmail = async (
    venueName, venueLocation, date, timings, recipientEmail
) => {
    transporter.sendMail({
        from: 'noreply@yourdomain.com',
        to: recipientEmail,
        cc: '', // Some CC if needed
        subject: `Your Booking at ${venueName} on ${date} has been rejected`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Booking Rejected</h2>
                <p>Hello,</p>
                <p>We regret to inform you that your booking for <strong>${venueName}</strong> at <strong>${venueLocation}</strong> on <strong>${date}</strong> from <strong>${timings}</strong> has been <strong>rejected</strong>.</p>
                <p>If you have any questions or would like to inquire further, feel free to contact us.</p>
                <p>We apologize for any inconvenience caused.</p>
                <p>Best regards,</p>
                <p>The Venue Management Team</p>
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
};
