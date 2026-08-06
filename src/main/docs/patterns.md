# Padrões

## Objetivo

Este documento define os padrões oficiais de organização, nomenclatura e implementação do Tech Challenge.

Ele deve responder:

- como nomeamos artefatos;
- onde cada artefato deve morar;
- como um fluxo deve ser montado;
- quais práticas são obrigatórias;
- quais desvios exigem correção.

Quando o código divergir destes padrões, o objetivo é ajustar o código ao padrão, e não rebaixar o padrão ao estado do código.

---

## 1. Organização do Código

### Regra oficial

- `domain` define negócio: modelos, contratos de use case;
- `data` implementa aplicação: use cases e contratos técnicos (protocolos de repositório);
- `infra` implementa integrações concretas: banco, cache, APIs externas;
- `presentation` orquestra entrada e saída: controllers;
- `main` compõe a aplicação: factories, rotas, adapters, configuração;
- `validation` centraliza validações reutilizáveis.

### Fluxo de dependência obrigatório

```
presentation → domain ← data ← infra
                              ↑
                             main (composição)
```

`main` conhece todas as camadas. Nenhuma outra camada conhece `main` ou `infra`.

### Obrigatório

- cada novo artefato deve nascer na camada correta;
- não usar conveniência local como justificativa para quebrar separação de camadas.

---

## 2. Nomenclatura por Camada

Referência rápida de como nomear cada artefato em cada camada.

| Camada                       | Artefato                  | Arquivo                                     | Nome da classe / interface / type  |
| ---------------------------- | ------------------------- | ------------------------------------------- | ---------------------------------- |
| `domain/models`              | Model                     | `{contexto}.ts`                             | `{Contexto}Model`                  |
| `domain/usecases`            | Contrato de use case      | `{acao}-{contexto}.ts`                      | `{Acao}{Contexto}`                 |
| `data/usecases`              | Implementação de use case | `{acao}-{contexto}-impl.ts`                 | `{Acao}{Contexto}Impl`             |
| `data/protocols`             | Contrato de repositório   | `{acao}-{contexto}-repository.ts`           | `{Acao}{Contexto}Repository`       |
| `presentation/controllers`   | Controller                | `{acao}-{contexto}-controller.ts`           | `{Acao}{Contexto}Controller`       |
| `infra`                      | Repositório concreto      | `{contexto}-{tecnologia}-repository.ts`     | `{Contexto}{Tecnologia}Repository` |
| `main/factories/controllers` | Factory de controller     | `{acao}-{contexto}-controller-factory.ts`   | `make{Acao}{Contexto}Controller`   |
| `main/factories/controllers` | Factory de validation     | `{acao}-{contexto}-validation-factory.ts`   | `make{Acao}{Contexto}Validation`   |
| `main/factories/usecases`    | Factory de use case       | `{tecnologia}-{acao}-{contexto}-factory.ts` | `make{Tecnologia}{Acao}{Contexto}` |
| `main/routes`                | Rotas                     | `{modulo}-routes.ts`                        | — (export default function)        |

> Segmentos compostos por mais de uma palavra permanecem em `kebab-case` no arquivo e em `PascalCase` concatenado no nome da classe.
>
> Exemplo: `load-active-calls.ts` → interface `LoadActiveCalls`, implementação `LoadActiveCallsImpl`.

---

## 3. Modelos de Domínio

### Onde ficam

- `src/domain/models/`

### Nome do arquivo

- `{contexto}.ts`

### Nomenclatura

- type ou interface: `{Contexto}Model`

### Exemplos

```typescript
// src/domain/models/client.ts
export type ClientModel = {
  id: string
  name: string
  document: string // CPF ou CNPJ
  email?: string
  phone?: string
  createdAt: Date
}

// src/domain/models/vehicle.ts
export type VehicleModel = {
  id: string
  clientId: string
  plate: string
  brand: string
  model: string
  year: number
}

// src/domain/models/service-order.ts
export type ServiceOrderModel = {
  id: string
  protocol: string
  clientId: string
  vehicleId: string
  status: ServiceOrderStatus
  budgetTotal: number
  createdAt: Date
  updatedAt: Date
}

export type ServiceOrderStatus =
  | 'received'
  | 'diagnosing'
  | 'awaiting_approval'
  | 'in_progress'
  | 'finished'
  | 'delivered'
```

### Regra obrigatória

- modelos de domínio representam entidades do negócio;
- não adicionar dependências de camadas externas (infra, prisma) dentro do model.

---

## 4. Use Cases

### Onde ficam

- contrato: `src/domain/usecases/{modulo}/`
- implementação: `src/data/usecases/{modulo}/`

### Nome dos arquivos

- contrato: `{acao}-{contexto}.ts`
- implementação: `{acao}-{contexto}-impl.ts`

### Nomenclatura das classes

- contrato (interface): `{Acao}{Contexto}` — sem sufixo
- implementação (class): `{Acao}{Contexto}Impl`

### Exemplos

```typescript
// src/domain/usecases/service-order/add-service-order.ts
export interface AddServiceOrder {
  add: (data: AddServiceOrder.Params) => Promise<AddServiceOrder.Result>
}

export namespace AddServiceOrder {
  export type Params = {
    clientId: string
    vehicleId: string
    serviceIds: string[]
    partIds: string[]
  }
  export type Result = {
    id: string
    protocol: string
    budgetTotal: number
  }
}
```

```typescript
// src/data/usecases/service-order/add-service-order-impl.ts
import { AddServiceOrder } from '@/domain/usecases'
import {
  AddServiceOrderRepository,
  CreateProtocolRepository,
} from '@/data/protocols'

export class AddServiceOrderImpl implements AddServiceOrder {
  constructor(
    private readonly addServiceOrderRepository: AddServiceOrderRepository,
    private readonly createProtocolRepository: CreateProtocolRepository
  ) {}

  async add(data: AddServiceOrder.Params): Promise<AddServiceOrder.Result> {
    const { protocol } = await this.createProtocolRepository.create({
      clientId: data.clientId,
    })
    return this.addServiceOrderRepository.addServiceOrder({
      ...data,
      protocol,
    })
  }
}
```

```typescript
// src/domain/usecases/service-order/load-active-service-orders.ts
export interface LoadActiveServiceOrders {
  loadActiveServiceOrders: (
    data: LoadActiveServiceOrders.Params
  ) => Promise<LoadActiveServiceOrders.Result>
}

export namespace LoadActiveServiceOrders {
  export type Params = { clientId?: string }
  export type Result = ServiceOrderModel[]
}
```

### Regra obrigatória

- nome do use case deve representar comportamento de negócio ou de aplicação;
- não embutir nome de provider ou tecnologia no use case sem necessidade arquitetural clara;
- use cases recebem apenas contratos (`interfaces`), nunca implementações concretas.

---

## 5. Protocols (Contratos de Repositório)

### Onde ficam

- `src/data/protocols/{modulo}/`

### Nome dos arquivos

- `{acao}-{contexto}-repository.ts`

### Nomenclatura das interfaces

- `{Acao}{Contexto}Repository`

### Exemplos

```typescript
// src/data/protocols/service-order/add-service-order-repository.ts
export interface AddServiceOrderRepository {
  addServiceOrder: (
    data: AddServiceOrderRepository.Params
  ) => Promise<AddServiceOrderRepository.Result>
}

export namespace AddServiceOrderRepository {
  export type Params = {
    clientId: string
    vehicleId: string
    protocol: string
    serviceIds: string[]
    partIds: string[]
  }
  export type Result = {
    id: string
    protocol: string
    budgetTotal: number
  }
}
```

```typescript
// src/data/protocols/service-order/load-service-order-by-id-repository.ts
export interface LoadServiceOrderByIdRepository {
  loadServiceOrderById: (
    data: LoadServiceOrderByIdRepository.Params
  ) => Promise<LoadServiceOrderByIdRepository.Result | null>
}

export namespace LoadServiceOrderByIdRepository {
  export type Params = { id: string }
  export type Result = ServiceOrderModel
}
```

```typescript
// src/data/protocols/service-order/update-service-order-status-repository.ts
export interface UpdateServiceOrderStatusRepository {
  updateServiceOrderStatus: (
    data: UpdateServiceOrderStatusRepository.Params
  ) => Promise<void>
}

export namespace UpdateServiceOrderStatusRepository {
  export type Params = {
    id: string
    status: ServiceOrderStatus
  }
}
```

### Regra obrigatória

- contratos de dependência técnica pertencem a `data/protocols`;
- não criar novo contrato técnico em `domain`;
- o método da interface deve ter o mesmo nome da ação (`addServiceOrder`, `loadServiceOrderById`, `updateServiceOrderStatus`).

---

## 6. Controllers

### Onde ficam

- `src/presentation/controllers/{modulo}/`

### Nome dos arquivos

- `{acao}-{contexto}-controller.ts`

### Nomenclatura das classes

- `{Acao}{Contexto}Controller`

### Estrutura obrigatória

```typescript
// src/presentation/controllers/service-order/add-service-order-controller.ts
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'
import { badRequest, serverError, ok } from '@/presentation/helpers'
import { AddServiceOrder } from '@/domain/usecases'

export class AddServiceOrderController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addServiceOrder: AddServiceOrder
  ) {}

  async handle(
    request: AddServiceOrderController.Request
  ): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)

      const serviceOrder = await this.addServiceOrder.add(request)

      return ok(serviceOrder)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace AddServiceOrderController {
  export type Request = {
    clientId: string
    vehicleId: string
    serviceIds: string[]
    partIds: string[]
  }
}
```

```typescript
// src/presentation/controllers/service-order/load-active-service-orders-controller.ts
export class LoadActiveServiceOrdersController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly loadActiveServiceOrders: LoadActiveServiceOrders
  ) {}

  async handle(
    request: LoadActiveServiceOrdersController.Request
  ): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)

      const serviceOrders =
        await this.loadActiveServiceOrders.loadActiveServiceOrders({
          clientId: request.clientId,
        })

      return ok(serviceOrders)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadActiveServiceOrdersController {
  export type Request = { clientId?: string }
}
```

### Responsabilidade obrigatória

Controllers devem:

- validar entrada via `Validation`;
- chamar o(s) use case(s) necessário(s);
- retornar resposta padronizada (`ok`, `noContent`, `badRequest`, `serverError`);
- definir o tipo `Request` no próprio namespace do controller.

Controllers não devem:

- conter regra de negócio;
- conhecer implementação concreta de infraestrutura;
- montar consulta de banco;
- concentrar transformação complexa que deveria ser adapter ou use case.

### Regra obrigatória

- o padrão preferencial para código novo é `{acao}-{contexto}-controller.ts`;
- controllers históricos com `handle-` podem existir, mas não definem a convenção para novos arquivos.

---

## 7. Factories

### Onde ficam

- controller factories: `src/main/factories/controllers/{modulo}/`
- use case factories: `src/main/factories/usecases/{modulo}/`

### Nome dos arquivos e das funções

| Tipo                                         | Arquivo                                     | Função exportada                   |
| -------------------------------------------- | ------------------------------------------- | ---------------------------------- |
| Factory de controller                        | `{acao}-{contexto}-controller-factory.ts`   | `make{Acao}{Contexto}Controller`   |
| Factory de validation                        | `{acao}-{contexto}-validation-factory.ts`   | `make{Acao}{Contexto}Validation`   |
| Factory de use case (tecnologia relevante)   | `{tecnologia}-{acao}-{contexto}-factory.ts` | `make{Tecnologia}{Acao}{Contexto}` |
| Factory de use case (tecnologia irrelevante) | `{acao}-{contexto}-factory.ts`              | `make{Acao}{Contexto}`             |

Prefixos de tecnologia em uso:

| Prefixo           | Quando usar                                             |
| ----------------- | ------------------------------------------------------- |
| `db-` / `make Db` | use case cuja persistência principal é banco relacional |

### Exemplos

```typescript
// src/main/factories/controllers/service-order/add-service-order-controller-factory.ts
import {
  makeAddServiceOrderValidation,
  makeDbAddServiceOrder,
} from '@/main/factories'
import { Controller } from '@/presentation/protocols'
import { AddServiceOrderController } from '@/presentation/controllers'

export const makeAddServiceOrderController = (): Controller => {
  return new AddServiceOrderController(
    makeAddServiceOrderValidation(),
    makeDbAddServiceOrder()
  )
}
```

```typescript
// src/main/factories/controllers/service-order/add-service-order-validation-factory.ts
import {
  AbstractClassValidator,
  AddServiceOrderDto,
} from '@/validation/validators'

export const makeAddServiceOrderValidation =
  (): AbstractClassValidator<AddServiceOrderDto> => {
    return new AbstractClassValidator(AddServiceOrderDto)
  }
```

```typescript
// src/main/factories/usecases/service-order/db-add-service-order-factory.ts
import { AddServiceOrder } from '@/domain/usecases'
import { ServiceOrderPrismaMysqlRepository } from '@/infra/db'
import { AddServiceOrderImpl } from '@/data/usecases'
import { makeDbCreateProtocol } from '@/main/factories/usecases'

export const makeDbAddServiceOrder = (): AddServiceOrder => {
  const serviceOrderRepository = new ServiceOrderPrismaMysqlRepository()
  const createProtocol = makeDbCreateProtocol()
  return new AddServiceOrderImpl(serviceOrderRepository, createProtocol)
}
```

```typescript
// src/main/factories/usecases/service-order/db-load-service-order-by-id-factory.ts
import { LoadServiceOrderById } from '@/domain/usecases'
import { ServiceOrderPrismaMysqlRepository } from '@/infra/db'
import { LoadServiceOrderByIdImpl } from '@/data/usecases'

export const makeDbLoadServiceOrderById = (): LoadServiceOrderById => {
  return new LoadServiceOrderByIdImpl(new ServiceOrderPrismaMysqlRepository())
}
```

### Regra obrigatória

- composição concreta de dependências acontece em `main`, nunca fora dele;
- tecnologia aparece no nome da factory de use case somente quando a distinção entre providers for relevante para a composição;
- a factory de controller não instancia repositórios diretamente — delega para factories de use case.

---

## 8. Validations

### Onde ficam

- validators reutilizáveis: `src/validation/validators/`
- factories de validação: `src/main/factories/controllers/{modulo}/`
- DTOs de validação: `src/validation/validators/class-validator-transformer/dtos/{modulo}/`

### Padrão oficial (novo)

As factories de validação devem instanciar `AbstractClassValidator` com o DTO do endpoint.

### Exemplo oficial

```typescript
// src/main/factories/controllers/client/add-client-validation-factory.ts
import { AbstractClassValidator, AddClientDto } from '@/validation/validators'

export const makeAddClientValidation =
  (): AbstractClassValidator<AddClientDto> => {
    return new AbstractClassValidator(AddClientDto)
  }
```

### Nomenclatura no padrão com DTO

- arquivo factory: `{acao}-{contexto}-validation-factory.ts`
- função factory: `make{Acao}{Contexto}Validation`
- DTO: `{Acao}{Contexto}Dto`
- classe validadora base: `AbstractClassValidator<{Acao}{Contexto}Dto>`

### Fluxo esperado

1. Controller recebe `Validation` via construtor.
2. Factory cria `new AbstractClassValidator(SeuDto)`.
3. No `validate(input)`, o validator transforma payload com `class-transformer`.
4. O validator executa regras do DTO via `class-validator`.
5. Em erro, retorna `Error` com mensagens consolidadas; sem erro, segue fluxo do controller.

### Exemplo de DTO

```typescript
// src/validation/validators/class-validator-transformer/dtos/client/add-client-dto.ts
import { IsString, IsNotEmpty, IsCPFOrCNPJ } from 'class-validator'

export class AddClientDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  @IsCPFOrCNPJ()
  document: string
}
```

> `@IsCPFOrCNPJ` é um decorator customizado a ser implementado em `src/validation/validators/`, exigido pelo desafio (validação de CPF/CNPJ). O mesmo padrão de validador customizado se aplica à placa de veículo (ex.: `@IsLicensePlate`, aceitando formatos Mercosul e antigo).

### Legado (transição)

Factories antigas com `ValidationComposite` e `ValidFieldValidation` podem permanecer enquanto não forem refatoradas, mas o padrão para código novo e ajustes finos é `AbstractClassValidator + DTO`.

### Regra oficial

- validações devem ser definidas por DTO + decorators (`class-validator`), com factory baseada em `AbstractClassValidator`;
- controllers devem receber a abstração `Validation`, nunca um validator concreto;
- validação de entrada não deve ser improvisada diretamente no controller.

---

## 9. Repositórios e Implementações Concretas

### Onde ficam

- `src/infra/db/prisma-mysql/` — repositórios MySQL via Prisma
- `src/infra/{servico}/` — demais integrações externas, caso surjam

### Nome dos arquivos

- `{contexto}-{tecnologia}-repository.ts`

### Nomenclatura das classes

- `{Contexto}{Tecnologia}Repository`

> Boa prática: o módulo deve usar o nome da entidade no singular.
>
> Exemplo: `service-order-prisma-mysql-repository.ts` e `ServiceOrderPrismaMysqlRepository`.

### Exemplos

```typescript
// src/infra/db/prisma-mysql/service-order-prisma-mysql-repository.ts
import {
  AddServiceOrderRepository,
  LoadServiceOrderByIdRepository,
  UpdateServiceOrderStatusRepository,
} from '@/data/protocols'

export class ServiceOrderPrismaMysqlRepository
  implements
    AddServiceOrderRepository,
    LoadServiceOrderByIdRepository,
    UpdateServiceOrderStatusRepository
{
  async addServiceOrder(data: AddServiceOrderRepository.Params): Promise<AddServiceOrderRepository.Result> { ... }
  async loadServiceOrderById(data: LoadServiceOrderByIdRepository.Params): Promise<ServiceOrderModel | null> { ... }
  async updateServiceOrderStatus(data: UpdateServiceOrderStatusRepository.Params): Promise<void> { ... }
}
```

```typescript
// src/infra/db/prisma-mysql/part-prisma-mysql-repository.ts
import {
  LoadPartByIdRepository,
  UpdatePartStockRepository,
} from '@/data/protocols'

export class PartPrismaMysqlRepository
  implements LoadPartByIdRepository, UpdatePartStockRepository
{
  async loadPartById(data: LoadPartByIdRepository.Params): Promise<PartModel | null> { ... }
  async updatePartStock(data: UpdatePartStockRepository.Params): Promise<void> { ... }
}
```

### Regra obrigatória

- a tecnologia pode aparecer no nome da implementação concreta;
- esse nome não deve contaminar contrato de use case ou protocolo de repositório;
- um repositório concreto pode implementar múltiplos contratos do mesmo domínio.

---

## 10. Adapters

### Onde ficam

- `src/main/adapters/`

### Nome dos arquivos

- `{contexto}-adapter.ts`

### Exemplo

```typescript
// src/main/adapters/express-route-adapter.ts
export const adaptRoute =
  (controller: Controller): RequestHandler =>
  async (req: Request, res: Response) => {
    const request = { ...req.body, ...req.params, ...req.query }
    const httpResponse = await controller.handle(request)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
```

### Regra obrigatória

- adapter existe para traduzir payload externo para o contrato interno;
- se não houver adaptação real, revisar se o adapter é necessário ou se o contrato interno está mal definido.

---

## 11. Rotas

### Onde ficam

- `src/main/routes/`

### Nome dos arquivos

- `{modulo}-routes.ts`

### Exemplo

```typescript
// src/main/routes/service-order-routes.ts
import { adaptRoute } from '@/main/adapters'
import {
  makeAddServiceOrderController,
  makeLoadServiceOrderByIdController,
  makeUpdateServiceOrderStatusController,
} from '@/main/factories'
import { auth } from '@/main/middlewares'
import { Router } from 'express'

export default (router: Router): void => {
  router.post(
    '/service-order',
    auth,
    adaptRoute(makeAddServiceOrderController())
  )
  router.get(
    '/service-order/:id',
    auth,
    adaptRoute(makeLoadServiceOrderByIdController())
  )
  router.patch(
    '/service-order/:id/status',
    auth,
    adaptRoute(makeUpdateServiceOrderStatusController())
  )
}
```

### Regra obrigatória

- rotas devem delegar para `adaptRoute(...)`;
- middlewares devem ser aplicados na rota;
- adapters entram quando houver payload externo fora do contrato interno;
- rotas não instanciam dependências manualmente — usam factories;
- caminhos de recurso são sempre no singular (ex.: `/client`, `/service-order`), nunca no plural.

---

## 12. Testes

### Nome dos arquivos

- unitário / interno de módulo: `.spec.ts`
- integração / rota / adapter: `.test.ts`

### Organização esperada

```
tests/
  domain/
    mocks/          ← mocks de modelos de domínio
  data/
    mocks/          ← mocks de repositórios (implementações fake dos protocolos)
    usecases/       ← specs de use cases
  presentation/
    controllers/    ← specs de controllers
    mocks/
  main/
    factories/      ← specs de validation factories
    routes/         ← testes de integração de rota
  infra/
    {tecnologia}/   ← specs de repositórios concretos
```

### Exemplo de mock de repositório

```typescript
// tests/data/mocks/mock-add-service-order-repository.ts
import { AddServiceOrderRepository } from '@/data/protocols'

export const mockAddServiceOrderRepositoryResult =
  (): AddServiceOrderRepository.Result => ({
    id: 'any_id',
    protocol: 'any_protocol',
    budgetTotal: 350,
  })

export class AddServiceOrderRepositorySpy implements AddServiceOrderRepository {
  params?: AddServiceOrderRepository.Params
  result = mockAddServiceOrderRepositoryResult()

  async addServiceOrder(
    data: AddServiceOrderRepository.Params
  ): Promise<AddServiceOrderRepository.Result> {
    this.params = data
    return this.result
  }
}
```

### Regra obrigatória

- teste deve proteger comportamento atual desejado;
- ao corrigir teste quebrado, confirmar se ele protege regra de negócio ou apenas shape legado indevido;
- mocks ficam em `tests/.../mocks`, não inline no arquivo de spec.

---

## 13. Nomenclatura orientada a domínio

### Regra oficial

O projeto deve preferir nomes que representem o que o sistema faz, e não o fornecedor externo que o suporta.

Exemplos de preferência:

| Evitar                              | Preferir                                     |
| ----------------------------------- | -------------------------------------------- |
| nome da tecnologia no use case      | `service-order`, `client`, `vehicle`, `part` |
| nome do ORM/banco no contrato       | `add`, `load`, `update`, `delete`            |
| nome de tabela/coluna no controller | `serviceOrder`, `client`, `vehicle`, `part`  |

### Exceção permitida

O nome do provider ou da tecnologia pode aparecer quando:

- o artefato for a implementação concreta da integração (`infra`), ex.: `ServiceOrderPrismaMysqlRepository`;
- a distinção entre tecnologias for parte real da arquitetura (ex.: dois bancos ou dois provedores de notificação).

### Regra obrigatória

- nomes de tecnologia/provider não devem aparecer em contratos de use case, em protocolos de repositório nem em controllers;
- nomes orientados a domínio tornam o código mais estável a trocas de fornecedor ou de banco.

---

## 14. Critérios de revisão

Uma implementação está dentro do padrão quando:

1. fica na camada correta;
2. segue a direção correta de dependências;
3. usa nome coerente com o domínio;
4. mantém controller fino (só valida, delega e responde);
5. mantém caso de uso central para a lógica de aplicação;
6. mantém contrato técnico em `data/protocols`;
7. mantém integração concreta em `infra`;
8. compõe tudo via `main/factories`;
9. usa validação centralizada;
10. não replica convenção legada sem necessidade.

---

## Decisão Operacional

Este documento é normativo e deve ser usado em:

- PR review;
- criação de novos módulos;
- refactor de nomenclatura;
- limpeza de legado;
- alinhamento de arquitetura entre times.
