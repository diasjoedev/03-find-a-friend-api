import { Pet, PetEnergy, PetEnvironment, PetSize, Prisma } from '@prisma/client'

export interface PetFilters {
  energy?: PetEnergy
  environment?: PetEnvironment
  size?: PetSize
}

export interface PetsRepository {
  create(data: Prisma.PetCreateInput): Promise<Pet>
  findById(id: string): Promise<Pet | null>
  findByOrganizations(
    orgs: string[],
    page?: number,
    filters?: PetFilters,
  ): Promise<Pet[] | null>
  findMany(): Promise<Pet[]>
}
