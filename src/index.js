import express from 'express';
import socketIO from 'socket.io';
import bodyParser from 'body-parser';

import routers from './controllers';
import { verifyTokenMiddleware } from './helpers/auth';



var app = express();
var server = app.listen(3000, () => { console.log('Express app is listening on port 3000') });
var io = socketIO(server);


app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', 0);
    next();
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Access, Authorization');
    next();
});

if ( !process.env.OMIT_AUTH ) {
    app.use(/^((?!\/auth\/login\/)).*$/, verifyTokenMiddleware);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routers(io));
