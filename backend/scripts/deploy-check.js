/**
 * Pre-deployment checklist script
 * Run this before deploying to production
 */

import dotenv from 'dotenv'
import { logger } from '../src/utils/logger.js'

dotenv.config()

const checks = {
  envVars: [
    'MONGO_URI',
    'JWT_SECRET',
    'HF_API_KEY',
    'OPENTRIPMAP_API_KEY',
    'GEONAMES_USERNAME',
  ],
}

function checkEnvironment() {
  logger.info('Running pre-deployment checks...')
  const missing = []
  const warnings = []

  // Check required environment variables
  checks.envVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName)
    } else if (process.env[varName].includes('your-') || process.env[varName].includes('example')) {
      warnings.push(`${varName} appears to be a placeholder`)
    }
  })

  // Check NODE_ENV
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    warnings.push('NODE_ENV is not set to production')
  }

  // Report results
  if (missing.length > 0) {
    logger.error('Missing required environment variables:')
    missing.forEach((v) => logger.error(`  - ${v}`))
    process.exit(1)
  }

  if (warnings.length > 0) {
    logger.warn('Warnings:')
    warnings.forEach((w) => logger.warn(`  - ${w}`))
  }

  logger.info('All checks passed! Ready for deployment.')
}

checkEnvironment()
