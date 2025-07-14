import { prisma } from '@/lib/prisma'

import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateOrg(app: FastifyInstance) {
  await prisma.org.create({
    data: {
      address: 'Rua dos Bobos, 0',
      email: 'joelsondias@outlook.com',
      responsible: 'Jobson da Silva',
      whatsapp: '+5511987654321',
      zipCode: '00000123',
      orgName: 'Casa dos Pets 5',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      password_hash: await hash('123456', 6),
      longitude: -22.7807984,
      latitude: -43.3046486,
    },
  })

  const authResponse = await request(app.server).post('/org/sessions').send({
    email: 'joelsondias@outlook.com',
    password: '123456',
  })

  const { token } = authResponse.body
  //   console.log(`🛠️ Test Utility - CREATED ORG TOKEN :: ${token}`)
  return { token }
}
