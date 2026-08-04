import express from 'express'
import { Server } from 'http'

import setupMiddlewares from '@/main/config/middlewares'
import setupRoutes from '@/main/config/routes'
import setupStaticFiles from '@/main/config/static-files'

import { setupSwagger } from '../docs/swagger/setup-swagger'
import { setupMarkdownDocs } from '../docs/setup-markdown-docs'

import { setupServer } from '@/main/server/setup-server'

export const setupApp = async (): Promise<Server> => {
  ;(BigInt.prototype as any).toJSON = function () {
    return this.toString()
  }

  const app = express()

  setupStaticFiles(app)
  setupSwagger(app)
  setupMarkdownDocs(app)
  setupMiddlewares(app)
  setupRoutes(app)

  const httpServer = setupServer(app)

  return httpServer
}
