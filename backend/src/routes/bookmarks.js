import express from 'express'
import auth from '../middleware/auth.js'
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
} from '../controllers/bookmarkController.js'

const router = express.Router()

// All bookmark routes require authentication
router.use(auth)

router.get('/', getBookmarks)
router.post('/', addBookmark)
router.delete('/:destinationId', removeBookmark)

export default router

