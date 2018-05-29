import express from 'express';
import routers from './controllers';
import db from './config/db';
import bodyParser from 'body-parser';
import { verifyTokenMiddleware } from './helpers/auth';

var app = express();


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

// app.use(/^((?!\/auth\/login\/)).*$/, verifyTokenMiddleware);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routers);

app.get('/', (req, res) => {
    res.send({ message: 'Hello world :D' });
});

app.listen(3000, () => console.log('Example app listening on port 3000'));