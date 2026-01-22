import express from 'express'
import {
  getDestination,
  searchDestinations,
} from '../controllers/destinationController.js'
import { getTopDestinations } from '../controllers/topDestinationsController.js'

const router = express.Router()

router.get('/top', getTopDestinations)
router.get('/search', searchDestinations)
router.get('/:id', getDestination)

export default router

