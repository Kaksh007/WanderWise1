import express from 'express'
import {
  getDestination,
  searchDestinations,
} from '../controllers/destinationController.js'

const router = express.Router()

router.get('/:id', getDestination)
router.get('/search', searchDestinations)

export default router

