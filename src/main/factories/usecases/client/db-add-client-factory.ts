import { AddClient } from '@/domain/usecases'
import { AddClientImpl } from '@/data/usecases'
import { ClientPrismaMysqlRepository } from '@/infra/db'

export const makeDbAddClient = (): AddClient => {
  const clientPrismaRepository = new ClientPrismaMysqlRepository()
  return new AddClientImpl(clientPrismaRepository)
}
