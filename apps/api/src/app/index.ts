import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'
import 'express-async-errors'
import session from 'express-session'
import { writeFile } from 'fs'
import morgan from 'morgan'
import path from 'path'
import routes from 'routes'
import { API_ENDPOINT } from 'utils/constants'
import { customHeaders } from 'utils/custom.headers'
import { env } from 'utils/env'
import { errorHandler } from 'utils/error'
import { lg } from 'utils/logger'
import { redis } from 'utils/redis'
import { deserializeSession } from 'utils/session'
import { generatedRoutes, handleGenerateRoutes } from './utils/generateRoutes'
import { db } from 'modules/db'
import { ChannelFlags } from 'discord-api-types/v10'
import { z } from 'zod'

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

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// TODO: Add helmet package for security.
// TODO: Add rate limiting.
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
app.get('/', (req: Request, res: Response) => {
  res.json({ uptime: process.uptime() })
})

app.use(deserializeSession)
app.use(API_ENDPOINT, routes)
app.use(errorHandler)

app.listen(env.PORT, async () => {
  lg.info(`[API] Started at port: ${env.PORT}.`)
  await redis
    .ping()
    .then(() => lg.info('[REDIS] Started.'))
    .catch((err) => lg.error('[REDIS] Error starting the redis client', err))

  await redis._client.flushAll()

  if (env.NODE_ENV === 'developement') {
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

  // console.log(await db.exec('DELETE FROM panels'))

  // console.log(await db.exec('SELECT * FROM panels'))
  // await db.exec('DELETE FROM panel_interactions')
  // await db.exec(
  //   'INSERT INTO panel_interactions (name, panel_id, style) VALUES ($1, $2, $3)',
  //   ['test', '886318969048956929', 3]
  // )
  // console.log(await db.exec('DELETE FROM panel_interactions'))
  // console.log(await db.exec('DELETE FROM panels'))
  // console.log(await db.exec('DELETE FROM guild_modules'))
})

export default app
