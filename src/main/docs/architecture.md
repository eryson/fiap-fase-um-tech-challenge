# Arquitetura

## Objetivo

Este documento define a arquitetura oficial da API. Ele descreve como o projeto **deve** ser organizado, quais responsabilidades pertencem a cada camada e quais princípios devem orientar novas implementações, refactors e limpezas.

Quando o código divergir deste documento, o código é que deve ser ajustado.

---

## Princípios Arquiteturais

O projeto adota:

- **Clean Architecture** como organização principal de camadas;
- **DDD** como referência para modelagem de domínio e casos de uso;
- **injeção explícita de dependências** por meio de factories;
- **isolamento de infraestrutura** para permitir evolução de integrações sem contaminar a regra de negócio.

Princípios obrigatórios:

- dependências devem apontar para dentro;
- regras de negócio não podem depender de framework, banco ou provider externo;
- controllers devem orquestrar, não decidir regra de negócio;
- infraestrutura deve implementar contratos, não definir comportamento de domínio;
- documentação arquitetural deve prevalecer como referência para padronização.

---

## Camadas Oficiais

### `src/domain/`

Camada central de negócio.

Responsabilidades:

- definir modelos de domínio;
- definir contratos de casos de uso;
- expressar linguagem de negócio;
- permanecer isolada de infraestrutura.

Deve conter:

- `models/`
- `usecases/`

Não deve conter:

- chamadas HTTP;
- acesso a banco;
- Prisma;
- Axios;
- helpers de provider.

### `src/data/`

Camada de aplicação.

Responsabilidades:

- implementar os casos de uso definidos em `domain/usecases`;
- declarar contratos de dependências externas em `data/protocols`;
- orquestrar regras de aplicação sem acoplamento a implementações concretas.

Deve conter:

- `usecases/`
- `protocols/`

Regra obrigatória:

- contratos de dependências técnicas devem ficar em `data/protocols`;
- implementações de caso de uso devem ficar em `data/usecases`.

### `src/infra/`

Camada de infraestrutura e integrações concretas.

Responsabilidades:

- implementar contratos de `data/protocols`;
- encapsular acesso a banco de dados e a APIs/provedores externos;
- concentrar detalhes de tecnologia.

Exemplos de grupos esperados:

- `db/`

Regra obrigatória:

- `infra` pode conhecer `data/protocols`;
- `infra` não pode definir regra de negócio que deveria estar em `domain` ou `data/usecases`.

### `src/presentation/`

Camada de entrada.

Responsabilidades:

- receber entrada externa;
- validar;
- acionar caso de uso;
- formatar resposta;
- lidar com protocolos de entrada e saída.

Deve conter:

- `controllers/`
- `middlewares/`
- `helpers/`
- `errors/`
- `protocols/`

Regra obrigatória:

- controllers não devem conter regra de negócio;
- controllers não devem falar diretamente com infraestrutura concreta;
- controllers devem depender de abstrações.

### `src/main/`

Camada de composição e bootstrap.

Responsabilidades:

- montar rotas;
- compor controllers;
- instanciar dependências;
- inicializar infraestrutura;
- conectar adapters e middlewares;
- expor documentação.

Deve conter:

- `routes/`
- `factories/`
- `adapters/`
- `middlewares/`
- `config/`
- bootstrap de serviços

Regra obrigatória:

- toda composição concreta deve acontecer em `main`.

### `src/validation/`

Camada oficial de validação.

Responsabilidades:

- centralizar validadores reutilizáveis;
- sustentar DTOs de validação e factories de validação;
- padronizar validações de entrada.

Regra obrigatória:

- factories de validação devem usar `AbstractClassValidator` com DTOs baseados em `class-validator`;
- controllers devem depender da abstração `Validation`;
- validação não deve ser implementada manualmente dentro de controllers.

### `src/utils/`

Camada de utilitários compartilhados.

Responsabilidades:

- concentrar helpers transversais e reutilizáveis;
- evitar duplicação de código técnico simples.

Regra obrigatória:

- `utils` não é lugar para regra de negócio;
- helpers específicos de provider devem preferencialmente ficar próximos da integração correspondente em `infra`, salvo quando já forem utilitários compartilhados.

---

## Fluxo Arquitetural Oficial

```text
Route (main/routes)
 └→ Adapter opcional (main/adapters)
     └→ Controller (presentation)
         └→ Validation
             └→ Use Case Impl (data/usecases)
                 └→ Use Case Contract (domain/usecases)
                 └→ Dependency Contracts (data/protocols)
                     └→ Concrete Infra Implementation (infra)
```

Regras:

- adapters são usados quando o payload externo precisa ser traduzido para o contrato interno;
- validação acontece antes da execução do caso de uso;
- implementações de use case conhecem contratos, não implementações concretas;
- implementação concreta só aparece no wiring de `main`.

Direção de dependências (referência arquitetural):

```text
presentation -> domain <- data <- infra
                        ^
                       main (composição)
```

---

## Contratos

### Contratos de negócio

Devem ficar em:

- `domain/usecases`

Representam:

- casos de uso;
- entradas e saídas do domínio de aplicação.

### Contratos de dependência

Devem ficar em:

- `data/protocols`

Representam:

- repositórios;
- gateways;
- serviços externos;
- dependências auxiliares necessárias aos use cases.

Regra obrigatória:

- o projeto não deve misturar arbitrariamente contratos de dependência entre `domain` e `data`;
- a convenção oficial é: **dependência técnica em `data/protocols`**.

---

## Critérios de Aceite Arquitetural

Uma implementação está alinhada com a arquitetura quando:

1. a responsabilidade do artefato está na camada correta;
2. o fluxo respeita a direção das dependências;
3. controllers continuam finos;
4. use cases continuam centrais e com uma responsabilidade bem definida;
5. contratos técnicos ficam em `data/protocols`;
6. integrações concretas ficam em `infra`;
7. factories compõem tudo em `main`;
8. validações passam por `validation`.

Se qualquer um desses pontos for quebrado, a implementação deve ser tratada como desvio.

---

## Decisão Operacional

Este documento é normativo.

Ele deve ser usado para:

- guiar código novo;
- orientar refactors;
- avaliar PRs;
- conduzir a limpeza de legado;
- decidir se um artefato está dentro ou fora do padrão.
