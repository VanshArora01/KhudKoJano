const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { getReportTemplate } = require('../templates/reportTemplate');

/**
 * PDF Generation Service
 * Robustly handles Puppeteer Chrome detection on Render.com
 */
const generatePDF = async (data, orderId) => {
    // 1️⃣ Setup Output Path
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
        console.log("📂 Creating temp directory:", tempDir);
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const fileName = `${orderId}.pdf`;
    const pdfPath = path.join(tempDir, fileName);

    // 2️⃣ Setup Chrome Search Paths
    // We prioritize local .cache/puppeteer inside the project folder
    const localCache = path.join(process.cwd(), '.cache', 'puppeteer');
    const legacyCache = '/opt/render/.cache/puppeteer';

    console.log("🚀 Launching Puppeteer...");

    let browser;
    try {
        // Try default launch first
        browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--single-process"]
        });
    } catch (launchErr) {
        console.error("❌ Standard launch failed, searching for Chrome executable...");
        console.log("🔍 Looking in:", localCache);

        let chromePath = null;
        const scanDir = (base) => {
            if (fs.existsSync(base)) {
                console.log(`📁 Found directory: ${base}`);
                const chromeDir = path.join(base, 'chrome');
                if (fs.existsSync(chromeDir)) {
                    const entries = fs.readdirSync(chromeDir);
                    for (const entry of entries) {
                        const exe = path.join(chromeDir, entry, 'chrome-linux64', 'chrome');
                        if (fs.existsSync(exe)) {
                            console.log(`✅ Located Chrome: ${exe}`);
                            return exe;
                        }
                    }
                }
            }
            return null;
        };

        chromePath = scanDir(localCache) || scanDir(legacyCache);

        if (!chromePath) {
            throw new Error(`Chrome binary not found. Standard error: ${launchErr.message}`);
        }

        console.log("🔄 Retrying with explicit path...");
        browser = await puppeteer.launch({
            executablePath: chromePath,
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--single-process"]
        });
    }

    console.log("✅ Puppeteer initialized");

    let page;
    try {
        page = await browser.newPage();
        const orderDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        const htmlContent = getReportTemplate(data, orderId, orderDate);

        await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000)); // Font stabilization

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        });

        fs.writeFileSync(pdfPath, pdfBuffer);
        console.log(`📄 PDF size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
        return pdfPath;
    } catch (error) {
        console.error('PDF Worker Error:', error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
};

module.exports = { generatePDF };
