import { Pet, Prisma } from '@prisma/client'
import { PetsRepository } from '../pets-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async create(data: Prisma.PetCreateInput) {
    const pet = {
      id: data.id ?? 'default-id',
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
