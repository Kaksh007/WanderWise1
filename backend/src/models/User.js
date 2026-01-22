import mongoose from 'mongoose'

const prefsSchema = new mongoose.Schema(
  {
    budgetBracket: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    travelStyles: [
      {
        type: String,
        enum: ['trekking', 'relaxation', 'culture', 'adventure', 'beach', 'city'],
      },
    ],
    homeCountry: {
      type: String,
      default: '',
    },
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    prefs: {
      type: prefsSchema,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

export default User

