import { Request, Response, RequestHandler } from 'express'

import { Controller } from '@/presentation/protocols'

export const adaptRoute =
  (controller: Controller): RequestHandler =>
  async (req: Request, res: Response) => {
    const request = { ...req.body, ...req.params, ...req.query }
    const httpResponse = await controller.handle(request)

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
