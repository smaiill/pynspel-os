import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Response } from 'express'
import 'express-async-errors'
import session from 'express-session'
import { writeFile } from 'fs'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { IS_DEV } from '../constants'
import '../managers/websocket'
import { rateLimiter } from '../middlewares/rate.limiter'
import routes from '../routes'
import { API_ENDPOINT } from '../utils/constants'
import { customHeaders } from '../utils/custom.headers'
import { env } from '../utils/env'
import { errorHandler } from '../utils/error'
import { lg } from '../utils/logger'
import { redis } from '../utils/redis'
import { deserializeSession } from '../utils/session'
import { generatedRoutes, handleGenerateRoutes } from './utils/generateRoutes'

const app = express()

if (env.NODE_ENV === 'production') {
  process.on('unhandledRejection', (reason, promise) => {
    console.error(reason)
    console.error(promise)
  })

  process.on('uncaughtException', (error, origin) => {
    console.error(error)
    console.error(origin)
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

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
    credentials: true,
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

app.use('/static', express.static(path.join(process.cwd(), 'src/public')))

app.use(deserializeSession)
app.use(rateLimiter)

app.get('/', (_, res: Response) => {
  res.json({ uptime: process.uptime() })
})

app.use(API_ENDPOINT, routes)
app.use(errorHandler)

app.listen(env.PORT, async () => {
  lg.info(`[API] Started at port: ${env.PORT}.`)

  await redis
    .ping()
    .then(() => lg.info('[REDIS] Started.'))
    .catch((err) => lg.error('[REDIS] Error starting the redis client', err))

  if (IS_DEV) {
    lg.info('Generating endpoints.')
    app._router.stack.forEach(handleGenerateRoutes.bind(null, []))
    writeFile(
      path.join(process.cwd(), './src/app/utils/routes.json'),
      JSON.stringify(generatedRoutes, null, 2),
      (err) => {
        err ? console.log(err) : null
      }
    )
  }
})

export default app
