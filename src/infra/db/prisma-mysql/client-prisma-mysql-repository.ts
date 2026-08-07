import { PrismaMysqlHelper } from './prisma-mysql-helper'

import { LoadAllClientsRepository, AddClientRepository } from '@/data/protocols'

export class ClientPrismaMysqlRepository
  implements LoadAllClientsRepository, AddClientRepository
{
  async loadAllClients(): Promise<LoadAllClientsRepository.Result> {
    return await PrismaMysqlHelper.client.client.findMany({
      orderBy: {
        id: 'asc',
      },
    })
  }

  async addClient(
    data: AddClientRepository.Params
  ): Promise<AddClientRepository.Result> {
    return await PrismaMysqlHelper.client.client.create({
      data: {
        name: data.name,
        document: data.document,
        email: data.email,
        phone: data.phone,
      },
    })
  }
}
