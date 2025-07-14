import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateOrg } from '@/utils/tests/create-and-authenticate-org'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

describe('Register Pet Controller (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await prisma.pet.deleteMany()
    await prisma.org.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a pet', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const response = await request(app.server)
      .post('/pets/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        description: 'Um cachorro muito amigável e brincalhão',
        energy: 'HIGH',
        environment: 'SPACIOUS_OUTDOOR',
        photos: [
          'https://example.com/photo1.jpg',
          'https://example.com/photo2.jpg',
        ],
        requirementsForAdoption: ['Casa com quintal', 'Tempo para passeios'],
        size: 'MEDIUM',
      })

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'Buddy',
      description: 'Um cachorro muito amigável e brincalhão',
      energy: 'HIGH',
      environment: 'SPACIOUS_OUTDOOR',
      photos: [
        'https://example.com/photo1.jpg',
        'https://example.com/photo2.jpg',
      ],
      requirementsForAdoption: ['Casa com quintal', 'Tempo para passeios'],
      size: 'MEDIUM',
      orgId: expect.any(String),
    })
  })

  it('should not be able to register a pet without authentication', async () => {
    const response = await request(app.server)
      .post('/pets/create')
      .send({
        name: 'Buddy',
        description: 'Um cachorro muito amigável e brincalhão',
        energy: 'HIGH',
        environment: 'SPACIOUS_OUTDOOR',
        photos: ['https://example.com/photo1.jpg'],
        requirementsForAdoption: ['Casa com quintal'],
        size: 'MEDIUM',
      })

    expect(response.statusCode).toEqual(401)
  })

  it('should not be able to register a pet with invalid energy level', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const response = await request(app.server)
      .post('/pets/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        description: 'Um cachorro muito amigável e brincalhão',
        energy: 'INVALID_ENERGY',
        environment: 'SPACIOUS_OUTDOOR',
        photos: ['https://example.com/photo1.jpg'],
        requirementsForAdoption: ['Casa com quintal'],
        size: 'MEDIUM',
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      }),
    )
  })

  it('should not be able to register a pet with invalid environment', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const response = await request(app.server)
      .post('/pets/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        description: 'Um cachorro muito amigável e brincalhão',
        energy: 'HIGH',
        environment: 'INVALID_ENVIRONMENT',
        photos: ['https://example.com/photo1.jpg'],
        requirementsForAdoption: ['Casa com quintal'],
        size: 'MEDIUM',
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      }),
    )
  })

  it('should not be able to register a pet with invalid size', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const response = await request(app.server)
      .post('/pets/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        description: 'Um cachorro muito amigável e brincalhão',
        energy: 'HIGH',
        environment: 'SPACIOUS_OUTDOOR',
        photos: ['https://example.com/photo1.jpg'],
        requirementsForAdoption: ['Casa com quintal'],
        size: 'INVALID_SIZE',
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      }),
    )
  })

  it('should not be able to register a pet without required fields', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const response = await request(app.server)
      .post('/pets/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        description: 'Um cachorro muito amigável e brincalhão',
        energy: 'HIGH',
        // missing environment, photos, requirementsForAdoption, size
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      }),
    )
  })

  it('should not be able to register a pet with empty photos array', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const response = await request(app.server)
      .post('/pets/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        description: 'Um cachorro muito amigável e brincalhão',
        energy: 'HIGH',
        environment: 'SPACIOUS_OUTDOOR',
        photos: [],
        requirementsForAdoption: ['Casa com quintal'],
        size: 'MEDIUM',
      })

    expect(response.statusCode).toEqual(201) // Should still work with empty photos array
  })

  it('should not be able to register a pet with empty requirements array', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const response = await request(app.server)
      .post('/pets/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        description: 'Um cachorro muito amigável e brincalhão',
        energy: 'HIGH',
        environment: 'SPACIOUS_OUTDOOR',
        photos: ['https://example.com/photo1.jpg'],
        requirementsForAdoption: [],
        size: 'MEDIUM',
      })

    expect(response.statusCode).toEqual(201) // Should still work with empty requirements array
  })

  it('should be able to register multiple pets for the same org', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const pet1Response = await request(app.server)
      .post('/pets/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        description: 'Um cachorro muito amigável e brincalhão',
        energy: 'HIGH',
        environment: 'SPACIOUS_OUTDOOR',
        photos: ['https://example.com/photo1.jpg'],
        requirementsForAdoption: ['Casa com quintal'],
        size: 'MEDIUM',
      })

    const pet2Response = await request(app.server)
      .post('/pets/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Luna',
        description: 'Uma gata tranquila e carinhosa',
        energy: 'LOW',
        environment: 'SMALL_INDOOR',
        photos: ['https://example.com/photo3.jpg'],
        requirementsForAdoption: ['Apartamento pequeno'],
        size: 'SMALL',
      })

    expect(pet1Response.statusCode).toEqual(201)
    expect(pet2Response.statusCode).toEqual(201)
    expect(pet1Response.body.name).toBe('Buddy')
    expect(pet2Response.body.name).toBe('Luna')
  })
})
