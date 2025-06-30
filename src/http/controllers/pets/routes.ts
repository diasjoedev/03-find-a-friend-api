import { FastifyInstance } from 'fastify'
import { register } from './register'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { details } from './details'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets/:petId', details )

  //Authenticated Routes
  app.post('/pets/create', { onRequest: [verifyJwt] }, register)

}
