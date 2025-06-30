import { FastifyInstance } from 'fastify'
import { register } from './register'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { details } from './details'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/pets/create', { onRequest: [verifyJwt] }, register)
  app.get('/pets/:petId', { onRequest: [verifyJwt] }, details )

  // Authenticated Routes
  //   app.get('/me', { onRequest: [verifyJwt] }, profile)
}
