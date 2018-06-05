'use strict';

import express from 'express';

import models from './../config/db';
import { apiError } from './../helpers/errors';


export default (io) => {

    var router = express.Router();


    // return all events
    router.get('/', (req, res) => {

        models.Event.scope(['withOrganizer', 'withMembers']).findAll().then(events => {
            res.send(events.map(event => {
                return event.serialize();
            }));
        });

    });


    // return single event with id = eventId
    router.get('/:eventId', (req, res) => {

        models.Event.scope(['withOrganizer', 'withMembers']).findById(req.params['eventId']).then(event => {
            if (event) {
                res.send(event.serialize());
            } else {
                res.status(404).send({ message: 'Poszukiwany obiekt nie istnieje' });
            }
        });

    });

    // create new event
    router.post('/', (req, res) => {

        models.Event.createRepeatableEvent(req).then(result => {
            if (Array.isArray(result)) {
                res.send(result.map(event => {
                    return event.serialize();
                }))
            } else {
                res.send(result.serialize());
            }
        }).catch(e => {
            res.status(422).send(apiError(e));
        });

    });


    // update single event with id = eventId
    router.put('/:eventId', (req, res) => {

        models.Event.findById(req.params['eventId']).then(event => {
            if (event) {
                event.update(req.body).then(self => {
                    self.reload({ include: [ models.User ] }).then(event => {
                        res.send(event.serialize());
                    });
                });
            } else {
                res.status(404).send({ message: 'Poszukiwany obiekt nie istnieje' });
            }
        }).catch(e => {
            res.status(422).send(apiError(e));
        });

    });


    // delete single event with id = eventId
    router.delete('/:eventId', (req, res) => {

        models.Event.destroy({ where: { id: req.params['eventId'] } }).then(deletedRows => {
            if (deletedRows > 0) {
                res.send({ message: 'Obiekt został usunięty' });
            } else {
                res.status(404).send({ message: 'Poszukiwany obiekt nie istnieje' });
            }
        }).catch(e => {
            res.status(500).send(apiError(e));
        });

    });


    // get members of event with id = eventId
    router.get('/:eventId/members/', (req, res) => {

        models.Event.findById(req.params['eventId']).then(event => {
            if (event) {
                event.getMembers().then(members => {
                    res.send(members.map(member => {
                        return member.serialize();
                    }));
                });
            } else {
                res.status(404).send({ message: 'Poszukiwany obiekt nie istnieje' });
            }
        });

    });

    return router;

};