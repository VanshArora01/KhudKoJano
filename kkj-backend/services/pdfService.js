const puppeteer = require('puppeteer');
const path = require('path');
const { getReportTemplate } = require('../templates/reportTemplate');

const fs = require('fs');

const os = require('os');
const generatePDF = async (data, orderId) => {
    const pdfsDir = path.join(__dirname, '../pdfs'); // Using a stable local directory
    if (!fs.existsSync(pdfsDir)) {
        fs.mkdirSync(pdfsDir, { recursive: true });
    }

    const pdfPath = path.join(pdfsDir, `${orderId}.pdf`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--disable-extensions'
        ],
        timeout: 30000
    });

    let page;
    try {
        page = await browser.newPage();
        const orderDate = new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const htmlContent = getReportTemplate(data, orderId, orderDate);

        // Change from networkidle0 to domcontentloaded for better reliability on Render
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
        return pdfPath;
    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw error;
    } finally {
        // Always close browser even if error occurs
        if (browser) await browser.close();
    }
};

module.exports = { generatePDF };
