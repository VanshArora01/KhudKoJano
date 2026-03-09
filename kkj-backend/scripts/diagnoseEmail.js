require('dotenv').config({ path: '.env' })
const nodemailer = require('nodemailer')

async function diagnose() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('  KhudKoJano — Brevo Email Diagnosis')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    // ──────────────────────────────────────
    // CHECK 1: Are env variables actually set?
    // ──────────────────────────────────────
    console.log('CHECK 1 — Environment Variables')
    const required = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM', 'ADMIN_EMAIL']
    let envFailed = false
    for (const key of required) {
        if (!process.env[key]) {
            console.error(`  ❌ MISSING: ${key} is not set in .env`)
            envFailed = true
        } else {
            // Print value but mask password
            const val = key === 'EMAIL_PASS'
                ? process.env[key].slice(0, 6) + '...' + process.env[key].slice(-4)
                : process.env[key]
            console.log(`  ✅ ${key} = ${val}`)
        }
    }
    if (envFailed) {
        console.error('\n  ❌ STOP: Fix missing env vars first.\n')
        process.exit(1)
    }

    // ──────────────────────────────────────
    // CHECK 2: Is EMAIL_HOST exactly correct?
    // ──────────────────────────────────────
    console.log('\nCHECK 2 — Brevo SMTP Host Spelling')
    const host = process.env.EMAIL_HOST
    if (host !== 'smtp-relay.brevo.com') {
        console.error(`  ❌ WRONG HOST: "${host}"`)
        console.error('  ✏️  Must be exactly: smtp-relay.brevo.com')
        console.error('  Common mistake: using smtp.brevo.com (old Sendinblue host, deprecated)')
    } else {
        console.log(`  ✅ Host is correct: ${host}`)
    }

    // ──────────────────────────────────────
    // CHECK 3: Is EMAIL_PORT correct?
    // ──────────────────────────────────────
    console.log('\nCHECK 3 — SMTP Port')
    const port = parseInt(process.env.EMAIL_PORT)
    if (port !== 587 && port !== 465 && port !== 25) {
        console.error(`  ❌ UNUSUAL PORT: ${port}`)
        console.error('  ✏️  Brevo works on: 587 (recommended), 465, or 25')
    } else {
        console.log(`  ✅ Port is valid: ${port}`)
        if (port === 465) console.log('  ⚠️  Port 465 requires secure:true — make sure that is set')
        if (port === 587) console.log('  ℹ️  Port 587 uses STARTTLS — secure must be false')
    }

    // ──────────────────────────────────────
    // CHECK 4: Is EMAIL_PASS the SMTP key (not Brevo login password)?
    // ──────────────────────────────────────
    console.log('\nCHECK 4 — Brevo SMTP Password Format')
    const pass = process.env.EMAIL_PASS
    if (pass.startsWith('xsmtpib-') || pass.startsWith('xsmtpsib-')) {
        console.log('  ✅ PASSWORD FORMAT: Looks like a valid Brevo SMTP key')
    } else if (pass.length < 20) {
        console.error('  ❌ PASSWORD TOO SHORT — This looks like your Brevo account password')
        console.error('  ✏️  You need the SMTP key from Brevo, not your login password')
        console.error('  ✏️  Go to: app.brevo.com → SMTP & API → SMTP tab → Generate new key')
        console.error('  ✏️  It will look like: xsmtpib-xxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxx')
    } else {
        console.log(`  ⚠️  PASSWORD FORMAT UNKNOWN — length ${pass.length}`)
        console.log('  ✏️  Verify it is the SMTP key from Brevo dashboard (not your login password)')
    }

    // ──────────────────────────────────────
    // CHECK 5: Can we reach Brevo server at all? (TCP connection)
    // ──────────────────────────────────────
    console.log('\nCHECK 5 — Network Connectivity to Brevo')
    const net = require('net')
    await new Promise((resolve) => {
        const socket = new net.Socket()
        socket.setTimeout(5000)
        socket.connect(587, 'smtp-relay.brevo.com', () => {
            console.log('  ✅ NETWORK: Can reach smtp-relay.brevo.com:587')
            socket.destroy()
            resolve()
        })
        socket.on('error', (err) => {
            console.error('  ❌ NETWORK BLOCKED:', err.message)
            console.error('  ✏️  Your firewall or ISP is blocking port 587')
            console.error('  ✏️  Try switching to port 465 or use a VPN/different network')
            socket.destroy()
            resolve()
        })
        socket.on('timeout', () => {
            console.error('  ❌ NETWORK TIMEOUT: Connection to Brevo timed out')
            console.error('  ✏️  Port 587 may be blocked. Try port 465 with secure:true')
            socket.destroy()
            resolve()
        })
    })

    // ──────────────────────────────────────
    // CHECK 6: SMTP Authentication (transporter.verify())
    // ──────────────────────────────────────
    console.log('\nCHECK 6 — SMTP Authentication (Login Test)')
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: parseInt(process.env.EMAIL_PORT) === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        logger: false,
        debug: false
    })

    try {
        await transporter.verify()
        console.log('  ✅ AUTH: Logged in to Brevo SMTP successfully')
    } catch (err) {
        console.error('  ❌ AUTH FAILED:', err.message)
        if (err.message.includes('535') || err.message.includes('Invalid')) {
            console.error('  ✏️  CAUSE: Wrong credentials')
            console.error('  ✏️  EMAIL_USER must be your exact Brevo login email')
            console.error('  ✏️  EMAIL_PASS must be the SMTP key from Brevo dashboard')
            console.error('  ✏️  Get it at: app.brevo.com → SMTP & API → SMTP → Generate Key')
        }
        if (err.message.includes('ECONNREFUSED')) {
            console.error('  ✏️  CAUSE: Connection refused — wrong host or port')
        }
        if (err.message.includes('ETIMEDOUT')) {
            console.error('  ✏️  CAUSE: Timeout — port blocked by firewall')
        }
        console.error('\n  ❌ Cannot continue — fix authentication first\n')
        process.exit(1)
    }

    // ──────────────────────────────────────
    // CHECK 7: Is Brevo account verified?
    // (Try sending and catch specific Brevo error codes)
    // ──────────────────────────────────────
    console.log('\nCHECK 7 — Sending Real Test Email')
    console.log('  Sending to:', process.env.ADMIN_EMAIL)

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.ADMIN_EMAIL,
            subject: '🔍 KhudKoJano Email Diagnosis Test — ' + new Date().toLocaleTimeString(),
            html: `
        <div style="background:#07071a;padding:40px;font-family:Arial,sans-serif;color:#e8e8f0;max-width:600px;margin:0 auto;border:1px solid rgba(201,168,76,0.3);border-radius:12px;">
          <h2 style="color:#c9a84c;font-size:20px;margin:0 0 16px;">✅ Email Delivery Confirmed</h2>
          <p style="color:rgba(232,232,240,0.8);line-height:1.7;">
            This is a diagnostic test from your KhudKoJano backend.<br>
            If you can see this email, your Brevo SMTP setup is working correctly.
          </p>
          <div style="background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3);border-radius:8px;padding:16px;margin:24px 0;">
            <p style="margin:0;font-size:13px;color:rgba(232,232,240,0.6);">Sent at: ${new Date().toISOString()}</p>
            <p style="margin:4px 0 0;font-size:13px;color:rgba(232,232,240,0.6);">From: ${process.env.EMAIL_FROM}</p>
            <p style="margin:4px 0 0;font-size:13px;color:rgba(232,232,240,0.6);">To: ${process.env.ADMIN_EMAIL}</p>
          </div>
          <p style="color:rgba(232,232,240,0.5);font-size:12px;">ॐ Khud Ko Jaano</p>
        </div>
      `
        })

        console.log('  ✅ SEND SUCCESS')
        console.log('  📬 Message ID:', info.messageId)
        console.log('  📊 Response:', info.response)
        console.log('\n  ─────────────────────────────────────────')
        console.log('  If send succeeded but email not in inbox:')
        console.log('  1. CHECK SPAM/JUNK folder immediately')
        console.log('  2. Check Brevo logs: app.brevo.com → Transactional → Email Logs')
        console.log('     It will show EXACTLY if email was delivered, bounced, or blocked')
        console.log('  3. If email shows "sent" in Brevo but not in inbox → spam filter issue')
        console.log('  4. Try sending to a different email (Gmail vs Outlook behave differently)')
        console.log('  ─────────────────────────────────────────\n')

    } catch (err) {
        console.error('  ❌ SEND FAILED:', err.message)
        if (err.code) console.error('  Error code:', err.code)
        if (err.response) console.error('  Response:', err.response)

        // Diagnose specific Brevo error codes
        if (err.responseCode === 401 || err.message.includes('401')) {
            console.error('\n  ✏️  FIX: Account not authorized to send')
            console.error('  ✏️  Go to Brevo → Settings → Senders & IPs')
            console.error('  ✏️  Add and verify your sender email address')
        }
        if (err.responseCode === 403 || err.message.includes('403')) {
            console.error('\n  ✏️  FIX: Account sending suspended or daily limit reached')
            console.error('  ✏️  Brevo free plan = 300 emails/day')
            console.error('  ✏️  Check: app.brevo.com → Account → Plan & Billing')
        }
        if (err.message.includes('Sender address rejected')) {
            console.error('\n  ✏️  FIX: EMAIL_FROM address is not verified in Brevo')
            console.error('  ✏️  Go to: app.brevo.com → Senders & IPs → Add a Sender')
            console.error('  ✏️  Verify the email address you put in EMAIL_FROM')
        }
        if (err.message.includes('550')) {
            console.error('\n  ✏️  FIX: Recipient address rejected or does not exist')
            console.error('  ✏️  Double check ADMIN_EMAIL is a real valid address')
        }
    }

    // ──────────────────────────────────────
    // CHECK 8: Sender verification status
    // ──────────────────────────────────────
    console.log('CHECK 8 — Common Brevo Account Issues Checklist')
    console.log('  Manually verify these in your Brevo dashboard:')
    console.log('  □ app.brevo.com → Senders & IPs → Is your sender email verified?')
    console.log('  □ app.brevo.com → SMTP & API → Is SMTP access enabled?')
    console.log('  □ app.brevo.com → Transactional → Email Logs → Any failed sends?')
    console.log('  □ Brevo free plan limit: 300 emails/day — not exceeded?')
    console.log('  □ Account not flagged/suspended? (check Brevo notifications)')

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('  Diagnosis complete. Fix any ❌ above.')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

diagnose().catch(err => {
    console.error('Unexpected error during diagnosis:', err)
    process.exit(1)
})
