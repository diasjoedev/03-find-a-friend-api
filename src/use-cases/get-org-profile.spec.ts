import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetOrgProfileUseCase } from './get-org-profile'

let orgsRepository: InMemoryOrgsRepository
let sut: GetOrgProfileUseCase

describe('Get Org Profile Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new GetOrgProfileUseCase(orgsRepository)
  })

  it('should be able to get org profile', async () => {
    const createOrg = await orgsRepository.create({
      address: 'Rua dos Bobos, 0',
      email: 'teste@teste.com',
      responsible: 'Jobson da Silva',
      whatsapp: '1234567890',
      zipCode: '00000123',
      orgName: 'Casa dos Pets2',
      city: 'Duque de Caxias',
      state: 'Rio de Janeiro',
      password_hash: 'teste23',
      longitude: -22.7807984,
      latitude: -43.3046486,
    })

    const { org } = await sut.execute({
      orgId: createOrg.id,
    })

    expect(org.id).toEqual(expect.any(String))
    expect(org.orgName).toBe('Casa dos Pets2')
  })

  it('should not be able to get user profile with wrong ID', async () => {
    await expect(() =>
      sut.execute({ orgId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
