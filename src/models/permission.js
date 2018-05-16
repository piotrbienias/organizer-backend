'use strict';

import Sequelize from 'sequelize';


export default class Permission extends Sequelize.Model {

    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            label: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            }
        }, {
            sequelize: sequelize,
            tableName: 'permissions',
            timestamps: false,
            paranoid: false
        });
    }

    static associate(models) {
        this.belongsToMany(models.User, { as: 'Users', through: models.UserPermissions, foreignKey: 'permissionId' });
    }

    toJson() {
        return {
            id: this.get('id'),
            name: this.get('name'),
            label: this.get('label')
        };
    }

}