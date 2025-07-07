import { FastifyInstance } from 'fastify'
import { register } from './register'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { details } from './details'
import { petsByCity } from './petsByCity'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets', petsByCity)
  app.get('/pet/:petId', details )

  //Authenticated Routes 
  app.post('/pets/create', { onRequest: [verifyJwt] }, register)

}
