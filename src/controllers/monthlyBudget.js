'use strict';

import express from 'express';

import models from './../config/db';
import { checkIfUserHasPermission } from './../helpers/auth';
import { TransformSequelizeValidationError, apiError } from './../helpers/errors';
import { find } from 'underscore';


export default (io) => {

    var router = express.Router();

    const UPDATE_MONTHLY_BUDGET_LIST = 'UPDATE_MONTHLY_BUDGET_LIST';


    // check if user has the permission to manage monthly budgets
    router.use((req, res, next) => {
        checkIfUserHasPermission('can-manage-monthly-budgets', req, res, next);
    });

    router.get('/count/', (req, res) => {

        models.MonthlyBudget.count({ paranoid: false }).then(numberOfRows => {
            res.send({ numberOfRows: numberOfRows });
        }).catch(e => {
            res.status(500).send(apiError(e));
        });

    });


    // return all monthly budgets
    router.get('/', (req, res) => {

        var queryOptions = {
            paranoid: false,
            order: [['year', 'DESC'], ['month', 'DESC']],
            limit: req.query['perPage'],
            offset: (req.query['page'] - 1) * req.query['perPage']
        };

        models.MonthlyBudget.scope(['withExpenses']).findAll(queryOptions).then(monthlyBudgets => {
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
            res.send(monthlyBudget.serialize());

            io.sockets.emit(UPDATE_MONTHLY_BUDGET_LIST);
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

                    io.sockets.emit(UPDATE_MONTHLY_BUDGET_LIST);
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

                io.sockets.emit(UPDATE_MONTHLY_BUDGET_LIST);
            } else {
                res.status(404).send({ message: 'Wybrany miesięczny budzet nie istnieje' });
            }
        }).catch(e => {
            res.status(500).send({ message: 'Błąd podczas usuwania budzetu' });
        });

    });


    // restore one monthly budget with id = monthlyBudgetId
    router.put('/:monthlyBudgetId/restore/', (req, res) => {

        models.MonthlyBudget.findById(req.params['monthlyBudgetId'], { paranoid: false }).then(monthlyBudget => {
            if (monthlyBudget && !!monthlyBudget.get('deletedAt')) {
                monthlyBudget.restore().then(() => {
                    res.send({ message: 'Wybranyy budzet miesięczny został przywrócony' });

                    io.sockets.emit(UPDATE_MONTHLY_BUDGET_LIST);
                });
            } else {
                res.status(404).send({ message: 'Poszukiwany obiekt nie istnieje' });
            }
        }).catch(e => {
            res.status(500).send({ message: 'Błąd podczas przywracania budzetu' });
        });

    });


    // get expenses of single monthly budget with id = monthlyBudgetId
    router.get('/:monthlyBudgetId/expenses/', (req, res) => {

        models.MonthlyBudget.findById(req.params['monthlyBudgetId'], { paranoid: false }).then(monthlyBudget => {
            if (monthlyBudget) {
                monthlyBudget.getExpenses().then(expenses => {
                    res.send(expenses.map(expense => {
                        return expense.serialize();
                    }));
                });
            } else {
                res.status(404).send({ message: 'Poszukiwany obiekt nie istnieje' });
            }
        });

    });


    // set expenses of single monthly budget with id = monthlyBudgetId
    router.put('/:monthlyBudgetId/expenses/', (req, res) => {

        models.MonthlyBudget.findById(req.params['monthlyBudgetId'], { paranoid: false }).then(monthlyBudget => {
            if (monthlyBudget) {
                var existingExpenses = [];
                var newExpenses = [];
                var deletedExpenses = req.body['deletedExpenses'] || [];

                req.body['expenses'].forEach(expense => {
                    if (expense.id) {
                        existingExpenses.push(expense);
                    } else {
                        newExpenses.push(expense);
                    }
                });

                return models.sequelize.transaction(t => {
                    return models.Expense.bulkCreate(newExpenses, { transaction: t }).then(result => {

                        var promisesArray = [];
                        existingExpenses.forEach(existingExpense => {
                            promisesArray.push(
                                models.Expense.update(
                                    existingExpense,
                                    {
                                        where: { id: existingExpense.id },
                                        transaction: t
                                    }
                                )
                            );
                        });

                        if (Array.isArray(deletedExpenses) && deletedExpenses.length > 0) {
                            promisesArray.push(
                                models.Expense.destroy({ where: { id: { $in: deletedExpenses } }, transaction: t })
                            );
                        }

                        return Promise.all(promisesArray);
                    });
                }).then(result => {
                    res.send({ message: 'Budzet został zaktualizowany' })
                }).catch(e => {
                    res.send(apiError(e));
                });
            } else {
                res.status(404).send({ message: 'Poszukiwany obiekt nie istnieje' });
            }
        }).catch(e => {
            res.status(422).send(apiError(e));
        });

    });

    return router;

};