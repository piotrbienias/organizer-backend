import express from 'express';

import db from '../config/db';
import { TransformSequelizeValidationError, apiError } from '../helpers/errors';


export default (io) => {

    var router = express.Router();
    const UPDATE_USER_LIST = 'UPDATE_USER_LIST';

    // return number of all users
    router.get('/count', (req, res) => {

        db.User.count({ paranoid: false, where: { id: { $ne: req.user.id } } }).then(numberOfRows => {
            res.send({ numberOfRows: numberOfRows });
        });

    });


    // get all users
    router.get('/', (req, res) => {
        var queryOptions = {
            paranoid: false,
            limit: req.query['perPage'] || undefined,
            offset: req.query['page'] ? (req.query['page'] - 1) * req.query['perPage'] : undefined,
            order: [['username', 'ASC']]
        };

        db.User.scope(['withUserCategory', 'withPermissions']).findAll(queryOptions).then(users => {
            res.send(users.map(user => {
                return user.serialize();
            }));
        });
    });


    // get single user with id = userId
    router.get('/:userId', (req, res) => {
        db.User.scope(['withUserCategory', 'withPermissions']).findById(req.params['userId']).then(user => {
            if(user) {
                res.send(user.serialize());
            } else {
                res.status(404).send({ message: 'User with given ID does not exist' });
            }
        });
    });


    // create new user
    router.post('/', (req, res) => {
        var permissions = req.body['permissions'];
        delete req.body['permissions'];

        db.User.create(req.body).then(user => {
            if (permissions && Array.isArray(permissions)) {
                user.setPermissions(permissions).then(() => {
                    user.reload({ include: [ db.UserCategory, { model: db.Permission, as: 'Permissions' } ] }).then(self => {
                        var user = self.serialize();
                        res.send(user);

                        io.sockets.emit(UPDATE_USER_LIST, user);
                        
                    });
                });
            } else {
                user.reload({ include: [ db.UserCategory, { model: db.Permission, as: 'Permissions' } ] }).then(self => {
                    res.send(self.serialize());
                });
            }
        }).catch(e => {
            res.status(422).send(apiError(e));
        });
    });


    // update single user with id = userId
    router.put('/:userId', (req, res) => {
        var permissions = req.body['permissions'];
        delete req.body['permissions'];

        db.User.findById(req.params.userId).then(user => {
            if (user) {
                user.update(req.body).then(user => {
                    if (permissions && Array.isArray(permissions)) {
                        user.setPermissions(permissions).then(() => {
                            user.reload({ include: [ db.UserCategory, { model: db.Permission, as: 'Permissions' } ] }).then(self => {
                                var user = self.serialize();
                                res.send(user);

                                io.sockets.emit(UPDATE_USER_LIST, user);
                            });
                        });
                    } else {
                        user.reload({ include: [ db.UserCategory, { model: db.Permission, as: 'Permissions' } ] }).then(self => {
                            res.send(self.serialize());
                        });
                    }
                });
            } else {
                res.status(404).send({ message: 'User with given ID does not exist' });
            }
        }).catch(e => {
            res.status(400).send(TransformSequelizeValidationError(e));
        });
    });


    // delete single user with id = userId
    router.delete('/:userId', (req, res) => {
        db.User.findById(req.params.userId).then(user => {
            if (user) {
                user.destroy().then(() => {
                    res.send({ message: 'Wybrany uzytkownik został usunięty' });

                    console.log(UPDATE_USER_LIST);
                    io.sockets.emit(UPDATE_USER_LIST, user.id);
                });
            } else {
                res.status(404).send({ message: 'Wybrany uzytkownik nie istnieje' });
            }
        }).catch(e => {
            res.status(400).send({ message: 'Błąd podczas usuwania uzytkownika' });
        });
    });


    // restore single user with id = userId
    router.put('/:userId/restore/', (req, res) => {
        db.User.findById(req.params.userId, { paranoid: false }).then(user => {
            if (user) {
                user.restore().then(() => {
                    user.reload({ include: [ db.UserCategory, { model: db.Permission, as: 'Permissions' } ] }).then(self => {
                        var user = self.serialize();

                        res.send(user);

                        io.sockets.emit(UPDATE_USER_LIST, user);
                    });
                });
            } else {
                res.status(404).send({ message: 'Wybrany uzytkownik nie istniejee' });
            }
        }).catch(e => {
            res.status(400).send({ message: e.message });
        });
    });

    return router;

};


