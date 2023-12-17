import { createTransport } from 'nodemailer'

export const MAILS_FROM = {
  ME: 'smailaberkaoui@gmail.com',
}

export const mailTransporter = createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: 'smailaberkaoui@gmail.com',
    pass: 'XvUGJAjsWBKPDacN',
  },
})
