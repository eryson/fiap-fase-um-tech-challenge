import { PrismaClient } from '@prisma/client'

export const PrismaMysqlHelper = {
  client: null as unknown as PrismaClient,

  connect(): void {
    this.client = new PrismaClient()
  },

  async disconnect(): Promise<void> {
    console.log('🛢️ Prisma MySQL disconnected!')

    if (this.client) {
      await this.client.$disconnect()
      this.client = null
    }
  },
}
