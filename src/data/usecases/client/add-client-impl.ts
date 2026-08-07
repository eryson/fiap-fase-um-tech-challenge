import { AddClientRepository } from '@/data/protocols'
import { AddClient } from '@/domain/usecases'

export class AddClientImpl implements AddClient {
  constructor(private readonly addClientRepository: AddClientRepository) {}

  async add(data: AddClient.Params): Promise<AddClient.Result> {
    return await this.addClientRepository.addClient(data)
  }
}
