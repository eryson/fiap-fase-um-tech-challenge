import { ClientModel } from '@/domain/models'

export interface AddClient {
  add: (data: AddClient.Params) => Promise<AddClient.Result>
}

export namespace AddClient {
  export type Params = {
    name: string
    document: string
    email?: string
    phone?: string
  }
  export type Result = ClientModel
}
