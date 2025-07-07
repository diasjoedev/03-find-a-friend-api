import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetPetDetailsUseCase } from './get-pet-details'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: GetPetDetailsUseCase

describe('Get Pet Details Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()

    sut = new GetPetDetailsUseCase(petsRepository)

    orgsRepository.items.push({
      id: 'org-01',
      orgName: 'Pet Adoption Org 01',
      email: 'org1@example.com',
      password_hash: '147258369',
      address: '123 Main St',
      responsible: 'Responsible Org 1',
      zipCode: '123456',
      city: 'Duque de Caxias',
      state: 'RJ',
      whatsapp: '21999999999',
      createdAt: new Date(),
      updatedAt: new Date(),
      latitude: new Decimal(-22.7808735),
      longitude: new Decimal(-43.3161669),
    })
  })

  it('should be able to get pet details', async () => {
    const createPet = await petsRepository.create({
      name: 'Alfredo',
      description:
        'Eu sou um lindo doguinho de 3 anos, um jovem bricalhão que adora fazer companhia, uma bagunça mas também ama uma soneca.',
      energy: 'HIGH',
      environment: 'SMALL_INDOOR',
      size: 'SMALL',
      photos: ['url1', 'url2'],
      requirementsForAdoption: [
        'Ter espaço',
        'Ser responsável',
        'Não se importar com pelos',
      ],
      org: {
        connect: {
          id: 'org-01',
        },
      },
    })

    const { pet } = await sut.execute({
      petId: createPet.id,
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.name).toBe('Alfredo')
  })

  it('should not be able to get pet details with wrong ID', async () => {
    await expect(() =>
      sut.execute({ petId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
