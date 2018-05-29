import express from 'express';

import models from './../config/db';

var router = express.Router();


router.get('/', (req, res) => {

    models.Permission.findAll().then(permissions => {
        res.send(permissions.map(permission => {
            return permission.toJson();
        }));
    }).catch(e => {
        res.status(400).send(e);
    });

});


export default router;