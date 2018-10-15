import * as express from 'express';


const app =  express()

app.get('/', (req, res) => {
    res.send('Test service')
})
app.listen(3001, () => {
    console.log('Example app listening on port 3010', {session_user: 'user1'});
    try {
        throw new Error('test error');
    }
    catch (e){
    }
})