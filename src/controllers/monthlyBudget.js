'use strict';

import express from 'express';

import models from './../config/db';
import { TransformSequelizeValidationError, apiError } from './../helpers/errors';

var router = express.Router();

router.get('/', (req, res) => {

    models.MonthlyBudget.findAll().then(monthlyBudgets => {
        res.send(monthlyBudgets.map(monthlyBudget => {
            return monthlyBudget.toJson();
        }));
    });

});

router.get('/:monthlyBudgetId', (req, res) => {

    models.MonthlyBudget.findById(req.params['monthlyBudgetId']).then(monthlyBudget => {
        if (monthlyBudget) {
            res.send(monthlyBudget.toJson())
        } else {
            res.status(404).send({ message: 'Wybrany miesięczny budzet nie istnieje' });
        }
    });

});

router.post('/', (req, res) => {

    models.MonthlyBudget.create(req.body).then(monthlyBudget => {
        res.send(monthlyBudget.toJson())
    }).catch(e => {
        // res.status(422).send(e);
        res.status(422).send(apiError(e));
    });

});

router.put('/:monthlyBudgetId', (req, res) => {

    models.MonthlyBudget.findById(req.params['monthlyBudgetId']).then(monthlyBudget => {
        if (monthlyBudget) {
            monthlyBudget.update(req.body).then(self => {
                res.send(self.toJson());
            });
        } else {
            res.status(404).send({ message: 'Wybrany miesięczny budzet nie istnieje' });
        }
    }).catch(e => {
        res.status(422).send({ message: 'Błąd podczas aktualizowania budzetu' });
    });

});

router.delete('/:monthlyBudgetId', (req, res) => {

    models.MonthlyBudget.destroy({ where: { id: req.params['monthlyBudgetId'] } }).then(deletedRows => {
        if (deletedRows > 0) {
            res.send({ message: 'Wybrany budze został pomyślnie usunięty' });
        } else {
            res.status(404).send({ message: 'Wybrany miesięczny budzet nie istnieje' });
        }
    }).catch(e => {
        res.status(500).send({ message: 'Błąd podczas usuwania budzetu' });
    });

});


export default router;