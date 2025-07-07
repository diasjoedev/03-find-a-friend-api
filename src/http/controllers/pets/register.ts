import { makeRegisterPetUseCase } from '@/use-cases/factories/make-register-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'


export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerPetBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    energy: z.enum(['VERY_LOW', 'LOW', 'NORMAL', 'HIGH', 'VERY_HIGH']),
    environment: z.enum([
      'SPACIOUS_INDOOR',
      'SPACIOUS_OUTDOOR',
      'SMALL_INDOOR',
      'SMALL_OUTDOOR',
      'MEDIUM_INDOOR',
      'MEDIUM_OUTDOOR',
      'LARGE_INDOOR',
      'LARGE_OUTDOOR',
    ]),
    photos: z.array(z.string()),
    requirementsForAdoption: z.array(z.string()),
    size: z.enum(['VERY_SMALL', 'SMALL', 'MEDIUM', 'LARGE', 'VERY_LARGE']),
  })

  const {
    name,
    description,
    energy,
    environment,
    photos,
    requirementsForAdoption,
    size,
  } = registerPetBodySchema.parse(request.body)

  try {
    const registerPetUseCase = makeRegisterPetUseCase()

    const { pet } = await registerPetUseCase.execute({
      name,
      description,
      energy,
      environment,
      orgId: request.user.sub,
      photos,
      requirementsForAdoption,
      size,
    })

    return reply.status(201).send({ ...pet })
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message })
    }
    return reply.status(400).send({ message: 'Erro interno do servidor' })
  }
}
