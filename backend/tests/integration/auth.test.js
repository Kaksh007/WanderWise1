/**
 * Integration tests for authentication flow
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../../src/models/User.js'
import { hashPassword } from '../../src/utils/hashPassword.js'

dotenv.config()

const TEST_MONGO_URI = process.env.TEST_MONGO_URI || process.env.MONGO_URI

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    if (TEST_MONGO_URI) {
      await mongoose.connect(TEST_MONGO_URI)
    }
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    // Clean up test users
    await User.deleteMany({ email: /test@/ })
  })

  test('should create a new user with hashed password', async () => {
    const email = 'test@example.com'
    const password = 'testPassword123'
    const name = 'Test User'

    const passwordHash = await hashPassword(password)
    const user = await User.create({
      email,
      passwordHash,
      name,
    })

    expect(user.email).toBe(email)
    expect(user.passwordHash).not.toBe(password)
    expect(user.passwordHash.length).toBeGreaterThan(20)
    expect(user.name).toBe(name)
  })

  test('should not create duplicate users', async () => {
    const email = 'duplicate@example.com'
    const passwordHash = await hashPassword('password')

    await User.create({ email, passwordHash, name: 'User 1' })

    await expect(
      User.create({ email, passwordHash, name: 'User 2' })
    ).rejects.toThrow()
  })
})
