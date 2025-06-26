import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { orgsRoutes } from './http/controllers/orgs/routes'
import { petsRoutes } from './http/controllers/pets/routes'

export const app = fastify()
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: '10m' },
  cookie: { cookieName: 'refreshToken', signed: false },
})
app.register(fastifyCookie)

app.register(orgsRoutes)
app.register(petsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    console.log(error.format())
    return reply.status(400).send({
      message: 'Validation Error',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to external tool link Datadog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
