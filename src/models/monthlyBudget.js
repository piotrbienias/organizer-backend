'use strict';

import Sequelize from 'sequelize';

let _MONTH_VALUES = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień'
];


class MonthlyBudget extends Sequelize.Model {

    static get MONTH_VALUES () {
        return _MONTH_VALUES;
    }

    static init(sequelize){
        return super.init({
            value: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    notNull: { msg: 'Wartość budzetu jest obowiązkowa' }
                }
            },
            year: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Rok budzetu jest obowiązkowy' }
                }
            },
            month: {
                type: Sequelize.ENUM,
                values: MonthlyBudget.MONTH_VALUES,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Miesiąc budzetu jest obowiązkowy' }
                }
            }
        }, {
            sequelize: sequelize,
            tableName: 'monthly_budgets',
            timestamps: true,
            paranoid: true,
            scopes: {
                withExpenses: function() {
                    return {
                        include: {
                            model: sequelize.models.Expense,
                            as: 'expenses'
                        }
                    }
                }
            }
        });
    }

    static associate(models) {
        this.hasMany(models.Expense, { foreignKey: 'monthlyBudgetId', as: 'expenses' });
    }

    serialize() {
        var monthlyBudget = {}
        Object.assign(monthlyBudget, this.toJSON());

        if (this.expenses) {
            var totalExpenses = 0;
            
            monthlyBudget.expenses = this.expenses.map(expense => {
                totalExpenses += parseFloat(expense.value);
                return expense.serialize();
            });

            monthlyBudget.totalExpenses = totalExpenses;
            monthlyBudget.valueLeft = parseFloat(monthlyBudget.value) - monthlyBudget.totalExpenses;
        }
        
        delete monthlyBudget['updatedAt'];
        delete monthlyBudget['createdAt'];

        return monthlyBudget;
    }
    
}


export default MonthlyBudget;