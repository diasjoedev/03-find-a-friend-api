import { app } from '@/app'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const prisma = new PrismaClient()

describe('Authenticate Controller (E2E)', () => {
  beforeEach(async () => {
    await prisma.org.deleteMany()
  })

  afterEach(async () => {
    await prisma.org.deleteMany()
  })

  it('should be able to authenticate an organization', async () => {
    // Create a test organization
    const org = await prisma.org.create({
      data: {
        orgName: 'Test Organization',
        responsible: 'John Doe',
        zipCode: '12345-678',
        address: 'Test Address',
        city: 'Test City',
        state: 'SP',
        whatsapp: '123456789',
        email: 'test@example.com',
        password_hash: await hash('123456', 6),
        latitude: -23.5505,
        longitude: -46.6333,
      },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/org/sessions',
      payload: {
        email: 'test@example.com',
        password: '123456',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
      token: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong password', async () => {
    // Create a test organization
    await prisma.org.create({
      data: {
        orgName: 'Test Organization',
        responsible: 'John Doe',
        zipCode: '12345-678',
        address: 'Test Address',
        city: 'Test City',
        state: 'SP',
        whatsapp: '123456789',
        email: 'test@example.com',
        password_hash: await hash('123456', 6),
        latitude: -23.5505,
        longitude: -46.6333,
      },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/org/sessions',
      payload: {
        email: 'test@example.com',
        password: 'wrong-password',
      },
    })

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body)).toEqual({
      message: 'Invalid Credentials',
    })
  })

  it('should not be able to authenticate with non-existent email', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/org/sessions',
      payload: {
        email: 'nonexistent@example.com',
        password: '123456',
      },
    })

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body)).toEqual({
      message: 'Invalid Credentials',
    })
  })
})
