import { lg } from 'utils/logger'
import { mailTransporter } from './mailing.transporter'

type SendMailOptions = {
  from: string
  to: string
  subject: string
  html: string
}
export class MailingService {
  public sendMail(options: SendMailOptions) {
    return new Promise<void>((resolve, reject) => {
      mailTransporter.sendMail(
        {
          from: options.from,
          to: options.to,
          subject: options.subject,
          html: options.html,
        },
        function (error) {
          if (error) {
            lg.error(`E_MAIL_SEND ${(error as Error).message}`)
            reject((error as Error).message)
          } else {
            resolve()
          }
        }
      )
    })
  }
}
