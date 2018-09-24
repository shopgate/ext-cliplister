import { logger } from '@shopgate/pwa-core/helpers';

let cached;
function getConfig() {
  if (!cached) {
    try {
      cached = require('../config');
    } catch(e) {
      logger.error('Could not read config.', e);
      cached = {};
    }
  }

  return cached;
}

export default getConfig;
