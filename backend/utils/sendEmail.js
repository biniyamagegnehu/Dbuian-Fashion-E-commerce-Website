// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: process.env.SENDGRID_USERNAME,
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email could not be sent:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.log('--- DEVELOPMENT MODE: EMAIL MOCKED ---');
      console.log(`To: ${options.email}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`HTML Message:\n${options.message}`);
      console.log('----------------------------------------');
      // Resolve successfully so the flow continues in dev mode
      return;
    }
    throw error;
  }
};

module.exports = sendEmail;