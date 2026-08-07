import { ClientModel } from '@/domain/models'

export interface AddClientRepository {
  addClient: (
    data: AddClientRepository.Params
  ) => Promise<AddClientRepository.Result>
}

export namespace AddClientRepository {
  export type Params = {
    name: string
    document: string
    email?: string
    phone?: string
  }
  export type Result = ClientModel
}
