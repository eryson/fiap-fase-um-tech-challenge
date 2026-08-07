import { ClientModel } from '@/domain/models'

export interface LoadAllClientsRepository {
  loadAllClients: () => Promise<LoadAllClientsRepository.Result>
}

export namespace LoadAllClientsRepository {
  export type Result = Array<ClientModel>
}
