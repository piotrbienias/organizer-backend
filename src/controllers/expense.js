'use strict';

import express from 'express';

import models from './../config/db';
import { apiError } from './../helpers/errors';
import { checkIfUserHasPermission } from './../helpers/auth';


var router = express.Router();


// check if user has permission to manage budgets
router.use((req, res, next) => {
    checkIfUserHasPermission('can-manage-monthly-budgets', req, res, next);
});


// return all expenses
router.get('/', (req, res) => {

    models.Expense.scope(['withMonthlyBudget']).findAll().then(expenses => {
        res.send(expenses.map(expense => { return expense.serialize() }));
    });

});


// return single expense with id = expenseId
router.get('/:expenseId', (req, res) => {

    models.Expense.scope(['withMonthlyBudget']).findById(req.params['expenseId']).then(expense => {
        if (expense) {
            res.send(expense.serialize());
        } else {
            res.status(404).send({ message: 'Poszukiwany obiekt nie istnieje', statusCode: 404 });
        }
    });

});


// create new expense
router.post('/', (req, res) => {

    models.Expense.create(req.body).then(expense => {
        expense.reload({ include: [ models.MonthlyBudget ] }).then(self => {
            res.send(self.serialize());
        });
    }).catch(e => {
        res.status(422).send(apiError(e));
    });

});


// update single expense with id = expenseId
router.put('/:expenseId', (req, res) => {

    models.Expense.findById(req.params['expenseId']).then(expense => {
        if (expense) {
            expense.update(req.body).then(self => {
                self.reload({ include: [ models.MonthlyBudget ] }).then(expense => {
                    res.send(expense.serialize());
                });
            })
        } else {
            res.status(404).send({ message: 'Poszukiwany obiekt nie istnieje', statusCode: 404 });
        }
    }).catch(e => {
        res.status(422).send(apiError(e));
    });

});


// delete single expense with id = expenseId
router.delete('/:expenseId', (req, res) => {

    models.MonthlyBudget.destroy({ where: { id: req.params['expenseId'] } }).then(deletedRows => {
        if (deletedRows > 0) {
            res.send({ message: 'Obiekt został pomyślnie usunięty' });
        } else {
            res.status(404).send({ message: 'Poszukiwany obiekt nie istnieje', statusCode: 404 });
        }
    }).catch(e => {
        res.status(422).send(apiError(e));
    });

});


export default router;