import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'

import {
  makeLoadAllClientsController,
  makeAddClientController,
} from '@/main/factories'

export default (router: Router): void => {
  /**
   * @openapi
   * /client:
   *   get:
   *     tags:
   *       - Clients
   *     summary: Lista todos os clientes
   *     description: Retorna todos os clientes cadastrados.
   *     security: []
   *     responses:
   *       200:
   *         description: Lista de clientes retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Client'
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ServerErrorResponse'
   */
  router.get('/client', adaptRoute(makeLoadAllClientsController()))

  /**
   * @openapi
   * /client:
   *   post:
   *     tags:
   *       - Clients
   *     summary: Cadastra um cliente
   *     description: Cria um novo cliente identificado por CPF ou CNPJ.
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - document
   *             properties:
   *               name:
   *                 type: string
   *                 example: 'Maria Silva'
   *               document:
   *                 type: string
   *                 description: CPF ou CNPJ válido
   *                 example: '529.982.247-25'
   *               email:
   *                 type: string
   *                 example: 'maria.silva@email.com'
   *               phone:
   *                 type: string
   *                 example: '(11) 91234-5678'
   *     responses:
   *       200:
   *         description: Cliente cadastrado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Client'
   *       400:
   *         description: Payload inválido (campo obrigatório ausente ou CPF/CNPJ inválido)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ServerErrorResponse'
   */
  router.post('/client', adaptRoute(makeAddClientController()))
}
