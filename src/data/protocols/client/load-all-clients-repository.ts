import { ClientModel } from '@/domain/models'

export interface LoadAllClientsRepository {
  loadAll: () => Promise<LoadAllClientsRepository.Result>
}

export namespace LoadAllClientsRepository {
  export type Result = Array<ClientModel>
}
