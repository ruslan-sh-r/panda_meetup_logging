import * as express from 'express';
import {logger} from './logger';

const app =  express()

app.get('/', (req, res) => {
    logger.info('request recieved');
    res.send('Service1 success');
})


app.listen(3002, () => {
    logger.info('Service2: Example app listening on port 3002');
    logger.error('error occured in service 2', new Error('test error message'));
})


