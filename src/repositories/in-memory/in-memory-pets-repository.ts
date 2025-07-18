import { Pet, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { PetFilters, PetsRepository } from '../pets-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async findByOrganizations(
    orgs: string[],
    page: number = 1,
    filters?: PetFilters,
  ) {
    const orgIdSet = new Set(orgs)

    let filteredPets = this.items.filter((pet) => orgIdSet.has(pet.orgId))

    // Aplicar filtros se fornecidos
    if (filters) {
      if (filters.energy) {
        filteredPets = filteredPets.filter(
          (pet) => pet.energy === filters.energy,
        )
      }
      if (filters.environment) {
        filteredPets = filteredPets.filter(
          (pet) => pet.environment === filters.environment,
        )
      }
      if (filters.size) {
        filteredPets = filteredPets.filter((pet) => pet.size === filters.size)
      }
    }

    return filteredPets.slice((page - 1) * 20, page * 20)
  }

  async findById(id: string) {
    const pet = this.items.find((pet) => pet.id === id)
    return pet ?? null
  }

  async create(data: Prisma.PetCreateInput) {
    const pet = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description,
      energy: data.energy,
      environment: data.environment,
      size: data.size,
      photos: data.photos as string[],
      requirementsForAdoption: data.requirementsForAdoption as string[],
      orgId: data.org.connect?.id ?? '',
    }

    this.items.push(pet)
    return pet
  }

  async findMany(): Promise<Pet[]> {
    return this.items
  }
}
