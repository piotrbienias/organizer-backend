'use strict';

import Sequelize from 'sequelize';


class ReminderUser extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
            reminderId: {
                type: Sequelize.INTEGER,
                references: {
                    model: sequelize.models.Reminder,
                    key: 'id'
                },
                allowNull: false,
                primaryKey: true
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: sequelize.models.User,
                    key: 'id'
                },
                allowNull: false,
                primaryKey: true
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            }
        }, {
            sequelize: sequelize,
            timestamps: false,
            paranoid: false,
            tableName: 'reminder_users'
        });
    }

    static associate(models) {
        this.belongsTo(models.Reminder, { foreignKey: 'reminderId', as: 'reminder' });
        this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }

    serialize() {

    }

}


export default ReminderUser;