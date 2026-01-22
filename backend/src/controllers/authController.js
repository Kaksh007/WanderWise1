import User from '../models/User.js'
import { hashPassword, comparePassword } from '../utils/hashPassword.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      name,
    })

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        prefs: user.prefs,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await comparePassword(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        prefs: user.prefs,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}

