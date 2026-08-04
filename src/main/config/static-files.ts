import express, { Express } from 'express'
import { resolve } from 'path'

export default (app: Express): void => {
  app.use('/static', express.static(resolve(__dirname, '../../static')))
  app.use('/public', express.static('public'))
  app.use('/app', express.static('app/audio'))
}
