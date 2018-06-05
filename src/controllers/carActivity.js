import express from 'express';

import db from '../config/db';
import { TransformSequelizeValidationError } from '../helpers/errors';

var router = express.Router();

router.get('/', (req, res) => {

    db.CarActivity.findAll({ order: [['createdAt', 'DESC']] }).then(activities => {
        res.send(activities.map(activity => {
            return activity.serialize()
        }));
    });

});

router.post('/', (req, res) => {

    db.CarActivity.create(req.body).then(activity => {
        res.send(activity.serialize());
    }).catch(e => {
        res.status(400).send(TransformSequelizeValidationError(e));
    });

});

router.put('/:carActivityId', (req, res) => {

    db.CarActivity.findById(req.params['carActivityId']).then(activity => {
        if (activity) {
            activity.update(req.body).then(activity => {
                res.send(activity.serialize());
            });
        } else {
            res.status(404).send({ message: 'Podana aktywność nie istnieje' });
        }
    });

});

router.delete('/:carActivityId', (req, res) => {

    db.CarActivity.findById(req.params['carActivityId']).then(activity => {
        if (activity) {
            activity.destroy().then(() => {
                res.send({ message: 'Aktywność została usunięta prawidłowo', status: 200 });
            }).catch(e => {
                res.status(400).send({ message: 'Błąd podczas usuwania aktywności', status: 400 });
            })
        } else {
            res.status(404).send({ message: 'Podana aktywność nie istnieje', status: 404 });
        }
    });

});


export default router;