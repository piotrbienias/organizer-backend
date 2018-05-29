import express from 'express';

import models from './../config/db';
import { createToken } from './../helpers/auth';

var router = express.Router();

router.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    models.User.scope(['withUserCategory', 'withPermissions']).findByUsername(req.body.username).then(user => {
        if (user && user.validatePassword(req.body.password)) {
            var userData = user.toJson();

            res.send({
                message: 'Login successfull',
                user: userData,
                token: createToken(userData)
            });
        } else {
            res.status(400).send({ message: 'Wrong username or password' });
        }
    })
});

router.post('/logout', (req, res) => {
    res.send({ message: 'Logout successfull' });
});


export default router;