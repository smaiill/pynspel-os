import { createTransport } from 'nodemailer'
import { env } from 'utils/env'

export const mailTransporter = createTransport({
  host: env.SMTP_HOST,
  port: 587,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
})
