import { createLogger, format, transports } from 'winston'

export const lg = createLogger({
  transports: [
    new transports.File({
      filename: 'pynspel.error.log',
      level: 'error',
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json()
      ),
    }),
    new transports.File({
      filename: 'pynspel.info.log',
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize({ all: true }),
        format.label({
          label: 'PYNSPEL',
        }),
        format.printf(
          (log): string =>
            `[${log.label}] | ${log.timestamp} [${log.level}]: ${log.message}`
        )
      ),
    }),
  ],
})
