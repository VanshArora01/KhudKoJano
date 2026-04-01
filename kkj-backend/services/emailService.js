const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,          // MUST be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false  // prevents TLS errors on Render/Railway
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

  console.log(`[Email] Preparing confirmation for: ${email}`);

  const htmlBody = `
    <div style="background-color: #07071a; color: #e8e8f0; font-family: 'Lato', Arial, sans-serif; padding: 40px; margin: 0; min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #c9a84c; background-color: #0c0c2a;">
        <!-- Gold Header Bar -->
        <div style="background-color: #c9a84c; color: #07071a; padding: 15px; text-align: center; font-family: 'Cinzel', serif; font-weight: bold; letter-spacing: 2px;">
          ॐ KHUD KO JAANO
        </div>

        <div style="padding: 40px;">
          <p style="font-size: 18px; margin-bottom: 25px;">Dear ${firstName},</p>

          <p style="line-height: 1.6; margin-bottom: 20px;">
            We have received your birth details and our astrologers
            have begun the sacred process of reading your cosmic chart.
          </p>

          <p style="margin-bottom: 10px; font-weight: bold; color: #c9a84c;">Your question to the stars:</p>
          <div style="border-left: 3px solid #c9a84c; padding-left: 15px; font-style: italic; color: #f0d080; margin-bottom: 25px; line-height: 1.6;">
            "${specificQuestion}"
          </div>

          <p style="line-height: 1.6; margin-bottom: 20px;">
            We are carefully analysing the position of the planets
            at the exact moment of your birth. Your personalised
            Cosmic Blueprint is being prepared with full attention
            and devotion.
          </p>

          <p style="line-height: 1.6; margin-bottom: 25px;">
            You will receive your complete report <strong>${plan === 'fasttrack' ? 'within 2 hours' : 'within 24 hours'}</strong>.
          </p>

          <div style="background: rgba(201, 168, 76, 0.1); border: 1px solid rgba(201, 168, 76, 0.3); padding: 15px; text-align: center; border-radius: 4px; margin-bottom: 30px;">
            <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #c9a84c;">Your Order ID</p>
            <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; font-family: 'Cinzel', serif; color: #c9a84c;">${orderId}</p>
          </div>

          <p style="line-height: 1.6; margin-bottom: 30px;">
            Please keep an eye on this inbox — your blueprint
            will be delivered here once it is ready.
          </p>

          <p style="margin-bottom: 5px;">With cosmic blessings,</p>
          <p style="font-weight: bold; color: #c9a84c;">The Khud Ko Jaano Team</p>
        </div>

        <!-- Footer -->
        <div style="padding: 20px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid rgba(201, 168, 76, 0.1);">
          ॐ Khud Ko Jaano  •  khudkojano@gmail.com
        </div>
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
  console.log('Confirmation messageId:', info.messageId);
  console.log('Confirmation response:', info.response);
  return info;
};

/**
 * 2. Admin Report Email
 */
const sendAdminReportEmail = async (order) => {
  const { orderId, name, email, phone, plan, createdAt, specificQuestion } = order;
  const pdfPath = order.report?.pdfPath;

  console.log(`[Email] Preparing Admin alert for: ${orderId}`);

  const pdfExists = pdfPath && fs.existsSync(pdfPath);
  console.log(`PDF exists: ${pdfExists}, path: ${pdfPath}`);

  const attachments = [];
  if (pdfExists) {
    attachments.push({
      filename: `KhudKoJaano-${orderId}-CosmicBlueprint.pdf`,
      path: pdfPath
    });
  }

  const textBody = `
New Cosmic Blueprint is ready to send.

━━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━
Order ID:   [${orderId}]
Name:       [${name}]
Email:      [${email}]
Phone:      [${phone}]
Plan:       [${plan}] 
Submitted:  [${createdAt}]

Their Question:
"${specificQuestion}"

━━━━━━━━━━━━━━━━━━━━━━━━
ACTION REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━
The PDF report is attached to this email.
${pdfExists ? '' : '⚠️ PDF generation failed — check server logs'}

Please:
1. Download the attached PDF
2. Email it personally to: ${email}
3. Use a warm human tone — do NOT forward 
   this email directly
4. Mark the order as sent in the admin panel

Reminder: The user is expecting their report 
within ${plan === 'fasttrack' ? '2 hours' : '24 hours'}. Please send promptly.
`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `[KKJ] New Report Ready — ${orderId} | ${plan} | ${name}`,
    text: textBody,
    attachments
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Admin messageId:', info.messageId);
  console.log('Admin response:', info.response);
  return info;
};

module.exports = {
  transporter, // Exporting for debug route
  verifyEmailConnection,
  sendStartupTest,
  sendUserConfirmationEmail,
  sendAdminReportEmail
};
