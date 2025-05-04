import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBobySchema = z.object({
    responsible: z.string(),
    zipcode: z.string().min(8),
    address: z.string(),
    whatsapp: z.string().min(11),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { address, email, responsible, password, whatsapp, zipcode } =
    registerBobySchema.parse(request.body)

  // try {
  // } catch (err) {
  //   throw err
  // }

  return reply
    .status(201)
    .send({ address, email, responsible, password, whatsapp, zipcode })
}

/**
 * nome do responsável
e mail
cep
endereco
Whatsapp
Senha
 */
