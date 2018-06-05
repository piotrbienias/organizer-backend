'use strict';

import Sequelize from 'sequelize';


class EventMember extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
            memberId: {
                type: Sequelize.INTEGER,
                references: {
                    model: sequelize.models.User,
                    key: 'id'
                },
                allowNull: false,
                primaryKey: true
            },
            eventId: {
                type: Sequelize.INTEGER,
                references: {
                    model: sequelize.models.Event,
                    key: 'id'
                },
                allowNull: false,
                primaryKey: true
            }
        }, {
            sequelize: sequelize,
            timestamps: false,
            paranoid: false,
            tableName: 'event_members'
        });
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'memberId', as: 'member' });
        this.belongsTo(models.Event, { foreignKey: 'eventId' });
    }

}


export default EventMember;