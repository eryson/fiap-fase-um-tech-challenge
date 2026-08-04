import 'module-alias/register'
import 'reflect-metadata'

import env from '@/main/config/env'

;(async (): Promise<void> => {
  const { setupApp } = await import('./config/app')
  const server = await setupApp()

  const protocol = env.useHttps ? 'https' : 'http'
  const baseUrl = env.appUrl || `${protocol}://localhost:${env.port}`

  server.listen(env.port, () => {
    console.log(`Server running at ${baseUrl}`)
    console.log(`API Documentation available at ${baseUrl}/documentation`)
    console.log(
      `DEV Documentation available at ${baseUrl}/development/onboarding`
    )
  })
})().catch(error => {
  console.error('Error starting server:', error)
})
