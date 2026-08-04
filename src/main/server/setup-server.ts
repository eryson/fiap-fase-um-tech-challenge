import https from 'https'
import { Express } from 'express'

import { ServerHelper } from '@/infra/server/server-helper'

export const setupServer = (app: Express): https.Server => {
  ServerHelper.init(app)

  return ServerHelper.httpsServer
}
