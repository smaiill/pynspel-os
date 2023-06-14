import { SavedUser } from '@pynspel/types'
import 'express'

declare module 'express' {
  interface Request {
    user?: SavedUser
  }
}

declare module 'express-session' {
  interface SessionData {
    user?: SavedUser
  }
}
