import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

// Function to send an email to the donor about the blood request
export const sendBloodRequestToDonor = async (donor, bloodType, quantity, name) => {
  try {
    if (!donor.userId || !donor.userId.email) {
      throw new Error("Donor email is missing.");
    }
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: donor.userId.email, // Assuming donor has a reference to the user with an email field
      subject: "Blood Donation Request for Your Blood Type",
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif;">
          <p style="font-size: 1.1em;">Hello ${donor.userId.name},</p>
          <p style="font-size: 1.1em;">We have received a request for blood donation for your blood type <b>${donor.bloodType}</b> from <b>${name}</b>.</p>
          <p style="font-size: 1.1em;">Here are the details of the request:</p>
          <ul>
            <li><strong>Blood Type:</strong> ${bloodType}</li>
            <li><strong>Quantity:</strong> ${quantity} units</li>
          </ul>
          <p style="font-size: 1.1em;">If you're able to donate, please contact the hospital directly.</p>
          <p style="font-size: 0.9em;">Best Regards,<br />Team CITY HOSPITAL</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending blood request email to donor:", error.message);
    throw error;
  }
};

// Function to send an email to the hospital confirming the donor's appointment
export const bookAppointment = async (hospital, donor) => {
  try {
    if (!hospital.email) {
      throw new Error("Hospital email is missing.");
    }

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: hospital.email,
      subject: "New Blood Donation Appointment",
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif;">
          <p style="font-size: 1.1em;">Hello ${hospital.name},</p>
          <p style="font-size: 1.1em;">A donor has successfully booked an appointment with your hospital. Below are the details of the appointment:</p>
          <ul>
            <li><strong>Donor Name:</strong> ${donor.name}</li>
            <li><strong>Donor Email:</strong> ${donor.email}</li>
            <li><strong>Donor Contact:</strong> ${donor.contact}</li>
            <li><strong>Donor City:</strong> ${donor.city}</li>
            <li><strong>Blood Type:</strong> ${donor.bloodType}</li>
            <li><strong>Appointment Date:</strong> ${donor.appointmentDate}</li> <!-- Assuming an appointment date is available -->
          </ul>
          <p style="font-size: 1.1em;">Please prepare for the donor's visit. If you have any questions, feel free to contact the donor directly.</p>
          <p style="font-size: 0.9em;">Best Regards,<br />Your Blood Donation Management System</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending appointment email to hospital:", error.message);
    throw error;
  }
};

export default { sendBloodRequestToDonor, bookAppointment };
