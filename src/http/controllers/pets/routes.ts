import { FastifyInstance } from 'fastify'
import { register } from './register'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/pets/create', register)

  // Authenticated Routes
  //   app.get('/me', { onRequest: [verifyJwt] }, profile)
}
