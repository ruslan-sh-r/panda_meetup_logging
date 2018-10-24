import {createLogger, transports, format} from 'winston';
import { LogstashTransport } from 'winston-logstash-transport';

const formatMessage = info => {
    const metas = (<any>info)[Symbol.for('splat')];
    const errorObj = metas && metas.find(x => x instanceof Error);
    let {timestamp, level, message, ...rest} = info;
    const meta = errorObj ? errorObj.stack : rest ? JSON.stringify(rest, null, 4): '';
    return `[${timestamp}] ${level}: ${message}\n${meta}`;
}

const addServiceId = format(info => {
    info.service = 'service1';
    return info;
});

const addErrorStack = format(info => {
    const metas = (<any>info)[Symbol.for('splat')];
    const errorObj = metas && metas.find(x => x instanceof Error);
    if (errorObj)
        info.error = errorObj.stack;

    return info;
});


export const logger = createLogger({
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
            host: '81.177.3.7',
            format: format.combine(
                addServiceId(),
                addErrorStack(),
                format.json()
            ),
            handleExceptions: true
        })
    ],
    exitOnError: false
})