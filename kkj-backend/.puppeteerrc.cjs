const { join } = require('path');

/**
 * Puppeteer Configuration for Render.com deployment.
 * This file is automatically read by Puppeteer at install time and runtime.
 * @see https://pptr.dev/guides/configuration
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  cacheDirectory: join(
    process.env.PUPPETEER_CACHE_DIR ||
    process.env.HOME ||
    '/opt/render',
    '.cache',
    'puppeteer'
  ),
};
