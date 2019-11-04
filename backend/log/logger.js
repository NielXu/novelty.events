const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            dirname: __dirname,
            filename: 'combined.log',
            level: 'info',
            options: {
                flags: 'w'
            }
        }),
        new winston.transports.File({
            dirname: __dirname,
            filename: 'errors.log',
            level: 'error',
            options: {
                flags: 'w'
            }
        })
    ]
});

const dblogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            dirname: __dirname,
            filename: 'database.combined.log',
            options: {
                flags: 'w'
            }
        }),
        new winston.transports.File({
            dirname: __dirname,
            filename: 'database.errors.log',
            level: 'error',
            options: {
                flags: 'w'
            }
        })
    ]
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if(process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
    dblogger.add(new winston.transports.Console({
        format: winston.format.simple()
    }))
}

module.exports = {
    logger: logger,
    dblogger: dblogger,
}