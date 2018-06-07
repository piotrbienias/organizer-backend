'use strict';

import express from 'express';

import models from './../config/db';
import { apiError } from './../helpers/errors';


export default (io) => {

    var router = express.Router();


    // return all events
    router.get('/', (req, res) => {

        var month = req.query['month'] || undefined;
        var year = req.query['year'] || new Date().getFullYear();

        var queryOptions = {};
        if (month && year) {
            var minDate = new Date(year, month, 1);
            var maxDate = new Date(year, month, 31);
            queryOptions.where = {
                date: {
                    $lte: maxDate,
                    $gte: minDate
                }
            };
        }

        models.Event.scope(['withOrganizer', 'withMembers']).findAll(queryOptions).then(events => {
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

        var deleteAll = req.query['deleteAll'] === 'true';

        models.Event.deleteEvent(req.params['eventId'], deleteAll).then(() => {
            res.send({ message: 'Obiekt został pomyślnie usunięty' });
        }).catch(e => {
            res.status(500).send(apiErro(e));
        })

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