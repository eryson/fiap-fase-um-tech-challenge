import { LoadAllClientsController } from '@/presentation/controllers'
import { makeDbLoadAllClients } from '@/main/factories'

export const makeLoadAllClientsController = (): LoadAllClientsController => {
  const useCase = makeDbLoadAllClients()
  return new LoadAllClientsController(useCase)
}
