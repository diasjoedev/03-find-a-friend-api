# Configuração de Testes

Este projeto está configurado com dois tipos de testes separados usando a funcionalidade de **projetos** do Vitest:

## Testes Unitários (Use Cases)

Os testes unitários estão localizados na pasta `src/use-cases/` e testam a lógica de negócio isoladamente.

### Comandos para executar testes unitários:

```bash
# Executar todos os testes unitários
npm run test

# Executar testes unitários em modo watch
npm run test:watch
```

### Configuração:
- Projeto: `unit`
- Ambiente: `node`
- Localização: `src/use-cases/**/*.spec.ts`

## Testes E2E (Controllers)

Os testes e2e estão localizados na pasta `src/http/controllers/` e testam a integração completa entre controllers, use cases e banco de dados.

### Comandos para executar testes e2e:

```bash
# Executar todos os testes e2e
npm run test:e2e

# Executar testes e2e em modo watch
npm run test:e2e:watch
```

### 🛠️ Configuração

- Projeto: `e2e`
- Ambiente: customizado (arquivo: `prisma/vitest-environment-prisma/prisma-test-environment.ts`)
- Localização: `src/http/controllers/**/*.spec.ts`

## Executar todos os testes

```bash
# Executar todos os testes (unitários + e2e)
npm run test:all

# Executar todos os testes em modo watch
npm run test:all:watch
```

## 🗂️ Estrutura de Testes

### Testes Unitários

- Testam use cases isoladamente
- Usam repositórios em memória
- Não dependem de banco de dados
- Focam na lógica de negócio
- Ambiente: `node`

### Testes E2E

- Testam controllers completos
- Usam banco de dados real (Prisma)
- Testam integração HTTP
- Focam no comportamento da API
- Ambiente: customizado (arquivo: `prisma/vitest-environment-prisma/prisma-test-environment.ts`)

## 🛠️ Configuração dos Projetos

O projeto usa a funcionalidade de **projetos** do Vitest, definida no arquivo `vite.config.mts`:

```typescript
test: {
  globals: true,
  coverage: { all: false },
  projects: [
    {
      extends: true,
      test: {
        name: 'unit',
        include: ['src/use-cases/**/*.spec.ts'],
        environment: 'node',
      },
    },
    {
      extends: true,
      test: {
        name: 'e2e',
        include: ['src/http/controllers/**/*.spec.ts'],
        environment:
          './prisma/vitest-environment-prisma/prisma-test-environment.ts',
      },
    },
  ],
}
```

> **Nota:** O ambiente dos testes E2E é um arquivo customizado TypeScript, responsável por criar e destruir schemas de banco de dados isolados para cada execução de teste. Veja o arquivo `prisma/vitest-environment-prisma/prisma-test-environment.ts` para detalhes.

## 📋 Exemplo de Teste E2E

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { app } from '@/app'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

describe('Authenticate Controller (E2E)', () => {
  beforeEach(async () => {
    await prisma.org.deleteMany()
  })

  afterEach(async () => {
    await prisma.org.deleteMany()
  })

  it('should be able to authenticate an organization', async () => {
    // Setup
    await prisma.org.create({
      data: {
        orgName: 'Test Organization',
        responsible: 'John Doe',
        zipCode: '12345-678',
        address: 'Test Address',
        city: 'Test City',
        state: 'SP',
        whatsapp: '123456789',
        email: 'test@example.com',
        password_hash: await hash('123456', 6),
        latitude: -23.5505,
        longitude: -46.6333,
      },
    })

    // Test
    const response = await app.inject({
      method: 'POST',
      url: '/sessions',
      payload: {
        email: 'test@example.com',
        password: '123456',
      },
    })

    // Assertions
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
      token: expect.any(String),
    })
  })
})
```

## ✅ Vantagens da Configuração com Projetos

1. **Separação clara**: Testes unitários e e2e são executados separadamente
2. **Ambientes específicos**: Cada tipo de teste usa o ambiente mais adequado (incluindo ambiente customizado para E2E)
3. **Performance**: Execução otimizada para cada tipo de teste
4. **Flexibilidade**: Possibilidade de executar apenas um tipo de teste
5. **Manutenibilidade**: Configuração centralizada e organizada 