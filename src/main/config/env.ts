import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()

const parseBoolean = (value: string | undefined): boolean | undefined => {
  if (value === undefined) return undefined
  const normalized = value.trim().toLowerCase()
  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false
  return undefined
}

const port = Number(process.env.APP_PORT ?? 3000)
const useHttpsFromEnv = parseBoolean(process.env.USE_HTTPS)
const inferredUseHttps = Boolean(process.env.CERT_KEY && process.env.CERT_PEM)
const useHttps = useHttpsFromEnv ?? inferredUseHttps
const protocol = useHttps ? 'https' : 'http'

export default {
  useHttps,
  appUrl: process.env.APP_URL ?? `${protocol}://localhost:${port}`,

  certKey: process.env.CERT_KEY ?? '',
  certPem: process.env.CERT_PEM ?? '',
  certPassword: process.env.CERT_PASSWORD ?? '',

  port,

  testAuthToken: crypto.randomUUID(),
}
