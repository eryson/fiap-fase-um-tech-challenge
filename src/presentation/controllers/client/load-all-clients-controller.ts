import { Controller, HttpResponse } from '@/presentation/protocols'
import { serverError, ok } from '@/presentation/helpers'

import { LoadAllClients } from '@/domain/usecases'

export class LoadAllClientsController implements Controller {
  constructor(private readonly loadAllClients: LoadAllClients) {}

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.loadAllClients.loadAll()
      return ok(result)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
