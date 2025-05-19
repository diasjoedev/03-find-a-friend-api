import { Org, Prisma } from '@prisma/client'
import { OrgsRepository } from '../orgs-repository'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email)
    return org ?? null
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = {
      id: data.id ?? 'default-id',
      orgName: data.orgName,
      responsible: data.responsible,
      zipCode: data.zipCode,
      address: data.address,
      city: data.city,
      state: data.state,
      whatsapp: data.whatsapp,
      email: data.email,
      password_hash: data.password_hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(org)

    return org
  }
}
