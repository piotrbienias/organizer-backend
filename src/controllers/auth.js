import express from 'express';

import models from './../config/db';

var router = express.Router();

router.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    models.User.scope(['withUserCategory']).findByUsername(req.body.username).then(user => {
        if (user) {
            if (user.validatePassword(req.body.password)) {
                res.send({ message: 'Login successfull', user: user.toJson() });
            } else {
                res.status(400).send({ message: 'Wrong username or password' });
            }
        } else {
            res.status(400).send({ message: 'Wrong username or password' });
        }
    })
});


export default router;