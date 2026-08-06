import { ClientModel } from '@/domain/models'

export interface LoadAllClients {
  loadAll: () => Promise<LoadAllClients.Result>
}

export namespace LoadAllClients {
  export type Result = ClientModel[]
}
