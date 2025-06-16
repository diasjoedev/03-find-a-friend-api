import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/org/create', register)
  app.post('/org/sessions', authenticate)

  // Authenticated Routes
  //   app.get('/me', { onRequest: [verifyJwt] }, profile)
}
