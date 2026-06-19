// backend/scripts/testEmail.js
require('dotenv').config({ path: __dirname + '/../.env' });
const sendEmail = require('../utils/sendEmail');

async function runTest() {
  const recipient = process.argv[2];

  if (!recipient) {
    console.error('Error: Please provide a recipient email address.');
    console.log('Usage: node scripts/testEmail.js <your_email@example.com>');
    process.exit(1);
  }

  try {
    console.log(`Sending test email to: ${recipient}...`);
    
    await sendEmail({
      email: recipient,
      subject: 'Dbuian Fashion Email Test',
      message: `
        <div style="font-family: sans-serif; padding: 20px; text-align: center;">
          <h2>Email Configuration Successful!</h2>
          <p>If you are seeing this, your email SMTP configuration is working correctly.</p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send email.');
    console.error('Error message:', error.message);
    process.exit(1);
  }
}

runTest();
