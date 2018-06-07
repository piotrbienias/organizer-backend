'use strict';

import Sequelize from 'sequelize';
import { TransformSequelizeValidationError } from '../helpers/errors';


class Event extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            duration: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: { args: 1, message: 'Czas trwania musi być dłuzszy od 0' }
                }
            },
            location: Sequelize.STRING,
            date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            repeatInterval: Sequelize.INTEGER,
            parentEventId: {
                type: Sequelize.INTEGER,
                references: {
                    model: sequelize.models.Event,
                    key: 'id'
                }
            },
            description: Sequelize.TEXT,
            organizerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: sequelize.models.User,
                    key: 'id'
                }
            }
        }, {
            sequelize: sequelize,
            timestamps: true,
            paranoid: true,
            tableName: 'events',
            setterMethods: {
                organizer: function(organizerId) {
                    return this.setDataValue('organizerId', organizerId);
                },
                parentEvent: function(parentEventId) {
                    return this.setDataValue('parentEventId', parentEventId);
                }
            },
            scopes: {
                withOrganizer: function() {
                    return {
                        include: {
                            model: sequelize.models.User
                        }
                    }
                },
                withMembers: function() {
                    return {
                        include: {
                            model: sequelize.models.User,
                            as: 'Members'
                        }
                    };
                },
                withParent: function() {
                    return {
                        include: {
                            model: sequelize.models.Event
                        }
                    }
                },
                withChildren: function() {
                    return {
                        include: {
                            model: sequelize.models.Event,
                            as: 'ChildEvents'
                        }
                    }
                }
            }
        });
    }

    static associate(models) {
        this.belongsTo(models.Event, { foreignKey: 'parentEventId' });
        this.hasMany(models.Event, { as: 'ChildEvents', foreignKey: 'parentEventId' });
        this.belongsTo(models.User, { foreignKey: 'organizerId' });
        this.belongsToMany(models.User, { through: models.EventMember, as: 'Members', foreignKey: 'eventId' });
    }

    static deleteEvent(eventId, deleteAll) {
        return this.findById(eventId).then(event => {
            if (event) {
                console.log('-----------------------');
                console.log('DELETE ALL: ', deleteAll);
                console.log('-----------------------');

                console.log(deleteAll === false);
                console.log(typeof deleteAll);

                if (!deleteAll) {
                    return event.destroy();
                } else {
                    var idToDestroy = event.get('parentEventId') ? event.get('parentEventId') : event.get('id');
                    var query = {
                        where: {
                            $or: {
                                parentEventId: idToDestroy,
                                id: idToDestroy
                            }
                        }
                    };

                    return this.destroy(query).then(deletedRows => {
                        return deletedRows;
                    }).catch(e => {
                        throw e;
                    });
                }
            }
            
            return null;
        });
    }

    static createRepeatableEvent(req) {
        var data = req.body;
        var members = data.members || [];

        var repeatInterval = data.repeatInterval;
        data.parentEvent = null;
        
        if (repeatInterval && repeatInterval !== parseInt(repeatInterval, 10)) {
            throw new Error('Częstotliwość powtarzania musi być dodatnią liczbą całkowitą');
        }

        if (repeatInterval) {
            var tempCurrentDate = new Date();
            tempCurrentDate.setFullYear(tempCurrentDate.getFullYear() + 1);

            var endDate = data.endDate ? new Date(data.endDate) : tempCurrentDate;

            var createdEvents = null;
            var parentEvent = null;
            var dataArray = [];

            for( var tempDate = new Date(data.date); tempDate <= endDate; tempDate.setDate(tempDate.getDate() + repeatInterval)) {
                var tempEventData = {};
                Object.assign(tempEventData, data);
                tempEventData.date = new Date(tempDate);
                dataArray.push(tempEventData);
            }

            return this.sequelize.transaction(t => {

                return this.create(dataArray[0], { transaction: t }).then(firstEvent => {
                    parentEvent = firstEvent;
                    dataArray.map(singleData => {
                        singleData.parentEvent = firstEvent.id;
                    });

                    dataArray.shift();

                    return this.bulkCreate(dataArray, { transaction: t, returning: true }).then(events => {
                        createdEvents = events;
                        createdEvents.push(parentEvent);
    
                        var membersPromisesArray = [];
                        events.forEach(event => {
                            membersPromisesArray.push(event.setMembers(members, { transaction: t }));
                        });
                        
                        return Promise.all(membersPromisesArray);
                    });
                });

            }).then(events => {
                return createdEvents;
            }).catch(e => {
                throw e;
            });
            
        } else {
            var createdEvent = null;

            return this.sequelize.transaction(t => {

                return this.create(data, { transaction: t }).then(event => {
                    createdEvent = event;
                    return event.setMembers(members, { transaction: t });
                });

            }).then(result => {
                return createdEvent;
            }).catch(e => {
                throw e;
            });
        }
    }

    serialize() {
        var event = {
            id: this.get('id'),
            name: this.get('name'),
            duration: this.get('duration'),
            location: this.get('location'),
            date: this.get('date'),
            description: this.get('description'),
            isDeleted: !!this.get('deletedAt'),
            parentEvent: this.get('parentEventId'),
            repeatInterval: this.get('repeatInterval')
        };

        event.members = this.Members ? this.Members.map(member => {
            return member.serialize();
        }) : undefined;
        event.organizer = this.User ? this.User.serialize() : this.get('organizerId');

        return event;
    }

}


export default Event;