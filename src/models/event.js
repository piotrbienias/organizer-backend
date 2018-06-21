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
            endDate: Sequelize.DATE,
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

    static updateCycle(eventId, data) {
        return this.findById(eventId).then(event => {
            if (event) {

                if (!event.get('repeatInterval')) {
                    throw new Error('To wydarzenie nie nalezy do cyklu!');
                }

                return event.getMembers().then(members => {
                    data.members = members.map(member => {
                        return member.id
                    });

                    return this.createRepeatableEvent(data).then(events => {
                        // return events[0].getParentEvent
                    })
                });

            }
            
            return null;
        });
    }

    static deleteCycle(eventId) {
        return this.findById(eventId).then(event => {
            if (event) {

                if (!event.get('repeatInterval')) {
                    throw new Error('To wydarzenie nie nalezy do cyklu!');
                }

                var idToDestroy = event.get('parentEventId') ? event.get('parentEventId') : event.get('id');
                var query = {
                    where: {
                        $and: {
                            $or: {
                                id: idToDestroy,
                                parentEventId: idToDestroy
                            },
                            id: {
                                $ne: event.get('id')
                            }
                        }
                        
                    }
                };

                return this.sequelize.transaction(t => {

                    return this.destroy(query, { transaction: t }).then(deletedRows => {
                        var updateData = {
                            repeatInterval: null,
                            endDate: null,
                            parentEventId: null
                        };

                        return event.update(updateData, { transaction: t });
                    });

                }).then(self => {
                    return self;
                }).catch(e => {
                    throw e;
                });

                
                
            } else {
                return null;
            }
        }).catch(e => {
            throw e;
        });
    }

    static updateEvent(eventId, data) {
        var updateAll = data.updateAll;

        return this.findById(eventId).then(event => {

            if (event) {
                return this.sequelize.transaction(t => {

                    if (!updateAll) {
                        return event.update(data, { transaction: t }).then(self => {
                            return self.setMembers(data.members, { transaction: t }).then(() => {
                                return self;
                            });
                        });
                    } else {
                        delete data['id'];
                        delete data['date'];
                        delete data['repeatInterval'];
    
                        var idToUpdate = event.get('parentEventId') ? event.get('parentEventId') : event.get('id');
                        var query = {
                            where: {
                                $or: {
                                    parentEventId: idToUpdate,
                                    id: idToUpdate
                                }
                            },
                            returning: true,
                            transaction: t
                        };
    
                        return this.update(data, query).then(result => {
                            
                            var promisesArray = [];
                            result[1].forEach(singleEvent => {
                                promisesArray.push(singleEvent.setMembers(data.members, { transaction: t }));
                            });

                            return Promise.all(promisesArray).then(result => {
                                return event;
                            })
                        });
                    }

                }).then(result => {
                    return result;
                }).catch(e => {
                    throw e;
                });

            }

            return null;
        });
    }

    static deleteEvent(eventId, deleteAll) {
        return this.findById(eventId).then(event => {
            if (event) {

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

    static createRepeatableEvent(data) {
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
            parentEvent: this.get('parentEventId'),
            repeatInterval: this.get('repeatInterval'),
            endDate: this.get('endDate'),
            isDeleted: !!this.get('deletedAt')
        };

        event.members = this.Members ? this.Members.map(member => {
            return member.serialize();
        }) : undefined;
        event.organizer = this.User ? this.User.serialize() : this.get('organizerId');

        return event;
    }

}


export default Event;