import { HttpResponse } from '@/presentation/protocols'
import { ServerError } from '@/presentation/errors'

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export const unauthorized = (data: any): HttpResponse => ({
  statusCode: 401,
  body: data,
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error,
})

export const notFound = (error: Error): HttpResponse => ({
  statusCode: 404,
  body: error,
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error),
})

export const badGateway = (error: Error): HttpResponse => ({
  statusCode: 502,
  body: error,
})

export const serviceUnavailable = (error: Error): HttpResponse => ({
  statusCode: 503,
  body: error,
})
