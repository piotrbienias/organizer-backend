'use strict';

import Sequelize from 'sequelize';


class Expense extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
            value: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    notNull: { msg: 'Wartość wydatku jest obowiązkowa' }
                }
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Data wydatku jest obowiązkowa' }
                }
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Opis wydatku jest obowiązkowy' }
                }
            },
            monthlyBudgetId: {
                type: Sequelize.INTEGER,
                references: {
                    model: sequelize.models.MonthlyBudget,
                    key: 'id'
                }
            }
        }, {
            sequelize: sequelize,
            timestamps: true,
            paranoid: true,
            tableName: 'expenses',
            scopes: {
                withMonthlyBudget: function() {
                    return {
                        include: {
                            model: sequelize.models.MonthlyBudget
                        }
                    };
                }
            },
            setterMethods: {
                monthlyBudget: function(monthlyBudgetId) {
                    return this.setDataValue('monthlyBudgetId', monthlyBudgetId);
                }
            }
        });
    }

    static associate(models) {
        this.belongsTo(models.MonthlyBudget, { foreignKey: 'monthlyBudgetId' });
    }

    serialize() {
        var expense = {
            id:             this.get('id'),
            value:          this.get('value'),
            date:           this.get('date'),
            description:    this.get('description'),
            deletedAt:      this.get('deletedAt')
        };

        expense.monthlyBudget = this.MonthlyBudget ? this.MonthlyBudget.serialize() : this.get('monthlyBudgetId');

        return expense;
    }

}


export default Expense;