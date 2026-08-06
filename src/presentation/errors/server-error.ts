export class ServerError extends Error {
  public statusCode: number

  constructor(error?: Error | string, statusCode = 500) {
    const message =
      typeof error === 'string'
        ? error
        : (error?.message ?? 'Internal server error')

    super(message)
    this.name = 'ServerError'
    this.statusCode = statusCode

    if (error instanceof Error && error.stack) {
      this.stack = error.stack
    }
  }
}
