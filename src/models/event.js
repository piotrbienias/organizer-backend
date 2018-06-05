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
                }
            }
        });
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'organizerId' });
        this.belongsToMany(models.User, { through: models.EventMember, as: 'Members', foreignKey: 'eventId' });
    }

    static createRepeatableEvent(req) {
        var data = req.body;
        var members = data.members || [];

        data.organizer = req.user ? req.user.id : 1;
        
        if (repeatInterval && repeatInterval !== parseInt(repeatInterval, 10)) {
            throw new Error('Częstotliwość powtarzania musi być dodatnią liczbą całkowitą');
        }

        if (repeatInterval) {
            var tempCurrentDate = new Date();
            tempCurrentDate.setFullYear(tempCurrentDate.getFullYear() + 1);

            var endDate = data.endDate ? new Date(data.endDate) : tempCurrentDate;
            var repeatInterval = data.repeatInterval;
            
            var createdEvents = null;
            var dataArray = [];

            for( var tempDate = new Date(data.date); tempDate <= endDate; tempDate.setDate(tempDate.getDate() + repeatInterval)) {
                var tempEventData = {};
                Object.assign(tempEventData, data);
                tempEventData.date = new Date(tempDate);
                dataArray.push(tempEventData);
            }

            return this.sequelize.transaction(t => {

                return this.bulkCreate(dataArray, { transaction: t, returning: true }).then(events => {
                    createdEvents = events;

                    var membersPromisesArray = [];
                    events.forEach(event => {
                        membersPromisesArray.push(event.setMembers(members, { transaction: t }));
                    });
                    
                    return Promise.all(membersPromisesArray);
                });

            }).then(events => {
                return createdEvents;
            }).catch(e => {
                throw e;
            });
            
        } else {
            return this.create(data);
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