const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { getReportTemplate } = require('../templates/reportTemplate');

const generatePDF = async (data, orderId) => {
    const tempDir = path.join(process.cwd(), 'temp');

    if (!fs.existsSync(tempDir)) {
        console.log("📂 Creating temp directory:", tempDir);
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const fileName = `${orderId}.pdf`;
    const pdfPath = path.join(tempDir, fileName);

    console.log("🚀 Launching Puppeteer...");

    // Auto-detect Chromium: Puppeteer will find it via .puppeteerrc.cjs config
    // or from the default cache location. No hardcoded paths needed.
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-accelerated-2d-canvas",
                "--no-first-run",
                "--no-zygote",
                "--single-process",
                "--disable-extensions"
            ],
            timeout: 60000
        });
    } catch (launchErr) {
        console.error("❌ Puppeteer launch failed:", launchErr.message);
        console.log("ℹ️  PUPPETEER_CACHE_DIR:", process.env.PUPPETEER_CACHE_DIR || "(not set)");
        console.log("ℹ️  HOME:", process.env.HOME || "(not set)");

        // Try fallback: check common Render locations
        const possiblePaths = [
            '/opt/render/.cache/puppeteer',
            '/opt/render/project/.cache/puppeteer',
            path.join(process.env.HOME || '', '.cache', 'puppeteer'),
        ];

        let chromePath = null;
        for (const base of possiblePaths) {
            if (fs.existsSync(base)) {
                console.log(`📁 Found cache dir: ${base}`);
                // Walk into chrome directory to find the executable
                try {
                    const chromeDir = path.join(base, 'chrome');
                    if (fs.existsSync(chromeDir)) {
                        const versions = fs.readdirSync(chromeDir);
                        if (versions.length > 0) {
                            const exePath = path.join(chromeDir, versions[0], 'chrome-linux64', 'chrome');
                            if (fs.existsSync(exePath)) {
                                chromePath = exePath;
                                console.log(`✅ Found Chrome executable: ${chromePath}`);
                                break;
                            }
                        }
                    }
                } catch (e) {
                    console.log(`  Could not scan ${base}:`, e.message);
                }
            }
        }

        if (!chromePath) {
            throw new Error(`Puppeteer could not find Chrome. Original error: ${launchErr.message}`);
        }

        console.log("🔄 Retrying with explicit executablePath:", chromePath);
        browser = await puppeteer.launch({
            headless: "new",
            executablePath: chromePath,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-accelerated-2d-canvas",
                "--no-first-run",
                "--no-zygote",
                "--single-process",
                "--disable-extensions"
            ],
            timeout: 60000
        });
    }

    console.log("✅ Puppeteer launched successfully");

    let page;
    try {
        page = await browser.newPage();
        const orderDate = new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const htmlContent = getReportTemplate(data, orderId, orderDate);

        await page.setContent(htmlContent, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        // Give fonts extra time to load after DOM is ready
        await new Promise(resolve => setTimeout(resolve, 2000));

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
            timeout: 60000
        });

        fs.writeFileSync(pdfPath, pdfBuffer);
        console.log(`📄 PDF written: ${pdfPath} (${pdfBuffer.length} bytes)`);
        return pdfPath;
    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
};

module.exports = { generatePDF };
