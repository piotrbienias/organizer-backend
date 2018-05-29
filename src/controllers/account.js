import express from 'express';

import models from './../config/db';

var router = express.Router();


router.put('/update_password', (req, res) => {
    if (req.user) {
        models.User.findById(req.user.id).then(user => {
            if (!req.body.password) {
                res.status(422).send({ message: 'Proszę podać nowe hasło' });
            } else {
                user.changePassword(req.body.password).then(self => {
                    res.send({ message: 'Hasło zostało zmienione' });
                });
            }
        }).catch(e => {
            res.status(400).send({ message: 'Błąd podczas wykonywania operacji' });
        })
    } else {
        res.status(404).send({ message: 'Uytkownik nie istnieje' });
    }
});


export default router;