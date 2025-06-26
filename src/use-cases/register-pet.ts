import { PetsRepository } from '@/repositories/pets-repository'
import { Pet, PetEnergy } from '@prisma/client'

interface RegisterPetUseCaseRequest {
  name: string
  photos: string[]
  description: string
  energy: PetEnergy
  environment: string
  size: string
  requirementsForAdoption: string[]
  orgId: string
}

interface RegisterPetUseCaseResponse {
  pet: Pet
}

export class RegisterPetUseCase {
  constructor(private petsRepository: PetsRepository) {}
  // TODO: write tests for this use case
  async execute({
    name,
    description,
    energy,
    environment,
    orgId,
    photos,
    requirementsForAdoption,
    size,
  }: RegisterPetUseCaseRequest): Promise<RegisterPetUseCaseResponse> {
    const pet = await this.petsRepository.create({
      name,
      description,
      energy,
      environment,
      org: {
        connect: {
          id: orgId,
        },
      },
      photos,
      requirementsForAdoption,
      size,
    })

    return {
      pet,
    }
  }
}
