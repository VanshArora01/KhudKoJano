const { join } = require('path');

/**
 * Puppeteer Configuration for Render.
 * We store Chrome INSIDE the project directory so it persists at runtime.
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
