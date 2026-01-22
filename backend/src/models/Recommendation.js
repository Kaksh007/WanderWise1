import mongoose from 'mongoose'
import { createHash } from 'crypto'

const candidateSchema = new mongoose.Schema({
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
  },
  name: String,
  score: Number,
  reason: String,
  topPlaces: [
    {
      name: String,
      description: String,
    },
  ],
  sampleItineraryText: String,
})

const inputSchema = new mongoose.Schema(
  {
    location: String,
    budgetRange: String,
    lengthDays: Number,
    travelStyle: String,
    interests: [String],
  },
  { _id: false }
)

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    input: {
      type: inputSchema,
    },
    inputHash: {
      type: String,
      index: true,
    },
    results: [candidateSchema],
    cached: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Generate hash from input for caching
recommendationSchema.statics.generateInputHash = function (input) {
  const inputString = JSON.stringify(input)
  return createHash('md5').update(inputString).digest('hex')
}

// Index for faster lookups
recommendationSchema.index({ inputHash: 1, createdAt: -1 })
recommendationSchema.index({ userId: 1, createdAt: -1 })

const Recommendation = mongoose.model('Recommendation', recommendationSchema)

export default Recommendation

