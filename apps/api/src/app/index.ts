import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'
import 'express-async-errors'
import session from 'express-session'
import { writeFile } from 'fs'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { redis } from 'utils/redis'
import { IS_DEV } from '../constants'
import '../managers/websocket'
import { websockets } from '../managers/websocket'
import routes from '../routes'
import { API_ENDPOINT } from '../utils/constants'
import { customHeaders } from '../utils/custom.headers'
import { env } from '../utils/env'
import { errorHandler } from '../utils/error'
import { lg } from '../utils/logger'
import { generatedRoutes, handleGenerateRoutes } from './utils/generateRoutes'

const app = express()

if (env.NODE_ENV === 'production') {
  process.on('unhandledRejection', (reason, promise) => {
    lg.error(reason)
    lg.error(promise)
  })

  process.on('uncaughtException', (error, origin) => {
    lg.error(error)
    lg.error(origin)
  })
}

app.use(
  express.json({
    limit: '64kb',
    verify: (req, res, buf) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      req.rawBody = buf
    },
  })
)
app.use(express.urlencoded({ extended: false }))
app.use(helmet())

app.use('/static', cors(), express.static(path.join(process.cwd(), 'public')))

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type'],
  })
)
app.use(customHeaders)
app.use(morgan('dev'))
app.use(cookieParser())
app.use(
  session({
    secret: env.CRYPTION_KEY_SESSION,
    name: env.AUTH_COOKIE_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000 * 24,
    },
  })
)

app.get('/', (request: Request, res: Response) => {
  res.json({ uptime: process.uptime() })
})

app.use(API_ENDPOINT, routes)
app.use(errorHandler)

export const createApp = () => {
  const server = app.listen(env.PORT, async () => {
    lg.info(`[API] Started at port: ${env.PORT}.`)

    await redis._client.connect()

    await redis._client
      .ping()
      .then(() => lg.info('[REDIS] Started.'))
      .catch((err) => {
        lg.error('[REDIS] Error starting the redis client', err)
        process.exit(1)
      })

    if (IS_DEV) {
      lg.info('Generating endpoints.')
      app._router.stack.forEach(handleGenerateRoutes.bind(null, []))
      writeFile(
        path.join(process.cwd(), './src/app/utils/routes.json'),
        JSON.stringify(generatedRoutes, null, 2),
        (err) => {
          if (err) {
            throw err
          }
        }
      )
    }
  })

  websockets(server)

  return server
}
