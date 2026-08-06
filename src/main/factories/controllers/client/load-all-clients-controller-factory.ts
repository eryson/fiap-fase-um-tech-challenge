import { LoadAllClientsController } from '@/presentation/controllers'
import { makeDbLoadAllClientsFactory } from '@/main/factories'

export const makeLoadAllClientsFactory = (): LoadAllClientsController => {
  const useCase = makeDbLoadAllClientsFactory()
  return new LoadAllClientsController(useCase)
}
