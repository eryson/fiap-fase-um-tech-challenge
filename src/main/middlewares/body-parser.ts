import express from 'express'

export const bodyParser = [
  express.json({ limit: '50mb' }),
  express.urlencoded({ extended: true, limit: '50mb' }),
]
