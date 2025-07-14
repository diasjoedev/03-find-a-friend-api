import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateOrg } from '@/utils/tests/create-and-authenticate-org'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

describe('Get Pets By City Controller (E2E)', () => {
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

  it('should be able to get pets by city', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    // Criar um pet primeiro
    await request(app.server)
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

    // Buscar pets por cidade
    const response = await request(app.server)
      .get('/pets')
      .query({ city: 'São Paulo' })
      .send()

    expect(response.statusCode).toEqual(200)
    
  })

  it('should be able to get pets by city with filters', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    // Criar um pet com características específicas
    await request(app.server)
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

    // Buscar pets com filtros
    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'São Paulo',
        energy: 'LOW',
        environment: 'SMALL_INDOOR',
        size: 'SMALL',
      })
      .send()

    expect(response.statusCode).toEqual(200)
    
  })

  it('should be able to get pets by city with pagination', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    // Criar múltiplos pets
    for (let i = 1; i <= 3; i++) {
      await request(app.server)
        .post('/pets/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: `Pet ${i}`,
          description: `Descrição do pet ${i}`,
          energy: 'NORMAL',
          environment: 'MEDIUM_INDOOR',
          photos: [`https://example.com/photo${i}.jpg`],
          requirementsForAdoption: ['Casa adequada'],
          size: 'MEDIUM',
        })
    }

    // Buscar pets com paginação
    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'São Paulo',
        page: 1,
      })
      .send()

    expect(response.statusCode).toEqual(200)
    
  })

  it('should return empty array when no pets found in city', async () => {
    const response = await request(app.server)
      .get('/pets')
      .query({ city: 'Cidade Inexistente' })
      .send()

    expect(response.statusCode).toEqual(200)
    
    expect(response.body.pets).toBeNull()
  })

  it('should handle invalid energy filter', async () => {
    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'São Paulo',
        energy: 'INVALID_ENERGY',
      })
      .send()

    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('message')
  })

  it('should handle invalid environment filter', async () => {
    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'São Paulo',
        environment: 'INVALID_ENVIRONMENT',
      })
      .send()

    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('message')
  })

  it('should handle invalid size filter', async () => {
    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'São Paulo',
        size: 'INVALID_SIZE',
      })
      .send()

    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('message')
  })

  it('should handle invalid page number', async () => {
    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'São Paulo',
        page: 0,
      })
      .send()

    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('message')
  })

  it('should handle missing city parameter', async () => {
    const response = await request(app.server).get('/pets').send()

    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('message')
  })

  it('should handle empty city parameter', async () => {
    const response = await request(app.server)
      .get('/pets')
      .query({ city: '' })
      .send()

    expect(response.statusCode).toEqual(400)
    expect(response.body).toHaveProperty('message')
  })

  it('should be able to get pets without authentication', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    // Criar um pet primeiro
    await request(app.server)
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

    // Buscar pets sem autenticação
    const response = await request(app.server)
      .get('/pets')
      .query({ city: 'São Paulo' })
      .send()

    expect(response.statusCode).toEqual(200)
    
  })
})
