import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-creadentials-error'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateUseCase(orgsRepository)
  })

  it('should be able to authenticate', async () => {
    await orgsRepository.create({
      address: 'Rua dos Bobos, 0',
      email: 'org1@example.com',
      responsible: 'Jobson da Silva',
      whatsapp: '21999999999',
      zipCode: '00000123',
      orgName: 'Casa dos Pets2',
      city: 'Duque de Caxias',
      state: 'Rio de Janeiro',
      password_hash: await hash('147258369', 6),
      longitude: -22.7807984,
      latitude: -43.3046486,
    })

    const { org } = await sut.execute({
      email: 'org1@example.com',
      password: '147258369',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({ email: 'wrong-email@example.com', password: '147258369' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await expect(() =>
      sut.execute({ email: 'org1@example.com', password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong email and password', async () => {
    await expect(() =>
      sut.execute({
        email: 'wrong-email@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
