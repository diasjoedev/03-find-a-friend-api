import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetPetsByCitiesUseCase } from './get-pets-by-cities'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: GetPetsByCitiesUseCase

describe('Get Pets By Cities Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()

    sut = new GetPetsByCitiesUseCase(orgsRepository, petsRepository)

    // Criar organizações de teste
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

    orgsRepository.items.push({
      id: 'org-02',
      orgName: 'Pet Adoption Org 02',
      email: 'org2@example.com',
      password_hash: '147258369',
      address: '456 Second St',
      responsible: 'Responsible Org 2',
      zipCode: '654321',
      city: 'Duque de Caxias',
      state: 'RJ',
      whatsapp: '21988888888',
      createdAt: new Date(),
      updatedAt: new Date(),
      latitude: new Decimal(-22.7808735),
      longitude: new Decimal(-43.3161669),
    })

    orgsRepository.items.push({
      id: 'org-03',
      orgName: 'Pet Adoption Org 03',
      email: 'org3@example.com',
      password_hash: '147258369',
      address: '789 Third St',
      responsible: 'Responsible Org 3',
      zipCode: '987654',
      city: 'Rio de Janeiro',
      state: 'RJ',
      whatsapp: '21977777777',
      createdAt: new Date(),
      updatedAt: new Date(),
      latitude: new Decimal(-22.9068),
      longitude: new Decimal(-43.1729),
    })
  })

  it('should be able to get pets by city', async () => {
    // Criar pets para a primeira organização
    await petsRepository.create({
      name: 'Alfredo',
      description: 'Um lindo doguinho de 3 anos',
      energy: 'HIGH',
      environment: 'SMALL_INDOOR',
      size: 'SMALL',
      photos: ['url1', 'url2'],
      requirementsForAdoption: ['Ter espaço', 'Ser responsável'],
      org: {
        connect: {
          id: 'org-01',
        },
      },
    })

    await petsRepository.create({
      name: 'Luna',
      description: 'Uma gatinha carinhosa',
      energy: 'NORMAL',
      environment: 'SMALL_INDOOR',
      size: 'SMALL',
      photos: ['url3', 'url4'],
      requirementsForAdoption: ['Casa com telas'],
      org: {
        connect: {
          id: 'org-02',
        },
      },
    })

    // Criar pet para organização de outra cidade
    await petsRepository.create({
      name: 'Thor',
      description: 'Um cachorro grande e brincalhão',
      energy: 'HIGH',
      environment: 'LARGE_INDOOR',
      size: 'LARGE',
      photos: ['url5', 'url6'],
      requirementsForAdoption: ['Casa grande', 'Tempo para exercícios'],
      org: {
        connect: {
          id: 'org-03',
        },
      },
    })

    const { pets } = await sut.execute({
      city: 'Duque de Caxias',
      page: 1,
    })

    expect(pets).toHaveLength(2)
    expect(pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Alfredo' }),
        expect.objectContaining({ name: 'Luna' }),
      ]),
    )
  })

  it('should return empty array when no pets found in city', async () => {
    const { pets } = await sut.execute({
      city: 'São Paulo',
      page: 1,
    })

    expect(pets).toHaveLength(0)
  })

  it('should return empty array when city does not exist', async () => {
    const { pets } = await sut.execute({
      city: 'Cidade Inexistente',
      page: 1,
    })

    expect(pets).toHaveLength(0)
  })

  it('it should be possible to filter pets by their characteristics', async () => {
    // Criar pets para a primeira organização
    await petsRepository.create({
      name: 'Alfredinho',
      description: 'Um lindo doguinho de 3 anos',
      energy: 'HIGH',
      environment: 'SMALL_INDOOR',
      size: 'MEDIUM',
      photos: ['url1', 'url2'],
      requirementsForAdoption: ['Ter espaço', 'Ser responsável'],
      org: {
        connect: {
          id: 'org-01',
        },
      },
    })

    await petsRepository.create({
      name: 'Luna',
      description: 'Uma gatinha carinhosa',
      energy: 'NORMAL',
      environment: 'SMALL_INDOOR',
      size: 'SMALL',
      photos: ['url3', 'url4'],
      requirementsForAdoption: ['Casa com telas'],
      org: {
        connect: {
          id: 'org-01',
        },
      },
    })

    // Criar pet para organização de outra cidade
    await petsRepository.create({
      name: 'Thor',
      description: 'Um cachorro grande e brincalhão',
      energy: 'HIGH',
      environment: 'LARGE_INDOOR',
      size: 'LARGE',
      photos: ['url5', 'url6'],
      requirementsForAdoption: ['Casa grande', 'Tempo para exercícios'],
      org: {
        connect: {
          id: 'org-01',
        },
      },
    })

    const { pets } = await sut.execute({
      city: 'Duque de Caxias',
      page: 1,
      size: 'MEDIUM',
      energy: 'HIGH',
      environment: 'SMALL_INDOOR'
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Alfredinho' }),
      ]),
    )
  })

  it('should handle pagination correctly', async () => {
    // Criar mais de 20 pets para testar paginação
    for (let i = 1; i <= 25; i++) {
      await petsRepository.create({
        name: `Pet ${i}`,
        description: `Descrição do pet ${i}`,
        energy: 'NORMAL',
        environment: 'SMALL_INDOOR',
        size: 'SMALL',
        photos: [`url${i}`],
        requirementsForAdoption: ['Responsabilidade'],
        org: {
          connect: {
            id: 'org-01',
          },
        },
      })
    }

    const { pets: firstPage } = await sut.execute({
      city: 'Duque de Caxias',
      page: 1,
    })

    const { pets: secondPage } = await sut.execute({
      city: 'Duque de Caxias',
      page: 2,
    })

    expect(firstPage).toHaveLength(20)
    expect(secondPage).toHaveLength(5)
  })

  it('should return empty array for invalid page number', async () => {
    const { pets } = await sut.execute({
      city: 'Duque de Caxias',
      page: 999,
    })

    expect(pets).toHaveLength(0)
  })
})
