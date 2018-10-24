import * as express from 'express';
import {createLogger, transports, format} from 'winston';
import { LogstashTransport } from 'winston-logstash-transport'

const app =  express()

const formatMessage = info => {
    const metas = (<any>info)[Symbol.for('splat')];
    const errorObj = metas && metas.find(x => x instanceof Error);
    let {timestamp, level, message, ...rest} = info;
    const meta = errorObj ? errorObj.stack : rest ? JSON.stringify(rest, null, 4): '';
    return `[${timestamp}] ${level}: ${message}\n${meta}`;
}

const logger = createLogger({
    transports:[
        new transports.Console({
            level: 'debug',
            format: format.combine(
                format.timestamp(),              // Adds info.timestamp
                format.colorize(),               // Colorizes { level, message } on the info
                format.align(),                  // Prepends message with `\t`
                format.printf(formatMessage)
            )
        }),
        new transports.File({
            level: 'info',
            filename: './test_app.log',
            format: format.combine(
                format.timestamp(),              // Adds info.timestamp
                format.printf(formatMessage)
            ),
            handleExceptions: true
        }),
        new LogstashTransport({
            port: 28777,
            host: '127.0.0.1',
            format: format.combine(
                format.json()
            ),
            handleExceptions: true
        })
    ],
    exitOnError: false
})

app.get('/', (req, res) => {
    logger.info('request recieved');
    res.send('Service1 success');
})

app.listen(3001, () => {
    logger.info('Example app listening on port 3010', {session_user: 'user1'}, {prop2_flag: true});
    logger.error('error occured', new Error('test error message'));
})


