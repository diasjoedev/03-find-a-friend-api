import { OrgsRepository } from '@/repositories/orgs-repository'
import { Org } from '@prisma/client'
import { hash } from 'bcryptjs'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

interface RegisterOrgUseCaseRequest {
  orgName: string
  responsible: string
  zipCode: string
  address: string
  city: string
  state: string
  whatsapp: string
  email: string
  password: string
}

interface RegisterOrgUseCaseResponse {
    org: Org
}

export class RegisterOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}
// TODO: write tests for this use case
  async execute({  responsible,
    orgName,
    zipCode,
    address,
    city,
    state,
    whatsapp,
    email,
    password }: RegisterOrgUseCaseRequest):Promise<RegisterOrgUseCaseResponse> {
    
    const password_hash = await hash(password, 6)
    const existingOrg = await this.orgsRepository.findByEmail(email)
    
    if (existingOrg) { 
        throw new OrgAlreadyExistsError()
    }

    const org = await this.orgsRepository.create({
      responsible,
      orgName,
      zipCode,
      address,
      city,
      state,
      whatsapp,
      email,
      password_hash
    })

    return {
      org
    }
  }
}
