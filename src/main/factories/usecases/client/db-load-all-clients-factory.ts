import { LoadAllClients } from '@/domain/usecases'
import { LoadAllClientsImpl } from '@/data/usecases'
import { ClientsPrismaMysqlRepository } from '@/infra/db'

export const makeDbLoadAllClientsFactory = (): LoadAllClients => {
  const clientPrismaRepository = new ClientsPrismaMysqlRepository()
  return new LoadAllClientsImpl(clientPrismaRepository)
}
