import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterPetUseCase } from './register-pet'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: RegisterPetUseCase

describe('Register Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterPetUseCase(petsRepository)

    orgsRepository.items.push({
      id: 'org-01',
      address: 'R. Dr. Manoel Reis, 175 - Vila Meriti',
      city: 'Duque de Caxias',
      state: 'RJ',
      email: 'contato@casapet.com',
      responsible: 'Jobson da Silva',
      whatsapp: '219700010000',
      zipCode: '00000123',
      orgName: 'Casa dos Pets2',
      password_hash: 'teste23',
      latitude: new Decimal(-22.7808735),
      longitude: new Decimal(-43.3161669),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })

  it('should be able to register a pet', async () => {
    const { pet } = await sut.execute({
      name: 'Farofa',
      description: 'Cachorro muito calmo e amigável',
      energy: 'NORMAL',
      environment: 'Apartamento',
      size: 'Médio',
      photos: ['photo1.jpg', 'photo2.jpg'],
      requirementsForAdoption: ['Ter espaço', 'Ser responsável'],
      orgId: 'org-01',
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.name).toBe('Farofa')
    expect(pet.description).toBe('Cachorro muito calmo e amigável')
    expect(pet.energy).toBe('NORMAL')
    expect(pet.environment).toBe('Apartamento')
    expect(pet.size).toBe('Médio')
    expect(pet.photos).toEqual(['photo1.jpg', 'photo2.jpg'])
    expect(pet.requirementsForAdoption).toEqual([
      'Ter espaço',
      'Ser responsável',
    ])
    expect(pet.orgId).toBe('org-01')
  })

  it('should be able to register multiple pets for the same org', async () => {
    const petsData = [
      {
        name: 'Rex',
        description: 'Cachorro brincalhão',
        energy: 'HIGH' as const,
        environment: 'Casa',
        size: 'Grande',
        photos: ['rex1.jpg'],
        requirementsForAdoption: ['Ter espaço'],
        orgId: 'org-01',
      },
      {
        name: 'Luna',
        description: 'Gata tranquila',
        energy: 'LOW' as const,
        environment: 'Apartamento',
        size: 'Pequeno',
        photos: ['luna1.jpg', 'luna2.jpg'],
        requirementsForAdoption: ['Ser paciente'],
        orgId: 'org-01',
      },
      {
        name: 'Thor',
        description: 'Cachorro protetor',
        energy: 'VERY_HIGH' as const,
        environment: 'Casa com quintal',
        size: 'Grande',
        photos: ['thor1.jpg', 'thor2.jpg', 'thor3.jpg'],
        requirementsForAdoption: ['Ter experiência', 'Ter espaço grande'],
        orgId: 'org-01',
      },
    ]

    const pets = []

    for (const petData of petsData) {
      const { pet } = await sut.execute(petData)
      pets.push(pet)
    }

    expect(pets).toHaveLength(3)
    expect(pets[0].name).toBe('Rex')
    expect(pets[1].name).toBe('Luna')
    expect(pets[2].name).toBe('Thor')
    expect(pets.every((pet) => pet.orgId === 'org-01')).toBe(true)
  })

  it('should generate unique IDs for each pet', async () => {
    const { pet: pet1 } = await sut.execute({
      name: 'Pet 1',
      description: 'Primeiro pet',
      energy: 'NORMAL',
      environment: 'Casa',
      size: 'Médio',
      photos: ['photo1.jpg'],
      requirementsForAdoption: ['Responsabilidade'],
      orgId: 'org-01',
    })

    const { pet: pet2 } = await sut.execute({
      name: 'Pet 2',
      description: 'Segundo pet',
      energy: 'HIGH',
      environment: 'Apartamento',
      size: 'Pequeno',
      photos: ['photo2.jpg'],
      requirementsForAdoption: ['Paciência'],
      orgId: 'org-01',
    })

    expect(pet1.id).not.toBe(pet2.id)
    expect(pet1.id).toEqual(expect.any(String))
    expect(pet2.id).toEqual(expect.any(String))
  })
})
