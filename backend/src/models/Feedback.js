import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    recommendationId: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      enum: [-1, 1], // -1 for downvote, 1 for upvote
    },
    comment: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

// One feedback per user per recommendation
feedbackSchema.index({ userId: 1, recommendationId: 1 }, { unique: true })

const Feedback = mongoose.model('Feedback', feedbackSchema)

export default Feedback

