const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === 'true',

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

exports.sendEmail = async ({ to, subject, html }) => {
  return await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
};