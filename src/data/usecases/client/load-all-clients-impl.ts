import { LoadAllClientsRepository } from '@/data/protocols'
import { LoadAllClients } from '@/domain/usecases'

export class LoadAllClientsImpl implements LoadAllClients {
  constructor(
    private readonly loadAllClientsRepository: LoadAllClientsRepository
  ) {}

  async loadAll(): Promise<LoadAllClientsRepository.Result | null> {
    return await this.loadAllClientsRepository.loadAll()
  }
}
