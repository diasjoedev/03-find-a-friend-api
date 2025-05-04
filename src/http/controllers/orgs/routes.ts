import { FastifyInstance } from 'fastify'
import { register } from './register'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/org/create', register)

  // Authenticated Routes
  //   app.get('/me', { onRequest: [verifyJwt] }, profile)
}
