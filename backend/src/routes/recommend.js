import express from 'express'
import { getRecommendations } from '../controllers/recommendController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Optional auth - can work without login
router.post('/recommend', getRecommendations)

export default router

