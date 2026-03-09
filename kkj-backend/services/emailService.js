const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: parseInt(process.env.EMAIL_PORT) === 465, // Use SSL for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000
});

/**
 * 0. Startup Verification
 */
const verifyEmailConnection = async () => {
  try {
    // We use a shorter timeout for startup verification
    const promise = transporter.verify();
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Email verification timed out')), 4000));
    await Promise.race([promise, timeout]);
    return true;
  } catch (error) {
    console.warn('\x1b[33m%s\x1b[0m', `⚠️  Email Warning — ${error.message}`);
    console.warn('The server will continue to boot, but email delivery may be affected.');
    return false;
  }
};

const sendStartupTest = async () => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `[KKJ] Backend Startup Test — ${new Date().toLocaleTimeString()}`,
      text: 'KhudKoJano backend has started successfully.'
    });
    return true;
  } catch (error) {
    console.error('Email Startup Test Failed:', error.message);
    return false;
  }
};

/**
 * 1. User Confirmation Email
 * Sent immediately after order received.
 */
const sendUserConfirmationEmail = async (userData, orderId) => {
  const { name, email, plan } = userData;
  const deliveryTime = plan === 'fasttrack' ? 'within 2 hours' : 'within 24 hours';

  // Brevo/SMTP often needs the 'from' to be the verified account address
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  const htmlContent = `
    <div style="background-color: #07071a; color: #e8e8f0; font-family: 'Cinzel', serif; padding: 40px; text-align: center; border: 1px solid #c9a84c;">
      <h1 style="color: #c9a84c;">ॐ</h1>
      <h2 style="color: #c9a84c; letter-spacing: 2px;">Data Received — Processing Your Chart</h2>
      <p style="font-size: 16px; font-weight: 300; line-height: 1.6; margin-top: 30px;">
        Greetings ${name},<br><br>
        Your bio-data and birth details have been successfully received and are currently under processing. 
        Our astrologers have begun the celestial mapping for your personalized Cosmic Blueprint.
      </p>
      <div style="background: rgba(201, 168, 76, 0.1); border: 1px solid #c9a84c; border-radius: 8px; margin: 30px auto; padding: 20px; max-width: 500px;">
        <p style="font-size: 14px; opacity: 0.8;">
          Your report will be delivered to this email address <strong>${deliveryTime}</strong>.
        </p>
      </div>
      <div style="background: #c9a84c; color: #07071a; display: inline-block; padding: 10px 25px; border-radius: 50px; font-weight: bold; margin-top: 30px; letter-spacing: 1px;">
        Order ID: ${orderId}
      </div>
      <p style="font-size: 12px; margin-top: 40px; opacity: 0.5;">
        May your stars always guide you home.<br>
        <strong>Khud Ko Jaano</strong>
      </p>
    </div>
  `;

  try {
    console.log(`[Email] Attempting to send confirmation to ${email} via ${fromEmail}...`);
    const info = await transporter.sendMail({
      from: `"Khud Ko Jaano" <${fromEmail}>`,
      to: email,
      subject: `Data Received: Your Cosmic Blueprint is Processing ✨`,
      html: htmlContent,
    });
    console.log(`[Email] User confirmation sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[Email] User Confirmation Failed for ${email}:`, error.message);
    if (error.code === 'EENVELOPE') {
      console.error('[Email] TIP: Check if your EMAIL_FROM address is verified in your SMTP provider dashboard (e.g. Brevo).');
    }
    return false;
  }
};

/**
 * 2. Admin Report Email
 * Sent to Admin with PDF attachment and client info.
 */
const fs = require('fs');
const sendAdminReportEmail = async (orderData, pdfPath) => {
  const { orderId, name, email, phone, plan, specificQuestion } = orderData;
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  const textContent = `
[KKJ] New Order Complete — PDF ATTACHED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order ID: ${orderId}
Client Name: ${name}
Client Email: ${email}
Phone: ${phone}
Plan Type: ${plan}

User's Specific Inquiry:
"${specificQuestion}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTION: Find the attached PDF and send it to the client (${email}) manually.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;

  try {
    const attachments = [];
    if (pdfPath && fs.existsSync(pdfPath)) {
      attachments.push({
        filename: `Astrology_Report_${orderId}.pdf`,
        path: pdfPath
      });
    }

    const info = await transporter.sendMail({
      from: `"KKJ Backend" <${fromEmail}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `[KKJ] NEW REPORT READY: ${orderId} | ${name}`,
      text: textContent,
      attachments
    });
    console.log(`[Email] Admin notification sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('[Email] Admin Report Error:', error.message);
    return false;
  }
};

module.exports = {
  verifyEmailConnection,
  sendStartupTest,
  sendUserConfirmationEmail,
  sendAdminReportEmail
};
