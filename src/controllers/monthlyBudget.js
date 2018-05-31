'use strict';

import express from 'express';

import models from './../config/db';
import { checkIfUserHasPermission } from './../helpers/auth';
import { TransformSequelizeValidationError, apiError } from './../helpers/errors';
import { find } from 'underscore';


var router = express.Router();


// check if user has the permission to manage monthly budgets
router.use((req, res, next) => {
    checkIfUserHasPermission('can-manage-monthly-budgets', req, res, next);
});


// return all monthly budgets
router.get('/', (req, res) => {

    models.MonthlyBudget.scope(['withExpenses']).findAll().then(monthlyBudgets => {
        res.send(monthlyBudgets.map(monthlyBudget => {
            return monthlyBudget.serialize();
        }));
    });

});


// return single monthly budget with id = monthlyBudgetId
router.get('/:monthlyBudgetId', (req, res) => {

    models.MonthlyBudget.findById(req.params['monthlyBudgetId']).then(monthlyBudget => {
        if (monthlyBudget) {
            res.send(monthlyBudget.serialize())
        } else {
            res.status(404).send({ message: 'Wybrany miesięczny budzet nie istnieje' });
        }
    });

});


// create new monthly budget
router.post('/', (req, res) => {

    models.MonthlyBudget.create(req.body).then(monthlyBudget => {
        res.send(monthlyBudget.serialize())
    }).catch(e => {
        // res.status(422).send(e);
        res.status(422).send(apiError(e));
    });

});


// update one monthly budget with id = monthlyBudgetId
router.put('/:monthlyBudgetId', (req, res) => {

    models.MonthlyBudget.findById(req.params['monthlyBudgetId']).then(monthlyBudget => {
        if (monthlyBudget) {
            monthlyBudget.update(req.body).then(self => {
                res.send(self.serialize());
            });
        } else {
            res.status(404).send({ message: 'Wybrany miesięczny budzet nie istnieje' });
        }
    }).catch(e => {
        res.status(422).send({ message: 'Błąd podczas aktualizowania budzetu' });
    });

});


// delete one monthly budget with id = monthlyBudgetId
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