# Onboarding - FIAP Fase 1 - Tech Challenge

## Objetivo

Este guia acelera a entrada no projeto e descreve como rodar, testar e navegar pela arquitetura.

## Requisitos

1. Node.js LTS
2. Yarn

## Setup Inicial

1. Instalar dependencias:

```bash
yarn install
```

2. Configurar variaveis de ambiente relevantes:

```env
USE_HTTPS=false

APP_PORT=3000

DATABASE_URL=mysql://user:password@localhost:3306/tech_challenge

JWT_SECRET=change-me
```

3. Subir em desenvolvimento:

```bash
yarn start:dev
```

## Rotas Principais

1. POST /api/clients — cadastro de cliente
2. POST /api/vehicles — cadastro de veículo
3. POST /api/service-orders — abertura de ordem de serviço (OS)
4. GET /api/service-orders/:id — acompanhamento da OS
5. PATCH /api/service-orders/:id/status — alteração de status da OS
6. CRUD de serviços e de peças/insumos (com controle de estoque)

## Documentacao Servida Pela Aplicacao

1. Swagger: /documentation
2. Onboarding: /development/onboarding
3. Arquitetura: /development/architecture
4. Padroes: /development/patterns
5. Requisitos: /development/requirements/requirements

## Checklist de Desenvolvimento

1. Regra de negocio em use case (data/domain), nunca no controller.
2. Conversao de payload externo em adapter (infra).
3. Dependencias externas via portas/protocolos.
4. Build verde antes de merge:

```bash
yarn build
```

## Testes Recomendados

1. Criação de OS: identificação do cliente por CPF/CNPJ -> cadastro/consulta de veículo -> inclusão de serviços e peças -> orçamento gerado automaticamente.
2. Aprovação de OS: envio do orçamento -> aprovação do cliente -> transição de status "Aguardando aprovação" para "Em execução".
3. Acompanhamento de OS: consulta do status pelo cliente via API em cada etapa (Recebida, Em diagnóstico, Aguardando aprovação, Em execução, Finalizada, Entregue).
4. Gestão administrativa: CRUD de clientes, veículos, serviços e peças (incluindo controle de estoque de peças).
5. Autenticação: acesso às rotas administrativas exige JWT válido.
6. Validação de dados sensíveis: rejeição de CPF/CNPJ e placa de veículo em formato inválido.
