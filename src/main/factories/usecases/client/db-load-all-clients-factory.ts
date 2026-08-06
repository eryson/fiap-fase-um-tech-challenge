import { LoadAllClients } from '@/domain/usecases'
import { LoadAllClientsImpl } from '@/data/usecases'
import { ClientPrismaMysqlRepository } from '@/infra/db'

export const makeDbLoadAllClients = (): LoadAllClients => {
  const clientPrismaRepository = new ClientPrismaMysqlRepository()
  return new LoadAllClientsImpl(clientPrismaRepository)
}
