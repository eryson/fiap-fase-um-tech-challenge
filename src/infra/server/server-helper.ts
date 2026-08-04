import env from '@/main/config/env'

import fs from 'fs'
import https from 'https'

export const ServerHelper = {
  httpsServer: null as unknown as https.Server,

  init(app: any): void {
    this.httpsServer = https.createServer(
      {
        key: fs.readFileSync(env.certKey),
        cert: fs.readFileSync(env.certPem),
        passphrase: env.certPassword,
      },
      app
    )
  },
}
