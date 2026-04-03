const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Startup Verification
 */
const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.warn('\x1b[33m%s\x1b[0m', `⚠️  Email Warning — ${error.message}`);
    return false;
  }
};

const sendStartupTest = async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `[KKJ] Backend Startup Test — ${new Date().toLocaleTimeString()}`,
      text: 'KhudKoJano backend has started successfully.'
    });
    console.log('Startup test email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email Startup Test Failed:', error.message);
    return false;
  }
};

/**
 * 1. User Confirmation Email
 */
const sendUserConfirmationEmail = async (order) => {
  const { name, email, plan, specificQuestion, orderId } = order;
  const firstName = name.split(' ')[0];

  const htmlBody = `
    <div style="background-color: #07071a; color: #e8e8f0; font-family: sans-serif; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #c9a84c; background-color: #0c0c2a; padding: 30px;">
        <h2 style="color: #c9a84c; text-align: center;">ॐ KHUD KO JAANO</h2>
        <p>Dear ${firstName},</p>
        <p>We have received your birth details and our astrologers have started reading your chart.</p>
        <p><strong>Your Question:</strong> "${specificQuestion}"</p>
        <p>You will receive your complete report <strong>${plan === 'fasttrack' ? 'within 2 hours' : 'within 24 hours'}</strong>.</p>
        <p style="text-align: center; color: #c9a84c;">Order ID: ${orderId}</p>
        <p>With cosmic blessings,<br>The Khud Ko Jaano Team</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Your Stars Are Being Read, ${firstName} ✨`,
    html: htmlBody
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

/**
 * 2. Admin Report Email (RESTORING ATTACHMENT)
 */
const sendAdminReportEmail = async (order) => {
  const { orderId, name, email, phone, plan, createdAt, specificQuestion } = order;
  const pdfPath = order.report?.pdfPath;

  const pdfExists = pdfPath && fs.existsSync(pdfPath);
  
  if (!pdfExists) {
    console.error("❌ PDF NOT FOUND FOR ADMIN EMAIL:", pdfPath);
    // Don't throw, let it send a notification without file
  }

  const textBody = `
New Cosmic Blueprint is ready for delivery.

━━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━
Order ID:   [${orderId}]
Name:       [${name}]
Email:      [${email}]
Phone:      [${phone}]
Plan:       [${plan}] 
Submitted:  [${createdAt}]

Question:
"${specificQuestion}"

━━━━━━━━━━━━━━━━━━━━━━━━
REQUIRED ACTION
━━━━━━━━━━━━━━━━━━━━━━━━
The PDF report is attached to this email.

Please:
1. Open the attached PDF to verify
2. Send it personally to: ${email}
3. Mark the order as 'SENT' in the admin panel
`;

  const attachments = [];
  if (pdfExists) {
    attachments.push({
      filename: `KhudKoJaano-${orderId}.pdf`,
      path: pdfPath,
      contentType: 'application/pdf'
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `[KKJ] New Report Ready — ${orderId} | ${name}`,
    text: textBody,
    attachments: attachments
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('✅ Admin Notification Sent (with attachment):', info.messageId);
  return info;
};

module.exports = {
  transporter,
  verifyEmailConnection,
  sendStartupTest,
  sendUserConfirmationEmail,
  sendAdminReportEmail
};
