import { AddClientController } from '@/presentation/controllers'
import { makeDbAddClient, makeAddClientValidation } from '@/main/factories'

export const makeAddClientController = (): AddClientController => {
  const validation = makeAddClientValidation()
  const useCase = makeDbAddClient()

  return new AddClientController(validation, useCase)
}
