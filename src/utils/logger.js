
const isDev = import.meta.env.VITE_NODE_ENV === 'development';

const logger = {
  log: (...args) => isDev && console.log('[LOG]:', ...args),
  warn: (...args) => isDev && console.warn('[WARN]:', ...args),
  error: (...args) => console.error('[ERROR]:', ...args),
  debug: (...args) => isDev && console.debug('[DEBUG]:', ...args),
};

export default logger;
