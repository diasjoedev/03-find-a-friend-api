import { OrgsRepository } from '@/repositories/orgs-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { Pet, PetEnergy, PetEnvironment, PetSize } from '@prisma/client'

interface GetPetsByCitiesUseCaseRequest {
  city: string
  page: number
  energy?: PetEnergy
  environment?: PetEnvironment
  size?: PetSize
}

interface GetPetsByCitiesUseCaseResponse {
  pets: Pet[] | null
}

export class GetPetsByCitiesUseCase {
  constructor(
    private orgsRepository: OrgsRepository,
    private petsRepository: PetsRepository,
  ) {}

  async execute({
    city,
    page,
    energy,
    environment,
    size,
  }: GetPetsByCitiesUseCaseRequest): Promise<GetPetsByCitiesUseCaseResponse> {
    const orgs = await this.orgsRepository.findByCity(city)

    const orgsIds = orgs.map((org) => org.id)
    const pets = await this.petsRepository.findByOrganizations(orgsIds, page, {
      energy,
      environment,
      size,
    })

    return { pets }
  }
}
