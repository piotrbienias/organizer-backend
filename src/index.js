import express from 'express';
import Sequelize from 'sequelize';

const app = express();
const sequelize = new Sequelize( process.env.DATABASE_URL );

sequelize.authenticate().then(() => {
    console.log('Connection has been established');
}).catch(err => {
    console.error('Cannot connect to the database: ', err);
});

app.get('/', (req, res) => res.send('Hello world - tralala'));

app.listen(3000, () => console.log('Example app listening on port 3000'));