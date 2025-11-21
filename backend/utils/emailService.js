const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `Virtual Medical Home <${config.email.user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }
};

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `${config.frontendUrl}/verify-email/${verificationToken}`;
  
  const html = `
    <h1>Email Verification</h1>
    <p>Thank you for registering with Virtual Medical Home.</p>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
    <p>This link will expire in 24 hours.</p>
  `;

  await sendEmail({
    to: email,
    subject: 'Verify Your Email - Virtual Medical Home',
    html,
  });
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${config.frontendUrl}/reset-password/${resetToken}`;
  
  const html = `
    <h1>Password Reset Request</h1>
    <p>You requested to reset your password.</p>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset - Virtual Medical Home',
    html,
  });
};

const sendAppointmentConfirmation = async (email, appointmentDetails) => {
  const html = `
    <h1>Appointment Confirmation</h1>
    <p>Your appointment has been confirmed.</p>
    <h3>Details:</h3>
    <ul>
      <li>Doctor: Dr. ${appointmentDetails.doctorName}</li>
      <li>Date: ${appointmentDetails.date}</li>
      <li>Time: ${appointmentDetails.time}</li>
      <li>Type: ${appointmentDetails.type}</li>
    </ul>
    <p>Please be available at the scheduled time.</p>
  `;

  await sendEmail({
    to: email,
    subject: 'Appointment Confirmation - Virtual Medical Home',
    html,
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendAppointmentConfirmation,
};
