import { compare } from 'bcryptjs'

import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'
import { RegisterOrgUseCase } from './register-org'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgUseCase

describe('Register Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should be able to register org', async () => {
    const { org } = await sut.execute({
      email: 'johndoe@email.com',
      responsible: 'John Doe',
      password: '123456',
      address: 'Rua 1',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '12345678',
      whatsapp: '11999999999',
      longitude: -22.7807984,
      latitude: -43.3046486,
      orgName: 'Dog & Cat Heroes Company',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should hash org password upon registration', async () => {
    const { org } = await sut.execute({
      email: 'johndoe@email.com',
      responsible: 'John Doe',
      password: '123456',
      address: 'Rua 1',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '12345678',
      whatsapp: '11999999999',
      orgName: 'Dog & Cat Heroes Company',
      longitude: -22.7807984,
      latitude: -43.3046486,
    })

    const isPasswordCorrectlyHashed = await compare('123456', org.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register to same email twice', async () => {
    const email = 'johndoe@exmple.com'
    await sut.execute({
      email,
      responsible: 'John Doe',
      password: '123456',
      address: 'Rua 1',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '12345678',
      whatsapp: '11999999999',
      orgName: 'Dog & Cat Heroes Company',
      longitude: -22.7807984,
      latitude: -43.3046486,
    })

    // Implicit return funtion on expect | arrow function without {}
    await expect(() =>
      sut.execute({
        email,
        responsible: 'John Doe',
        password: '123456',
        address: 'Rua 1',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '12345678',
        whatsapp: '11999999999',
        orgName: 'Dog & Cat Heroes Company',
        longitude: -22.7807984,
        latitude: -43.3046486,
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
