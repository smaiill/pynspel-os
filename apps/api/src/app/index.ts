import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import 'express-async-errors'
import session from 'express-session'
import { db } from 'modules/db'
import morgan from 'morgan'
import routes from 'routes'
import { API_ENDPOINT } from 'utils/constants'
import { customHeaders } from 'utils/custom.headers'
import { env } from 'utils/env'
import { errorHandler } from 'utils/error.handler'
import { lg } from 'utils/logger'
import { redis } from 'utils/redis'
import { deserializeSession } from 'utils/session'
import { z } from 'zod'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

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
app.use(deserializeSession)
app.use(API_ENDPOINT, routes)
app.use(errorHandler)

app.listen(env.PORT, async () => {
  lg.info(`[API] Started at port: ${env.PORT}`)
  await redis.connect()

  console.log(await redis.ping())

  // console.log(await db.exec('INSERT INTO tests (name) VALUES ($1)', ['caca']))

  // await db.exec('DELETE FROM users; DELETE FROM sessions;')
  await db.exec('DELETE FROM guild_modules;')
  console.log(await db.exec('SELECT * FROM guild_modules'))
  // console.log(
  //   await db.exec('UPDATE modules SET name = $1 WHERE module_id = $2', [
  //     'captcha',
  //     '882145010350129153',
  //   ])
  // )

  // console.log(securityModuleConfigSchema.safeParse({ length: 4 }))

  // console.log(await DbWrapper.exec('SELECT * FROM modules'))
})

export default app
