/**
 * Cross-platform Chrome installation script for Puppeteer.
 * This runs as a postinstall hook to ensure Chromium is available.
 * Works on Windows (local dev), Linux (Render), and macOS.
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Determine cache directory
const cacheDir = process.env.PUPPETEER_CACHE_DIR
    || path.join(process.env.HOME || process.env.USERPROFILE || '/opt/render', '.cache', 'puppeteer');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔧 Installing Chrome for Puppeteer...');
console.log(`📁 Cache directory: ${cacheDir}`);
console.log(`🖥️  Platform: ${process.platform}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Ensure cache directory exists
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
    console.log(`📂 Created cache directory: ${cacheDir}`);
}

try {
    execSync(`npx puppeteer browsers install chrome`, {
        stdio: 'inherit',
        env: {
            ...process.env,
            PUPPETEER_CACHE_DIR: cacheDir, 
        }
    });
    console.log('✅ Chrome installed successfully!');
} catch (err) {
    console.error('⚠️  Chrome installation failed:', err.message);
    console.error('   PDF generation may not work. You can manually run:');
    console.error('   npx puppeteer browsers install chrome');
    // Don't exit with error — let the rest of npm install proceed
}

// Verify installation
const chromeDir = path.join(cacheDir, 'chrome');
if (fs.existsSync(chromeDir)) {
    const versions = fs.readdirSync(chromeDir);
    console.log(`📋 Installed Chrome versions: ${versions.join(', ') || '(none)'}`);
} else {
    console.log('⚠️  Chrome directory not found after installation');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
