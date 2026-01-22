/**
 * Simple logger utility
 * In production, replace with Winston or similar
 */

const logLevel = process.env.LOG_LEVEL || 'info'

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

const shouldLog = (level) => {
  return levels[level] <= levels[logLevel]
}

export const logger = {
  error: (message, ...args) => {
    if (shouldLog('error')) {
      console.error(`[ERROR] ${new Date().toISOString()} -`, message, ...args)
    }
  },
  warn: (message, ...args) => {
    if (shouldLog('warn')) {
      console.warn(`[WARN] ${new Date().toISOString()} -`, message, ...args)
    }
  },
  info: (message, ...args) => {
    if (shouldLog('info')) {
      console.log(`[INFO] ${new Date().toISOString()} -`, message, ...args)
    }
  },
  debug: (message, ...args) => {
    if (shouldLog('debug')) {
      console.log(`[DEBUG] ${new Date().toISOString()} -`, message, ...args)
    }
  },
}
