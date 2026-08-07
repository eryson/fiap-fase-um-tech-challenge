import { Controller, HttpResponse, Validation } from '@/presentation/protocols'
import { serverError, ok, badRequest } from '@/presentation/helpers'

import { AddClient } from '@/domain/usecases'

export class AddClientController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addClient: AddClient
  ) {}

  async handle(request: AddClientController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)

      const result = await this.addClient.add(request)
      return ok(result)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace AddClientController {
  export type Request = AddClient.Params
}
