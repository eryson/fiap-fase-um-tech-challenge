import { LoadAllClientsRepository } from '@/data/protocols'
import { LoadAllClients } from '@/domain/usecases'

export class LoadAllClientsImpl implements LoadAllClients {
  constructor(
    private readonly loadAllClientsRepository: LoadAllClientsRepository
  ) {}

  async loadAll(): Promise<LoadAllClients.Result> {
    return await this.loadAllClientsRepository.loadAllClients()
  }
}
