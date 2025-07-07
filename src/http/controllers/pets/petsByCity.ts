import { makeGetPetsByCitiesUseCase } from '@/use-cases/factories/make-pets-by-cities-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function petsByCity(request: FastifyRequest, reply: FastifyReply) {
  const getPetByCityParamsSchema = z.object({
    city: z.string(),
    page: z.coerce.number().min(1).default(1),
  })
  const { city, page } = getPetByCityParamsSchema.parse(request.query)
 
  console.log(city)

  try {
    const getPetsByCitiesUseCase = makeGetPetsByCitiesUseCase()

    const { pets } = await getPetsByCitiesUseCase.execute({ city, page })

    return reply.status(200).send(pets)
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message })
    }
    return reply.status(400).send({ message: 'Erro interno do servidor' })
  }
}
