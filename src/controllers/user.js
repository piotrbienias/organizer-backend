import express from 'express';

import db from '../config/db';
import { TransformSequelizeValidationError } from '../helpers/errors';

var router = express.Router();

router.get('/', (req, res) => {
    db.User.scope(['withUserCategory', 'withPermissions']).findAll().then(users => {
        res.send(users.map(user => {
            return user.toJson();
        }));
    });
});

router.get('/:userId', (req, res) => {
    db.User.scope(['withUserCategory', 'withPermissions']).findById(req.params['userId']).then(user => {
        if(user) {
            res.send(user.toJson());
        } else {
            res.status(404).send({ message: 'User with given ID does not exist' });
        }
    });
});

router.post('/', (req, res) => {
    db.User.create(req.body).then(user => {
        user.reload({ include: [ db.UserCategory ] }).then(self => {
            res.send(self.toJson());
        });
    }).catch(e => {
        res.status(400).send(TransformSequelizeValidationError(e));
    });
});

router.put('/:userId', (req, res) => {
    db.User.findById(req.params.userId).then(user => {
        if (user) {
            user.update(req.body).then(user => {
                user.reload({ include: [ db.UserCategory ] }).then(self => {
                    res.send(self.toJson());
                });
            });
        } else {
            res.status(404).send({ message: 'User with given ID does not exist' });
        }
    }).catch(e => {
        res.status(400).send(TransformSequelizeValidationError(e));
    });
});

router.delete('/:userId', (req, res) => {
    db.User.findById(req.params.userId).then(user => {
        if (user) {
            user.destroy().then(() => {
                res.send({ message: 'Wybrany uzytkownik został usunięty' });
            });
        } else {
            res.status(404).send({ message: 'Wybrany uzytkownik nie istnieje' });
        }
    }).catch(e => {
        res.status(400).send({ message: 'Błąd podczas usuwania uzytkownika' });
    });
});


export default router;