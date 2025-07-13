import { makeGetPetsByCitiesUseCase } from '@/use-cases/factories/make-pets-by-cities-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function petsByCity(request: FastifyRequest, reply: FastifyReply) {
  const getPetByCityParamsSchema = z.object({
    city: z.string(),
    page: z.coerce.number().min(1).default(1),
    energy: z
      .enum(['VERY_LOW', 'LOW', 'NORMAL', 'HIGH', 'VERY_HIGH'])
      .optional(),
    environment: z
      .enum([
        'SPACIOUS_INDOOR',
        'SPACIOUS_OUTDOOR',
        'SMALL_INDOOR',
        'SMALL_OUTDOOR',
        'MEDIUM_INDOOR',
        'MEDIUM_OUTDOOR',
        'LARGE_INDOOR',
        'LARGE_OUTDOOR',
      ])
      .optional(),
    size: z
      .enum(['VERY_SMALL', 'SMALL', 'MEDIUM', 'LARGE', 'VERY_LARGE'])
      .optional(),
  })
  const { city, page, energy, environment, size } =
    getPetByCityParamsSchema.parse(request.query)

  

  try {
    const getPetsByCitiesUseCase = makeGetPetsByCitiesUseCase()

    const { pets } = await getPetsByCitiesUseCase.execute({
      city,
      page,
      energy,
      environment,
      size,
    })

    return reply.status(200).send(pets)
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message })
    }
    return reply.status(400).send({ message: 'Erro interno do servidor' })
  }
}
