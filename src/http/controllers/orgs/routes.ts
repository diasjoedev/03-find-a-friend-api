import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { profile } from './profile'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/org/create', register)
  app.post('/org/sessions', authenticate)

  // Authenticated Routes
  app.get('/org', { onRequest: [verifyJwt] }, profile)
}
