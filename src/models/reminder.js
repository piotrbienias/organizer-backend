'use strict';

import Sequelize from 'sequelize';


class Reminder extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
            name: Sequelize.STRING,
            description: Sequelize.TEXT,
            targetId: Sequelize.INTEGER,
            targetModel: {
                type: Sequelize.STRING,
                validate: {
                    isIn: {
                        args: [ Reminder.availableTargetModels() ],
                        msg: `Target model should be one of ${Reminder.availableTargetModels()}`
                    }
                }
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false
            }
        }, {
            sequelize: sequelize,
            tableName: 'reminders',
            timestamps: true,
            paranoid: true,
            setterMethods: {
                target: function(value) {
                    return this.setDataValue('targetId', value);
                }
            },
            scopes: {
                withUsers: function() {
                    return {
                        include: {
                            model: sequelize.models.User,
                            as: 'Users'
                        }
                    };
                }
            }
        });
    }

    static associate(models) {
        this.belongsToMany(models.User, { through: models.ReminderUser, foreignKey: 'reminderId', as: 'Users' });
    }

    static availableTargetModels() {
        return [null, 'Event', 'CarActivity'];
    }

    static createReminder(data) {
        var createdReminder = null;

        return this.sequelize.transaction(t => {

            return this.create(data, { transaction: t }).then(reminder => {
                createdReminder = reminder;
                return reminder.setUsers(data.users, { transaction: t, through: { date: data.date } });
            });

        }).then(() => {
            return createdReminder;
        }).catch(e => {
            console.log(e);
            throw e;
        });
    }

    static updateReminder(id, data) {

        var updatedReminder = null;

        return this.findById(id).then(reminder => {

            if ( reminder ) {
                updatedReminder = reminder;
    
                return this.sequelize.transaction(t => {
    
                    return updatedReminder.update(data, { transaction: t }).then(self => {
                        return self.setUsers(data.users, { transaction: t, through: { date: data.date } });
                    });

                }).then(() => {
                    return updatedReminder;
                }).catch(e => {
                    throw e;
                });
            } else {
                return null;
            }

        });
    }

    getTargetURL() {
        var targetID = this.get('targetId');
        var targetModel = this.get('targetModel');
        var targetURL;

        targetURL = this.sequelize.models[targetModel] ? `/${this.sequelize.models[targetModel].getTableName()}/${targetID}` : '';

        return targetURL;
    }

    getTargetData() {
        var targetId = this.get('targetId');
        var targetModel = this.get('targetModel');

        if (targetId && targetModel && Reminder.availableTargetModels().includes(targetModel)) {
            return this.sequelize.models[targetModel].findById(targetId).then(target => {
                return target ? (target.serialize ? target.serialize() : target.toJSON()) : null;
            });
        } else {
            return Promise.resolve(null);
        }
    }

    serialize() {
        var reminder = {
            id: this.get('id'),
            name: this.get('name'),
            description: this.get('description'),
            target: this.get('targetId'),
            targetModel: this.get('targetModel'),
            targetURL: this.getTargetURL(),
            emails: this.get('emails'),
            date: this.get('date'),
            isDeleted: !!this.get('deletedAt')
        };

        reminder.users = this.Users ? this.Users.map(user => { return user.serialize() }) : undefined;

        return reminder;
    }

}


export default Reminder;