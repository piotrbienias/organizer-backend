'use strict';
import express from 'express';

import models from './../config/db';
import { apiError, responseApiError } from './../helpers/errors';
import { checkIfUserHasPermission } from './../helpers/auth';


export default (io) => {

    var router = express.Router();


    // check if user can manage reminders
    router.use((req, res, next) => {
        checkIfUserHasPermission('can-manage-reminders', req, res, next);
    });


    // get available target models
    router.get('/target_models', (req, res) => {

        res.send({ targetModels: models.Reminder.availableTargetModels() });

    });


    // return all reminders
    router.get('/', (req, res) => {

        var query = {
            limit: req.query['perPage'] || undefined,
            offset: req.query['page'] ? (req.query['page'] - 1) * req.query['perPage'] : undefined,
            order: [['date', 'DESC']],
            paranoid: false
        };

        models.Reminder.scope(['withUsers']).findAll(query).then(reminders => {

            res.send(reminders.map(reminder => {
                return reminder.serialize();
            }));
            
        });

    });


    // count all reminders
    router.get('/count', (req, res) => {

        models.Reminder.count().then(count => {
            res.send({ count: count });
        }).catch(e => {
            responseApiError(e, res);
        });

    });


    // return single reminder with id = reminderId
    router.get('/:reminderId', (req, res) => {

        models.Reminder.scope(['withUsers']).findById(req.params['reminderId']).then(reminder => {
            if (reminder) {
                reminder = reminder.serialize();

                if (req.query['includeTarget'] === '1' && reminder.target && models[reminder.targetModel]) {
                    models[reminder.targetModel].findById(reminder.target, { paranoid: false }).then(target => {
                        reminder.target = target.serialize ? target.serialize() : target.toJSON();
                        res.send(reminder);
                    });
                } else {
                    res.send(reminder);
                }
            } else {
                res.status(404).send({ message: 'Poszukiwany obiekt nie istnieje' });
            }
        });

    });


    // get associated target data of single reminder with id = reminderId
    router.get('/:reminderId/get_target_data', (req, res) => {

        models.Reminder.scope(['withUsers']).findById(req.params['reminderId']).then(reminder => {
            if (reminder) {
                reminder.getTargetData().then(targetData => {
                    res.send(targetData);
                });
            } else {
                res.status(404).send({ message: 'Poszukiwany obiekt nie istnieje' });
            }
        });

    });


    // create reminder
    router.post('/', (req, res) => {
        
        models.Reminder.createReminder(req.body).then(reminder => {
            res.send(reminder.serialize());
        }).catch(e => {
            responseApiError(e, res);
        });

    });


    // update single reminder with id = reminderId
    router.put('/:reminderId', (req, res) => {

        models.Reminder.updateReminder(req.params['reminderId'], req.body).then(reminder => {
            if ( reminder ) {
                res.send(reminder.serialize());
            } else {
                res.status(404).send({ message: 'Poszukiwany obiekt nie istnieje' });
            }
        }).catch(e => {
            responseApiError(e, res);
        });

    });


    // delete single reminder with id = reminderId
    router.delete('/:reminderId', (req, res) => {

        models.Reminder.destroy({ where: { id: req.params['reminderId'] } }).then(deletedRows => {
            if (deletedRows > 0) {
                res.send({ message: 'Obiekt został pomyślnie usunięty' });
            } else {
                res.status(404).send({ message: 'Poszukiwany obiekt nie istnieje' });
            }
        }).catch(e => {
            responseApiError(e, res);
        });

    });

    return router;

};