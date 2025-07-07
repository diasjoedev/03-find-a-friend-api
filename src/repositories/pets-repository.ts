import { Pet, Prisma } from '@prisma/client'
export interface PetsRepository {
  create(data: Prisma.PetCreateInput): Promise<Pet>
  findById(id: string):Promise<Pet|null>
  findByOrganizations(orgs:string[], page?: number):Promise<Pet[]|null>
  findMany():Promise<Pet[]>
}
