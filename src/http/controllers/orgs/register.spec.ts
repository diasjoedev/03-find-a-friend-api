import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

describe('Register Orgs Controller (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await prisma.org.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a org', async () => {
    const response = await request(app.server).post('/org/create').send({
      address: 'Rua dos Bobos, 0',
      email: 'joelsondiasti@outlook.com',
      responsible: 'Jobson da Silva',
      whatsapp: '+5511987654321',
      zipCode: '00000123',
      orgName: 'Casa dos Pets',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      password: 'teste123',
      longitude: -22.7807984,
      latitude: -43.3046486,
    })

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      orgId: expect.any(String),
    })
  })

  it('should not be able to register a org without some of the input data', async () => {
    const response = await request(app.server).post('/org/create').send({
      address: 'Rua dos Bobos, 0',
      email: 'joelsondiasti@outlook.com',
      responsible: 'Jobson da Silva',
      whatsapp: '+5511987654321',
      state: 'Rio de Janeiro',
      password: 'teste123',
      longitude: -22.7807984,
      latitude: -43.3046486,
    })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Validation Error',
      }),
    )
  })

  it('should not be able to register a org email twice', async () => {
    await prisma.org.create({
      data: {
        address: 'Rua dos Bobos, 0',
        email: 'joelsondiasti@outlook.com',
        responsible: 'Jobson da Silva',
        whatsapp: '+5511987654321',
        zipCode: '00000123',
        orgName: 'Casa dos Pets',
        city: 'Rio de Janeiro',
        state: 'Rio de Janeiro',
        password_hash: 'teste123',
        longitude: -22.7807984,
        latitude: -43.3046486,
      },
    })

    const response = await request(app.server).post('/org/create').send({
      address: 'Rua dos Bobos, 0',
      email: 'joelsondiasti@outlook.com',
      responsible: 'Jobson da Silva',
      whatsapp: '+5511987654321',
      zipCode: '00000123',
      orgName: 'Casa dos Pets',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      password: 'teste123',
      longitude: -22.7807984,
      latitude: -43.3046486,
    })

    expect(response.statusCode).toEqual(409)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      }),
    )
  })

})
