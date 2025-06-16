import { OrgAlreadyExistsError } from '@/use-cases/errors/org-already-exists-error'
import { makeRegisterOrgUseCase } from '@/use-cases/factories/make-register-org-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBobySchema = z.object({
    orgName: z.string(),
    responsible: z.string(),
    zipCode: z.string().min(8),
    address: z.string(),
    whatsapp: z.string().min(11),
    email: z.string().email(),
    password: z.string().min(6),
    city: z.string(),
    state: z.string(),
  })

  const {
    city,
    orgName,
    state,
    address,
    email,
    responsible,
    password,
    whatsapp,
    zipCode,
  } = registerBobySchema.parse(request.body)

  try {
    const registerOrgsUseCase = makeRegisterOrgUseCase()

    const { org } = await registerOrgsUseCase.execute({
      city,
      orgName,
      state,
      address,
      email,
      responsible,
      password,
      whatsapp,
      zipCode,
    })

    return reply.status(201).send({ orgId: org.id })
  } catch (err) {
    if (err instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }
}
