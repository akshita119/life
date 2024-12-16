const Hospital = require('../models/Hospital.model');
const Donor = require('../models/Donor.model');
const sendMail = require('../utils/sendMail');

// Controller to handle appointment booking
exports.bookAppointment = async (req, res) => {
  try {
    const { donorId, hospitalId, appointmentDate, timeSlot } = req.body;

    // Fetch donor details
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    // Fetch hospital details
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    // You can optionally store the appointment in the database here (e.g., Appointment model)

    // Email Content
    const subject = `New Appointment from ${donor.name}`;
    const text = `
      Dear ${hospital.name},
      
      Donor ${donor.name} has booked an appointment with your hospital.
      
      Appointment Date: ${appointmentDate}
      Time Slot: ${timeSlot}
      
      Contact Details:
      - Email: ${donor.email}
      - Contact: ${donor.contact}
      
      Best regards,
      Blood Donation Management Team
    `;

    // Send the email to the hospital
    await sendMail(hospital.email, subject, text);

    // Return a success response
    res.status(200).json({ message: 'Appointment booked and email sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to book appointment or send email.' });
  }
};
