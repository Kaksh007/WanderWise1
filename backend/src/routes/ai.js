import express from 'express'
import { getAIHealth } from '../controllers/aiController.js'

const router = express.Router()

// Public AI health endpoint
router.get('/health', getAIHealth)

export default router

