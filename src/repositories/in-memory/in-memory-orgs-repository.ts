import { Org, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { OrgsRepository } from '../orgs-repository'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findByCity(city: string): Promise<Org[]> {
    const orgs = this.items.filter((item) => item.city === city)
    return orgs
  }

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email)
    return org ?? null
  }

  async findById(id: string): Promise<Org | null> {
    const org = this.items.find((item) => item.id === id)
    return org ?? null
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = {
      id: data.id ?? randomUUID(),
      orgName: data.orgName,
      responsible: data.responsible,
      zipCode: data.zipCode,
      address: data.address,
      city: data.city,
      state: data.state,
      whatsapp: data.whatsapp,
      email: data.email,
      password_hash: data.password_hash,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(org)

    return org
  }
}
