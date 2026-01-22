import mongoose from 'mongoose'

const topPlaceSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  xid: String, // Optional external ID (for future use)
})

const coordsSchema = new mongoose.Schema(
  {
    lat: Number,
    lon: Number,
  },
  { _id: false }
)

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    country: {
      type: String,
      required: true,
    },
    coords: {
      type: coordsSchema,
    },
    summary: String,
    topPlaces: [topPlaceSchema],
    cachedAt: {
      type: Date,
      default: Date.now,
      index: { expireAfterSeconds: 604800 }, // 7 days TTL
    },
  },
  {
    timestamps: true,
  }
)

const Destination = mongoose.model('Destination', destinationSchema)

export default Destination

