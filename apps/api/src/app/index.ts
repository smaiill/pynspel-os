import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import 'express-async-errors'
import session from 'express-session'
import morgan from 'morgan'
import routes from 'routes'
import { API_ENDPOINT } from 'utils/constants'
import { customHeaders } from 'utils/custom.headers'
import { env } from 'utils/env'
import { errorHandler } from 'utils/error.handler'
import { lg } from 'utils/logger'
import { deserializeSession } from 'utils/session'

const PORT = env.PORT

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

app.listen(PORT, () => {
  lg.info(`[API] Started at port: ${PORT}`)
})

export default app
