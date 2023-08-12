import { createLogger, format, transports } from 'winston'

export const logger = createLogger({
  transports: [
    new transports.File({
      filename: 'pynspel.client.log',
      level: 'silly',
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json()
      ),
    }),
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize({ all: true }),
        format.label({
          label: 'PYNSPEL-CLIENT',
        }),
        format.printf(
          (log): string =>
            `[${log.label}] | ${log.timestamp} [${log.level}]: ${log.message}`
        )
      ),
    }),
  ],
})
