'use strict';

import Sequelize from 'sequelize';


export default class UserCategory extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            }
        }, {
            sequelize: sequelize,
            tableName: 'user_categories',
            timestamps: true,
            paranoid: true
        });
    }

    static associate(models) {
        this.hasMany(models.User, { foreignKey: 'userCategoryId' });
    }

    toJson() {
        return {
            id: this.get('id'),
            name: this.get('name')
        };
    }

}