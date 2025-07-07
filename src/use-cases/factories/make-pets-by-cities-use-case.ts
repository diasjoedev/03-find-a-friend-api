import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { GetPetsByCitiesUseCase } from '../get-pets-by-cities'

export function makeGetPetsByCitiesUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const petsRepository = new PrismaPetsRepository()
  const useCase = new GetPetsByCitiesUseCase(orgsRepository, petsRepository)

  return useCase
}
