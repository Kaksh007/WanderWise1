import express from 'express'
import auth from '../middleware/auth.js'
import { submitFeedback } from '../controllers/feedbackController.js'

const router = express.Router()

// Feedback requires authentication
router.use(auth)

router.post('/', submitFeedback)

export default router

