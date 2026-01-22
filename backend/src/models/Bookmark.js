import mongoose from 'mongoose'

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    destinationId: {
      type: String, // Can be ObjectId or destination name
      required: true,
    },
    destinationName: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

// Ensure one bookmark per user per destination
bookmarkSchema.index({ userId: 1, destinationId: 1 }, { unique: true })

const Bookmark = mongoose.model('Bookmark', bookmarkSchema)

export default Bookmark

