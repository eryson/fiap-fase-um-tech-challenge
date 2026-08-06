import { PrismaMysqlHelper } from './prisma-mysql-helper'

import { LoadAllClientsRepository } from '@/data/protocols'

export class ClientsPrismaMysqlRepository implements LoadAllClientsRepository {
  async loadAll(): Promise<LoadAllClientsRepository.Result> {
    return await PrismaMysqlHelper.client.client.findMany({
      orderBy: {
        id: 'asc',
      },
    })
  }
}
