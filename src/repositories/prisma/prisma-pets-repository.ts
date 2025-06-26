import { prisma } from '@/lib/prisma'
import { Pet, Prisma } from '@prisma/client'
import { PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async create(data: Prisma.PetCreateInput) {
    const pet = await prisma.pet.create({ data })
    return pet
  }

  
  async findMany(): Promise<Pet[]> {
    const pets = await prisma.pet.findMany()
    return pets
  }
}
