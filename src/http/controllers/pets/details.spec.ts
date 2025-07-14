import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateOrg } from '@/utils/tests/create-and-authenticate-org'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

describe('Get Pet Details Controller (E2E)', () => {
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

  it('should be able to get pet details', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    // Criar um pet primeiro
    const createPetResponse = await request(app.server)
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

    const petId = createPetResponse.body.id

    // Buscar os detalhes do pet
    const response = await request(app.server).get(`/pet/${petId}`).send()

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      id: petId,
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

  it('should not be able to get pet details with invalid pet id', async () => {
    const response = await request(app.server).get('/pet/invalid-pet-id').send()

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual({
      message: 'Resource Not Found',
    })
  })

  it('should not be able to get pet details with non-existent pet id', async () => {
    const response = await request(app.server)
      .get('/pet/00000000-0000-0000-0000-000000000000')
      .send()

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual({
      message: 'Resource Not Found',
    })
  })

  it('should not be able to get pet details with empty pet id', async () => {
    const response = await request(app.server).get('/pet/').send()

    expect(response.statusCode).toEqual(400)
  })

  it('should be able to get pet details without authentication', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    // Criar um pet primeiro
    const createPetResponse = await request(app.server)
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

    const petId = createPetResponse.body.id

    // Buscar os detalhes do pet sem autenticação
    const response = await request(app.server).get(`/pet/${petId}`).send()

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      id: petId,
      name: 'Luna',
      description: 'Uma gata tranquila e carinhosa',
      energy: 'LOW',
      environment: 'SMALL_INDOOR',
      photos: ['https://example.com/photo3.jpg'],
      requirementsForAdoption: ['Apartamento pequeno'],
      size: 'SMALL',
      orgId: expect.any(String),
    })
  })

  it('should be able to get details of multiple pets', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    // Criar dois pets
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

    const pet1Id = pet1Response.body.id
    const pet2Id = pet2Response.body.id

    // Buscar os detalhes de ambos os pets
    const response1 = await request(app.server).get(`/pet/${pet1Id}`).send()

    const response2 = await request(app.server).get(`/pet/${pet2Id}`).send()

    expect(response1.statusCode).toEqual(201)
    expect(response2.statusCode).toEqual(201)
    expect(response1.body.name).toBe('Buddy')
    expect(response2.body.name).toBe('Luna')
    expect(response1.body.id).toBe(pet1Id)
    expect(response2.body.id).toBe(pet2Id)
  })

})
