import express from 'express'
import authRoutes from './auth.js'
import recommendRoutes from './recommend.js'
import bookmarkRoutes from './bookmarks.js'
import feedbackRoutes from './feedback.js'
import destinationRoutes from './destination.js'
import aiRoutes from './ai.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/search', recommendRoutes)
router.use('/bookmarks', bookmarkRoutes)
router.use('/feedback', feedbackRoutes)
router.use('/destination', destinationRoutes)
router.use('/ai', aiRoutes)

export default router

