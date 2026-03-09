const puppeteer = require('puppeteer');
const path = require('path');
const { getReportTemplate } = require('../templates/reportTemplate');

const fs = require('fs');

const os = require('os');
const generatePDF = async (data, orderId) => {
    const pdfsDir = path.join(os.tmpdir(), 'kkj-reports');
    if (!fs.existsSync(pdfsDir)) {
        fs.mkdirSync(pdfsDir, { recursive: true });
    }

    const pdfPath = path.join(pdfsDir, `${orderId}_Report.pdf`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    });

    try {
        const page = await browser.newPage();
        const orderDate = new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const htmlContent = getReportTemplate(data, orderId, orderDate);

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        });

        return pdfPath;
    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
};

module.exports = { generatePDF };
