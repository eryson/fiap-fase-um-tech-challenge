# 📘 FIAP Fase 1 - Tech Challenge Documentation

> Modern Clean Architecture API using TypeScript, Node.js and Express.

---

## 💼 Documentação Interna

Para começar, acesse a documentação completa do projeto:

- [Guia de Onboarding](https://localhost:3000/development/onboarding)
- [Arquitetura](https://localhost:3000/development/architecture)
- [Padrões de Projeto](https://localhost:3000/development/patterns)
- [Casos de Uso/Controllers e Requisitos](https://localhost:3000/development/requirements/requirements)
- [Documentação Swagger da API](https://localhost:3000/documentation)

---

## 📦 Installation

```bash
yarn install
```

> This project runs in a monorepo-style backend service structure. All dependencies are defined in `package.json`, and the main server entrypoint is under `src/main/server.ts`.

---

## 🚀 Running the Project

### Development

```bash
yarn start:dev
```

### HTTP vs HTTPS (local/dev)

Por padrão, o servidor **usa HTTP** quando você **não** fornece certificados (`CERT_KEY`/`CERT_PEM`).
Se você quiser forçar o modo, use a variável `USE_HTTPS`.

Variáveis suportadas:

- `USE_HTTPS=false` roda **sem TLS** (HTTP).
- `USE_HTTPS=true` roda com TLS (HTTPS) e exige:
  - `CERT_KEY` caminho do arquivo `.key`
  - `CERT_PEM` caminho do arquivo `.pem`/`.crt`
  - `CERT_PASSWORD` (opcional) passphrase
- `APP_URL` (opcional) URL base usada em logs e na lista de CORS do Socket.IO.
  - Ex: `http://localhost:3000`

### Production Build

```bash
yarn build
```

### Run Built Version

```bash
yarn start
```

### Format Code

```bash
yarn format
```

### Lint Code

```bash
yarn lint
```

---

## 🧪 Testing

### Run All Tests

```bash
yarn test
```

### Unit Tests (watch mode)

```bash
yarn test:unit
```

### Integration Tests (watch mode)

```bash
yarn test:integration
```

### Staged Tests

```bash
yarn test:staged
```

### CI Mode

```bash
yarn test:ci
```

---

## 🌲 Folder Structure

### Root Folders

- `src/` - Main application logic (Clean Architecture)
- `tests/` - Unit and integration tests
- `cli/` - CLI tools including the CRUD generator
- `dist/` - Compiled output
- `dump/` - Backups or seed-related content

### `src/` Clean Architecture

- `domain/` - Entities, interfaces, and use cases
- `data/` - Use case implementations and protocol definitions
- `infra/` - DB integrations, external libs
- `main/` - Entry points, route configs, DI factories
- `presentation/` - Controllers and HTTP protocols
- `validation/` - Input validation logic
- `utils/` - Utility functions shared across layers

### `tests/`

- Mirrors `src/` structure
- `mocks/` - Reusable mock functions
- Integration and unit test separation via config files

---

## 🧰 Technologies & Tools

- **TypeScript**
- **Express**
- **Jest** for testing
- **Supertest** for HTTP assertions
- **Swagger**
- **ts-morph** and custom CLI tools

---

## 📚 CLI Tooling

The built-in CLI located at `cli/crud-generator` provides an automated way to scaffold Clean Architecture CRUDs:

```bash
npx ts-node cli/index.ts EntityName tableName field1:type field2:type
```

> Output includes model, use cases, protocols, controller, repository, routes, and factory.

---

## 🔒 Code Quality & Dev Tools

- **ESLint** + **Prettier**
- **husky** + **lint-staged** for pre-commit
- **ts-node-dev** for hot-reloading
- **standard-version** for changelog/versioning

---
