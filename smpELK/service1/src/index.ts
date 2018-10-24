import * as express from 'express';
import {logger} from './logger';

const app =  express()

app.get('/', (req, res) => {
    logger.info('request recieved');
    res.send('Service1 success');
})


app.listen(3001, () => {
    logger.info('Service1: Example app listening on port 3001', {session_user: 'user1'}, {prop2_flag: true});
    logger.error('error occured', new Error('test error message'));
})


