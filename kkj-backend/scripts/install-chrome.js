const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Cross-platform Chrome installation for Puppeteer.
 * We use a LOCAL project directory (.cache/puppeteer)
 * to ensure Render keeps the Chrome binary in the runtime environment.
 */
const cacheDir = path.join(process.cwd(), '.cache', 'puppeteer');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔧 Installing Chrome for Puppeteer...');
console.log(`📁 Cache directory: ${cacheDir}`);
console.log(`🖥️ Platform: ${process.platform}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
    console.log(`📂 Created cache directory: ${cacheDir}`);
}

try {
    // Explicitly set the cache dir for the install command
    execSync(`npx puppeteer browsers install chrome`, {
        stdio: 'inherit',
        env: {
            ...process.env,
            PUPPETEER_CACHE_DIR: cacheDir, 
        }
    });
    console.log('✅ Chrome installed successfully!');
} catch (err) {
    console.error('⚠️ Chrome installation failed:', err.message);
}

const chromeDir = path.join(cacheDir, 'chrome');
if (fs.existsSync(chromeDir)) {
    const versions = fs.readdirSync(chromeDir);
    console.log(`📋 Installed Chrome versions: ${versions.join(', ') || '(none)'}`);
} else {
    console.log('⚠️ Chrome directory not found after installation');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
