import { PrismaMysqlHelper } from '@/infra/db'

export const setupPrismaMysql = (): void => {
  PrismaMysqlHelper.connect()
}
