import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeLoadAllClientsFactory } from '@/main/factories'

export default (router: Router): void => {
  /**
   * @openapi
   * /users-queues:
   *   post:
   *     tags:
   *       - Usuarios x Filas
   *     summary: Cria o vinculo entre um usuario e uma fila
   *     description: Cria um registro na relacao `usersQueues` usando `UserId` e `QueueId`.
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserQueueInput'
   *     responses:
   *       200:
   *         description: Vinculo criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserQueue'
   *       400:
   *         description: Payload invalido, vinculo ja existente, usuario inexistente ou fila inexistente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get('/client', adaptRoute(makeLoadAllClientsFactory()))
}
