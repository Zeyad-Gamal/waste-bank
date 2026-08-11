require('dotenv').config();

const emailService = require('./src/services/email.service');

const testEmail = async () => {
  try {
    const result = await emailService.sendEmail({
      to: 'zeyadgamal00000@gmail.com',
      subject: 'Waste Bank Email Test',
      html: `
        <h1>Email System Test</h1>
        <p>If you received this email, the Waste Bank email system is working successfully.</p>
      `,
    });

    console.log('Email sent successfully:', result.messageId);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

testEmail();