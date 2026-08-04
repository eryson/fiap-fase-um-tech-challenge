# Requisitos e Casos de Uso

## Objetivo

Este documento traduz os requisitos do desafio (Fase 1 - Tech Challenge: oficina mecânica) em casos de uso, controllers e critérios de aceite, servindo de referência para o que precisa existir na API.

Quando um requisito abaixo ainda não estiver implementado, ele deve ser tratado como pendência de desenvolvimento, não como documentação incorreta.

---

## Contexto de negócio

Sistema Integrado de Atendimento e Execução de Serviços de uma oficina mecânica. Cobre o ciclo completo de uma Ordem de Serviço (OS): identificação do cliente, cadastro de veículo, orçamento, aprovação, execução e entrega, além da gestão administrativa de clientes, veículos, serviços e peças/insumos.

## Linguagem ubíqua

| Termo             | Significado                                                                 |
| ----------------- | ---------------------------------------------------------------------------- |
| Cliente           | Pessoa física ou jurídica identificada por CPF/CNPJ, dona de um ou mais veículos |
| Veículo           | Identificado por placa, marca, modelo e ano, vinculado a um cliente          |
| Serviço           | Item de catálogo prestado pela oficina (ex.: troca de óleo, alinhamento)     |
| Peça/Insumo       | Item de estoque consumido na execução de um serviço                         |
| Ordem de Serviço (OS) | Agrega cliente, veículo, serviços e peças; possui orçamento e status     |
| Orçamento         | Valor calculado automaticamente a partir dos serviços e peças da OS          |
| Status da OS      | Recebida, Em diagnóstico, Aguardando aprovação, Em execução, Finalizada, Entregue |

---

## Fluxo 1 — Criação da Ordem de Serviço

### Requisitos

1. Identificar o cliente por CPF/CNPJ (criar se não existir, ou localizar existente).
2. Cadastrar/associar o veículo (placa, marca, modelo, ano).
3. Incluir os serviços solicitados.
4. Incluir peças e insumos necessários.
5. Gerar orçamento automaticamente a partir de serviços + peças.
6. Enviar o orçamento ao cliente para aprovação.

### Casos de uso (`domain/usecases`)

- `AddClient` — cadastra cliente por CPF/CNPJ.
- `AddVehicle` — cadastra veículo vinculado a um cliente.
- `AddServiceOrder` — cria a OS com serviços e peças, calcula o orçamento e define status inicial `received`.

### Controllers (`presentation/controllers`)

- `AddClientController` — `POST /api/clients`
- `AddVehicleController` — `POST /api/vehicles`
- `AddServiceOrderController` — `POST /api/service-orders`

### Critérios de aceite

- CPF/CNPJ inválido deve ser rejeitado na validação (`badRequest`), antes de chegar ao use case.
- Orçamento (`budgetTotal`) deve ser a soma dos preços dos serviços e peças informados.
- OS criada nasce com status `received`.

---

## Fluxo 2 — Acompanhamento da OS

### Requisitos

1. Status possíveis: Recebida, Em diagnóstico, Aguardando aprovação, Em execução, Finalizada, Entregue.
2. Alteração automática de status conforme ações no sistema (ex.: aprovar orçamento → `in_progress`).
3. Cliente deve poder consultar o progresso da própria OS via API.

### Casos de uso

- `UpdateServiceOrderStatus` — transiciona o status da OS.
- `LoadServiceOrderById` — consulta uma OS específica.
- `LoadActiveServiceOrders` — lista OS em andamento (uso administrativo e/ou por cliente).

### Controllers

- `UpdateServiceOrderStatusController` — `PATCH /api/service-orders/:id/status`
- `LoadServiceOrderByIdController` — `GET /api/service-orders/:id`
- `LoadActiveServiceOrdersController` — `GET /api/service-orders`

### Critérios de aceite

- Transições de status devem seguir a ordem do fluxo (não pular etapas sem justificativa de negócio).
- Consulta de OS por cliente não deve expor OS de terceiros (autorização por `clientId`).

---

## Fluxo 3 — Gestão de peças e insumos

### Requisitos

1. CRUD de peças e insumos.
2. Controle de estoque (quantidade disponível).
3. Consumo de estoque ao vincular peça a uma OS.

### Casos de uso

- `AddPart`, `LoadPartById`, `UpdatePart`, `DeletePart`.
- `UpdatePartStock` — decremento/incremento de estoque, acionado ao adicionar/cancelar peça em uma OS.

### Controllers

- CRUD em `/api/parts`.

### Critérios de aceite

- Não deve ser possível reservar/consumir mais peças do que o estoque disponível.
- Alterações de estoque feitas via caso de uso, nunca diretamente no controller.

---

## Fluxo 4 — Gestão administrativa

### Requisitos

- CRUD de clientes (`/api/clients`).
- CRUD de veículos (`/api/vehicles`).
- CRUD de serviços (`/api/services`).
- CRUD de peças e insumos (`/api/parts`) — ver Fluxo 3.
- Listagem e detalhamento de ordens de serviço (`/api/service-orders`).
- Monitoramento do tempo médio de execução dos serviços.

### Casos de uso adicionais

- `LoadAverageServiceOrderExecutionTime` — calcula o tempo médio entre `in_progress` e `finished` das OS.

---

## Segurança e qualidade

| Requisito                                             | Onde se aplica                                                            |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Autenticação JWT para APIs administrativas             | Middleware `auth` (`src/main/middlewares`) aplicado nas rotas de escrita/gestão |
| Validação de CPF/CNPJ                                   | DTO de `Client` em `src/validation/validators`, decorator customizado        |
| Validação de placa de veículo                           | DTO de `Vehicle` em `src/validation/validators`, decorator customizado       |
| Testes unitários e de integração para os fluxos principais | Ver [Padrões — seção 12 (Testes)](../patterns.md#12-testes)               |
| Cobertura mínima de 80% nos domínios críticos            | `domain`/`data` de Client, Vehicle, Part, ServiceOrder                       |

Rotas de consulta expostas ao cliente final (ex.: acompanhamento da própria OS) podem ter regra de autenticação/autorização própria, distinta do JWT administrativo — a definir conforme a estratégia de autenticação do cliente final.

---

## Requisitos técnicos gerais

- Back-end monolítico, em camadas (Clean Architecture — ver [architecture.md](../architecture.md)).
- Banco de dados: MySQL via Prisma (`src/infra/db/prisma-mysql`).
- APIs RESTful documentadas via Swagger (`/documentation`).
- Dockerfile + `docker-compose.yml` para ambiente completo.
- Testes automatizados com cobertura mínima de 80% nos domínios críticos.
- README.md com instruções de execução local.

## Decisão Operacional

Este documento deve ser atualizado sempre que um novo fluxo, entidade ou regra de negócio for confirmado, e usado como checklist de cobertura funcional antes da entrega da Fase 1.
