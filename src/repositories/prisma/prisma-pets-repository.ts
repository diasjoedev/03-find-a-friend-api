import { prisma } from '@/lib/prisma'
import { Pet, Prisma } from '@prisma/client'
import { PetFilters, PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })
    return pet
  }

  async create(data: Prisma.PetCreateInput) {
    const pet = await prisma.pet.create({ data })
    return pet
  }

  async findMany(): Promise<Pet[]> {
    const pets = await prisma.pet.findMany()
    return pets
  }

  async findByOrganizations(
    orgs: string[],
    page: number = 1,
    filters?: PetFilters,
  ): Promise<Pet[] | null> {
    const whereClause: Prisma.PetWhereInput = {
      orgId: {
        in: orgs,
      },
    }

    // Adicionar filtros se fornecidos
    if (filters) {
      if (filters.energy) {
        whereClause.energy = filters.energy
      }
      if (filters.environment) {
        whereClause.environment = filters.environment
      }
      if (filters.size) {
        whereClause.size = filters.size
      }
    }

    const pets = await prisma.pet.findMany({
      where: whereClause,
    })

    if (pets.length <= 0) return null

    const paginatedPets = pets.slice((page - 1) * 20, page * 20)
    return paginatedPets
  }
}
