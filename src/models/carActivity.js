'use strict';

import Sequelize from 'sequelize';


class CarActivity extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
            activityName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            price: Sequelize.DECIMAL(10, 2),
            place: Sequelize.STRING,
            currentCourse: Sequelize.INTEGER,
            additionalInfo: Sequelize.TEXT
        }, {
            sequelize: sequelize,
            tableName: 'car_activities',
            timestamps: true,
            paranoid: true
        });
    }

    serialize() {
        return {
            id: this.get('id'),
            activityName: this.get('activityName'),
            date: this.get('date'),
            price: this.get('price'),
            place: this.get('place'),
            currentCourse: this.get('currentCourse'),
            additionalInfo: this.get('additionalInfo')
        };
    }

}


export default CarActivity;