import { OrgsRepository } from '@/repositories/orgs-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface GetPetsByCitiesUseCaseRequest {
  city: string
  page: number
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
    page
  }: GetPetsByCitiesUseCaseRequest): Promise<GetPetsByCitiesUseCaseResponse> {
    const orgs = await this.orgsRepository.findByCity(city)

    const orgsIds = orgs.map((org) => org.id)
    const pets = await this.petsRepository.findByOrganizations(orgsIds, page)

    return { pets }
  }
}
