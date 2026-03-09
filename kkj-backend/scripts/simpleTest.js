require('dotenv').config({ path: '.env' })
const nodemailer = require('nodemailer')

async function diagnose() {
    console.log('--- Brevo Diagnosis ---')
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST)
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT)
    console.log('EMAIL_USER:', process.env.EMAIL_USER)
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM)
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL)

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: parseInt(process.env.EMAIL_PORT) === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    try {
        await transporter.verify()
        console.log('OK: Auth successful')
    } catch (err) {
        console.log('FAIL: Auth failed:', err.message)
        return
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.ADMIN_EMAIL,
            subject: 'Test Email',
            text: 'Test body'
        })
        console.log('OK: Send successful')
        console.log('Message ID:', info.messageId)
        console.log('Response:', info.response)
    } catch (err) {
        console.log('FAIL: Send failed:', err.message)
        if (err.response) console.log('Response:', err.response)
    }
}

diagnose()
