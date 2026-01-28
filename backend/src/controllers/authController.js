import User from '../models/User.js'
import { hashPassword, comparePassword } from '../utils/hashPassword.js'
import jwt from 'jsonwebtoken'
import axios from 'axios'

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
      authProvider: 'local',
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

    // Prevent password login for Google-only accounts
    if (!user.passwordHash) {
      return res.status(400).json({
        message: 'This account was created with Google. Please sign in with Google.',
      })
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

export const googleAuth = async (req, res, next) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' })
    }

    const {
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI,
    } = process.env

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
      return res
        .status(500)
        .json({ message: 'Google OAuth is not configured on the server' })
    }

    // Exchange authorization code for tokens
    const tokenParams = new URLSearchParams()
    tokenParams.append('code', code)
    tokenParams.append('client_id', GOOGLE_CLIENT_ID)
    tokenParams.append('client_secret', GOOGLE_CLIENT_SECRET)
    tokenParams.append('redirect_uri', GOOGLE_REDIRECT_URI)
    tokenParams.append('grant_type', 'authorization_code')

    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      tokenParams.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const { access_token: accessToken } = tokenResponse.data

    if (!accessToken) {
      return res.status(401).json({ message: 'Failed to obtain access token from Google' })
    }

    // Fetch user info from Google
    const userInfoResponse = await axios.get(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    const { sub: googleId, email, name } = userInfoResponse.data

    if (!email) {
      return res.status(400).json({ message: 'Google account does not have an email address' })
    }

    // Find or create user
    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        email,
        name: name || email.split('@')[0],
        googleId,
        authProvider: 'google',
      })
    } else if (!user.googleId) {
      // Link existing local account to Google if emails match
      user.googleId = googleId
      user.authProvider = user.authProvider || 'local'
      await user.save()
    }

    // Issue JWT for our app
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.json({
      message: 'Login with Google successful',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        prefs: user.prefs,
      },
      token,
    })
  } catch (error) {
    // Surface Google OAuth errors more clearly in development, but avoid leaking details in production
    if (error.response) {
      console.error('Google OAuth error:', error.response.data)
    } else {
      console.error('Google OAuth error:', error.message)
    }
    next(error)
  }
}

