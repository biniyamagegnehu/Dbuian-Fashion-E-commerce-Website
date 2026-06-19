// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const service = process.env.EMAIL_SERVICE?.toLowerCase();
  let transporter;

  // Configuration check and transporter setup
  if (service === 'gmail' || (!service && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Gmail configuration is missing. Please set GMAIL_USER and GMAIL_APP_PASSWORD.');
    }
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  } else if (service === 'sendgrid' || process.env.SENDGRID_API_KEY) {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid configuration is missing. Please set SENDGRID_API_KEY.');
    }
    transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDGRID_USERNAME || 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else {
    throw new Error('No email service configured. Please set EMAIL_SERVICE to gmail or sendgrid.');
  }

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.FROM_EMAIL || process.env.GMAIL_USER,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email could not be sent:', error.message);
    if (process.env.MOCK_EMAILS === 'true') {
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
