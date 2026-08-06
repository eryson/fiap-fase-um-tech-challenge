import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeLoadAllClientsController } from '@/main/factories'

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
}
